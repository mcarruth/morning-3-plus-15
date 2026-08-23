import { WORKOUTS, exercise, targetLabel, isStrength, videoSearchUrl } from './data.js';
import * as store from './store.js';
import { createTimer } from './timer.js';
import {
  localDate, todaysWorkout, streak, buildResults, checkLapse,
  lastCompletedSession, LAPSE_DAYS
} from './schedule.js';

const $ = id => document.getElementById(id);

let session = null;   // the session being performed
let timer = null;
let wakeLock = null;
let audioCtx = null;
let saveTick = 0;

/* ---------------- audio ---------------- */

// Created inside the Start handler. Built any later and iOS starts it
// suspended, which silences the first cue.
function unlockAudio() {
  if (!store.settings().soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) {
    console.warn('Audio unavailable:', e);
  }
}

function beep(freq, ms, gain = 0.25) {
  if (!audioCtx || !store.settings().soundEnabled) return;
  try {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.connect(g); g.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + ms / 1000);
    osc.start();
    osc.stop(audioCtx.currentTime + ms / 1000);
  } catch (e) { /* never let a missing cue break the workout */ }
}

function cue(kind) {
  if (kind === 'start' || kind === 'interval') { beep(880, 220, 0.3); }
  else if (kind === 'final-ten') { beep(560, 90, 0.16); }
  else if (kind === 'complete') {
    beep(523, 160); setTimeout(() => beep(659, 160), 170); setTimeout(() => beep(784, 340), 340);
  }
}

/* ---------------- wake lock ---------------- */

async function acquireWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (e) {
    console.warn('Wake lock refused:', e);
  }
}

function releaseWakeLock() {
  try { wakeLock && wakeLock.release(); } catch (e) { /* noop */ }
  wakeLock = null;
}

// iOS drops the lock when the app is backgrounded; take it again on return.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && timer && !wakeLock) acquireWakeLock();
});

/* ---------------- view routing ---------------- */

function show(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
  window.scrollTo(0, 0);
}

function overlay(id, on) { $(id).classList.toggle('active', on); }

function confirmAction(title, text, onYes) {
  $('confirmTitle').textContent = title;
  $('confirmText').textContent = text;
  overlay('ovConfirm', true);
  $('confirmYes').onclick = () => { overlay('ovConfirm', false); onYes(); };
}

/* ---------------- editable rows ---------------- */

function stepValue(result, field, delta) {
  const ex = exercise(result.exerciseId);
  if (field === 'actual') {
    const step = ex.targetType === 'seconds' ? 5 : 1;
    result.actual = Math.max(0, Math.min(999, (result.actual || 0) + delta * step));
  } else {
    result.weightLb = Math.max(0, Math.min(300, (result.weightLb || 0) + delta * 5));
  }
}

function makeStepper(result, field, onChange, secondary) {
  const ex = exercise(result.exerciseId);
  const wrap = document.createElement('div');
  wrap.className = 'stepper' + (secondary ? ' secondary' : '');

  const minus = document.createElement('button');
  minus.type = 'button'; minus.textContent = '−';
  minus.setAttribute('aria-label', 'Decrease');

  const val = document.createElement('div');
  val.className = 'val';

  const plus = document.createElement('button');
  plus.type = 'button'; plus.textContent = '+';
  plus.setAttribute('aria-label', 'Increase');

  const paint = () => {
    if (field === 'actual') {
      const unit = ex.targetType === 'seconds' ? 'sec' : (ex.perSide ? 'per side' : 'reps');
      val.innerHTML = `${result.actual ?? 0}<small>${unit}</small>`;
    } else {
      val.innerHTML = `${result.weightLb ?? 0}<small>lb</small>`;
    }
  };

  const bump = d => { stepValue(result, field, d); paint(); onChange && onChange(); };
  minus.onclick = () => bump(-1);
  plus.onclick = () => bump(1);

  paint();
  wrap.append(minus, val, plus);
  return wrap;
}

function renderRow(result, onChange, opts = {}) {
  const ex = exercise(result.exerciseId);
  const row = document.createElement('div');
  row.className = 'row';

  if (!opts.hideHead) {
    const head = document.createElement('div');
    head.className = 'row-head';

    const nameBtn = document.createElement('button');
    nameBtn.type = 'button';
    nameBtn.className = 'row-name name-btn';
    nameBtn.textContent = ex.name;
    nameBtn.onclick = () => openHelp(ex.id);

    const target = document.createElement('span');
    target.className = 'row-target';
    target.textContent = targetLabel(ex);

    head.append(nameBtn, target);
    row.appendChild(head);
  }

  const fields = document.createElement('div');
  fields.className = 'row-fields';
  fields.appendChild(makeStepper(result, 'actual', onChange, false));
  if (result.weightLb !== null && result.weightLb !== undefined) {
    fields.appendChild(makeStepper(result, 'weightLb', onChange, true));
  }
  row.appendChild(fields);
  return row;
}

/* ---------------- exercise help ---------------- */

function openHelp(exerciseId) {
  const ex = exercise(exerciseId);
  if (!ex) return;

  $('helpName').textContent = ex.name;
  $('helpTarget').textContent = targetLabel(ex);

  const steps = $('helpSteps');
  steps.innerHTML = '';
  (ex.instructions || []).forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    steps.appendChild(li);
  });

  $('helpWatch').textContent = ex.watchFor || '';
  $('helpVideo').href = videoSearchUrl(ex);
  overlay('ovHelp', true);
}

/* ---------------- home ---------------- */

function prettyDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

let homeDraft = null;   // results edited on the home screen before starting
let override = null;    // manually chosen workout, wins over the rotation for today

function renderHome() {
  const sessions = store.sessions();
  const settings = store.settings();
  const today = localDate();
  const type = override || todaysWorkout(sessions, settings, today);
  const workout = WORKOUTS[type];

  const hour = new Date().getHours();
  $('greeting').textContent =
    (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening') + ', Michael';

  $('todayDate').textContent = prettyDate(today);

  const n = streak(sessions, settings, today);
  $('streakLabel').innerHTML = n > 0 ? `<strong>${n}</strong> day streak` : 'No streak yet';

  $('homeWorkout').textContent = workout.name;
  $('homeEmphasis').textContent = workout.emphasis;

  const todaysDone = sessions.filter(s => s.date === today && s.status === 'completed');
  const doneToday = todaysDone[todaysDone.length - 1];
  const skippedToday = sessions.find(s => s.date === today && s.status === 'skipped');

  if (!homeDraft || homeDraft.type !== type) {
    homeDraft = { type, results: buildResults(sessions, type, settings) };
  }

  const rows = $('homeRows');
  rows.innerHTML = '';
  if (doneToday) {
    rows.innerHTML = `<div class="empty">Finished today. ${doneToday.roundsCompleted} rounds.</div>`;
  } else {
    homeDraft.results.forEach(r => rows.appendChild(renderRow(r, null)));
  }

  $('startBtn').textContent = doneToday ? 'Do it again' : 'Start 15 Minutes';
  $('skipBtn').style.visibility = (doneToday || skippedToday) ? 'hidden' : 'visible';

  const last = lastCompletedSession(sessions);
  $('lastSession').innerHTML = last && last.date !== today
    ? `<div class="rows" style="border-bottom:none;margin-bottom:0">
         <div class="eyebrow" style="margin:20px 0 8px">Last session</div>
         <div class="hist-sub" style="font-size:0.9rem">
           ${WORKOUTS[last.workoutType].name} · ${last.roundsCompleted} rounds · ${prettyDate(last.date)}
         </div>
       </div>`
    : '';
}

/* ---------------- running a session ---------------- */

function beginSession(type, results, roundsPlanned, deload) {
  const workout = WORKOUTS[type];
  session = {
    id: store.newId(),
    date: localDate(),
    startedAt: new Date().toISOString(),
    workoutType: type,
    status: 'active',
    roundsPlanned: roundsPlanned || workout.rounds,
    roundsCompleted: 0,
    manualOverride: type !== todaysWorkout(store.sessions(), store.settings()),
    postLapseDeload: !!deload,
    results
  };

  timer = createTimer({
    rounds: session.roundsPlanned,
    intervalsPerRound: workout.intervals.length,
    onTick: paintTimer,
    onCue: cue,
    onComplete: finishSession
  });

  unlockAudio();
  acquireWakeLock();
  show('timer');
  timer.start();
  persistActive();
}

function persistActive() {
  if (!session || !timer) return;
  store.setActive({ session, timer: timer.serialise() });
}

function restoreActive() {
  const saved = store.getActive();
  if (!saved || !saved.session) return false;

  session = saved.session;
  const workout = WORKOUTS[session.workoutType];
  timer = createTimer({
    rounds: session.roundsPlanned,
    intervalsPerRound: workout.intervals.length,
    onTick: paintTimer,
    onCue: cue,
    onComplete: finishSession
  });
  acquireWakeLock();
  show('timer');
  timer.resumeFrom(saved.timer);
  return true;
}

function currentResult(state) {
  const workout = WORKOUTS[session.workoutType];
  const exId = workout.intervals[state.indexInRound];
  return session.results.find(r => r.exerciseId === exId);
}

let paintedInterval = -1;

function paintTimer(state) {
  const workout = WORKOUTS[session.workoutType];
  const rounds = session.roundsPlanned;

  $('timerWorkout').textContent = workout.name;
  $('timerRound').textContent = `Round ${Math.min(state.round, rounds)}/${rounds}`;

  // clock + ring
  if (state.phase === 'countdown') {
    $('clock').textContent = state.countdownLeft;
    $('clock').classList.add('countdown');
    setRing(0, false);
  } else {
    $('clock').classList.remove('countdown');
    const secs = Math.ceil(state.msLeft / 1000);
    $('clock').textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    setRing(state.progress, secs <= 10);
  }

  $('pausedFlag').textContent = state.paused ? 'Paused' : '';
  $('pauseBtn').textContent = state.paused ? 'Resume' : 'Pause';

  // round dots
  const dots = $('roundDots');
  if (dots.childElementCount !== rounds) {
    dots.innerHTML = '';
    for (let i = 0; i < rounds; i++) dots.appendChild(Object.assign(document.createElement('div'), { className: 'dot' }));
  }
  [...dots.children].forEach((d, i) => {
    d.className = 'dot' + (i + 1 < state.round ? ' done' : i + 1 === state.round ? ' current' : '');
  });

  // exercise details only repaint on interval change
  if (state.intervalIndex !== paintedInterval || paintedInterval === -1) {
    paintedInterval = state.intervalIndex;
    const ex = exercise(workout.intervals[state.indexInRound]);
    $('nowName').textContent = ex.name;
    $('nowName').onclick = () => openHelp(ex.id);
    $('nowTarget').textContent = targetLabel(ex);
    $('nowCue').textContent = ex.cue;

    const nextIdx = state.intervalIndex + 1;
    if (nextIdx < timer.totalIntervals) {
      const nx = exercise(workout.intervals[nextIdx % workout.intervals.length]);
      $('upNext').textContent = `Next: ${nx.short} · ${nx.targetMin}${nx.targetType === 'seconds' ? ' sec' : ''}`;
    } else {
      $('upNext').textContent = 'Last interval';
    }

    const fields = $('timerFields');
    fields.innerHTML = '';
    const r = currentResult(state);
    if (r) fields.appendChild(renderRow(r, persistActive, { hideHead: true }));
  }

  session.roundsCompleted = Math.max(session.roundsCompleted, Math.min(state.round - 1, rounds));
  if (state.phase === 'done') session.roundsCompleted = rounds;

  if (++saveTick % 20 === 0) persistActive();
}

const RING_LEN = 2 * Math.PI * 46;
function setRing(progress, warn) {
  const fill = $('ringFill');
  fill.style.strokeDasharray = RING_LEN;
  fill.style.strokeDashoffset = RING_LEN * progress;
  $('ring').classList.toggle('warn', !!warn);
}

function finishSession(state) {
  session.status = 'completed';
  session.completedAt = new Date().toISOString();
  session.roundsCompleted = session.roundsPlanned;
  store.addSession(session);
  store.clearActive();
  releaseWakeLock();
  override = null;

  $('doneTitle').textContent = `${WORKOUTS[session.workoutType].name} complete`;
  const n = streak(store.sessions(), store.settings());
  $('doneText').textContent =
    `${session.roundsCompleted} rounds. That is ${n} day${n === 1 ? '' : 's'} in a row.`;
  overlay('ovDone', true);

  timer = null;
  session = null;
  paintedInterval = -1;
}

function endEarly() {
  if (!session) return;
  const state = timer.read();
  timer.stop();
  session.status = 'completed';
  session.completedAt = new Date().toISOString();
  session.roundsCompleted = state.phase === 'countdown' ? 0 : Math.max(0, state.round - 1);
  store.addSession(session);
  store.clearActive();
  releaseWakeLock();
  timer = null; session = null; paintedInterval = -1;
  override = null;
  renderHome(); show('home');
}

/* ---------------- history ---------------- */

function renderHistory() {
  const list = $('histList');
  const sessions = [...store.sessions()].sort((a, b) => (a.date < b.date ? 1 : -1));
  list.innerHTML = '';

  if (!sessions.length) {
    list.innerHTML = '<div class="empty">Nothing logged yet.</div>';
    return;
  }

  sessions.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'hist-item';
    const scaled = s.status === 'completed' && s.roundsCompleted < WORKOUTS[s.workoutType].rounds;
    const pill = s.status === 'skipped' ? 'skipped' : scaled ? 'scaled' : 'done';
    const pillText = s.status === 'skipped' ? 'skipped' : `${s.roundsCompleted} rd`;
    const summary = (s.results || [])
      .map(r => `${exercise(r.exerciseId).short} ${r.actual ?? '—'}`).join(' · ');

    btn.innerHTML = `
      <span class="hist-date">${s.date.slice(5).replace('-', '/')}</span>
      <span class="hist-main">
        <span class="hist-title">${WORKOUTS[s.workoutType].name}${s.manualOverride ? ' *' : ''}</span>
        <span class="hist-sub">${s.status === 'skipped' ? 'Not today' : summary}</span>
      </span>
      <span class="pill ${pill}">${pillText}</span>`;
    btn.onclick = () => openSession(s.id);
    list.appendChild(btn);
  });
}

function openSession(id) {
  const s = store.sessions().find(x => x.id === id);
  if (!s) return;
  $('sessTitle').textContent = WORKOUTS[s.workoutType].name;
  $('sessSub').textContent = `${prettyDate(s.date)} · ${s.status === 'skipped' ? 'skipped' : s.roundsCompleted + ' rounds'}`;

  const rows = $('sessRows');
  rows.innerHTML = '';
  if (!s.results || !s.results.length) {
    rows.innerHTML = '<div class="empty">Nothing to edit.</div>';
  } else {
    s.results.forEach(r => rows.appendChild(
      renderRow(r, () => store.updateSession(s.id, { results: s.results }))
    ));
  }
  show('session');
}

/* ---------------- lapse ---------------- */

function maybeShowLapse() {
  const lapse = checkLapse(store.sessions(), store.getLapseAck());
  if (!lapse) return;

  const next = todaysWorkout(store.sessions(), store.settings());
  $('lapseText').innerHTML =
    `It has been ${lapse.days} days since ${WORKOUTS[lapse.last.workoutType].name}.<br>` +
    `Picking up at ${WORKOUTS[next].name}.`;

  $('lapseDeload').onclick = () => {
    store.setLapseAck(lapse.stamp);
    homeDraft = { type: next, results: buildResults(store.sessions(), next, store.settings(), true) };
    overlay('ovLapse', false);
    renderHome();
  };
  $('lapseResume').onclick = () => {
    store.setLapseAck(lapse.stamp);
    overlay('ovLapse', false);
  };
  overlay('ovLapse', true);
}

/* ---------------- wiring ---------------- */

$('startBtn').onclick = () => {
  const type = homeDraft.type;
  beginSession(type, homeDraft.results, WORKOUTS[type].rounds, false);
};

$('skipBtn').onclick = () => {
  const type = todaysWorkout(store.sessions(), store.settings());
  confirmAction('Skip today?', 'This records the day as skipped. It does not advance the rotation, and it breaks your streak.', () => {
    store.addSession({
      id: store.newId(), date: localDate(), workoutType: type, status: 'skipped',
      roundsPlanned: 0, roundsCompleted: 0, manualOverride: false,
      postLapseDeload: false, results: []
    });
    override = null;
    renderHome();
  });
};

$('changeBtn').onclick = () => {
  const box = $('changeOptions');
  box.innerHTML = '';
  ['A', 'B', 'C', 'RECOVERY'].forEach(type => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = `${WORKOUTS[type].name} · ${WORKOUTS[type].emphasis}`;
    b.style.textTransform = 'none';
    b.onclick = () => {
      override = type;
      homeDraft = null;
      overlay('ovChange', false);
      renderHome();
    };
    box.appendChild(b);
  });
  overlay('ovChange', true);
};
$('changeCancel').onclick = () => overlay('ovChange', false);
$('confirmNo').onclick = () => overlay('ovConfirm', false);

$('pauseBtn').onclick = () => { timer && timer.togglePause(); persistActive(); };
$('prevBtn').onclick = () => { timer && timer.prev(); persistActive(); };
$('nextBtn').onclick = () => { timer && timer.next(); persistActive(); };

$('scaleBtn').onclick = () => {
  if (!session || !timer) return;
  const workout = WORKOUTS[session.workoutType];
  const target = session.roundsPlanned === workout.rounds ? workout.rounds - 1 : workout.rounds;
  const state = timer.read();
  session.roundsPlanned = target;
  $('scaleBtn').textContent = target === workout.rounds
    ? `Drop to ${workout.rounds - 1} rounds` : `Back to ${workout.rounds} rounds`;

  const spent = state.phase === 'countdown' ? 0 : state.intervalIndex;
  timer.stop();
  timer = createTimer({
    rounds: target, intervalsPerRound: workout.intervals.length,
    onTick: paintTimer, onCue: cue, onComplete: finishSession
  });
  timer.resumeFrom({ startedAt: Date.now() - spent * 60000, pausedTotal: 0, pausedAt: null });
  paintedInterval = -1;
  persistActive();
};

$('abandonBtn').onclick = () => {
  confirmAction('End this session?', 'Completed rounds are kept and the rotation advances.', endEarly);
};

$('doneClose').onclick = () => { overlay('ovDone', false); renderHome(); show('home'); };

$('historyBtn').onclick = () => { renderHistory(); show('history'); };
$('histBackBtn').onclick = () => { renderHome(); show('home'); };
$('sessBackBtn').onclick = () => { renderHistory(); show('history'); };

$('copyDataBtn').onclick = async () => {
  const json = store.exportJSON();
  $('exportBox').value = json;
  let copied = false;
  try {
    await navigator.clipboard.writeText(json);
    copied = true;
  } catch (e) { /* fall through to manual selection */ }
  $('exportNote').textContent = copied
    ? 'Copied to the clipboard. Paste it somewhere safe.'
    : 'Select the text below and copy it.';
  overlay('ovExport', true);
};
$('exportClose').onclick = () => overlay('ovExport', false);
$('helpClose').onclick = () => overlay('ovHelp', false);
$('ovHelp').onclick = e => { if (e.target === $('ovHelp')) overlay('ovHelp', false); };

/* ---------------- boot ---------------- */

store.load();

if (!restoreActive()) {
  renderHome();
  maybeShowLapse();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(e => console.warn('SW failed:', e));
  });
}
