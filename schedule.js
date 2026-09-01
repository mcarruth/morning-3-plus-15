// Rotation, streak, prefill and lapse detection.
// Everything here is derived from session history rather than stored, so it
// cannot drift out of sync with the log.

import { WORKOUTS, isStrength, exercise } from './data.js';

export const LAPSE_DAYS = 14;

// Local calendar date as YYYY-MM-DD. Sessions belong to the local day they
// were started on, so a 5am workout lands on the right date.
export function localDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return localDate(dt);
}

export function weekdayOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

function completed(sessions) {
  return sessions.filter(s => s.status === 'completed');
}

function byDateAsc(a, b) {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

// The last completed A, B or C. Recovery and skipped days are invisible here,
// which is what makes Recovery transparent to the rotation.
export function lastCompletedStrength(sessions) {
  const strength = completed(sessions)
    .filter(s => isStrength(s.workoutType))
    .sort(byDateAsc);
  return strength.length ? strength[strength.length - 1].workoutType : null;
}

export function nextStrengthWorkout(last) {
  if (last === 'A') return 'B';
  if (last === 'B') return 'C';
  return 'A'; // covers 'C' and the first session ever
}

// The last completed session that was actual training. Recovery is a rest day
// and must not flip the kettlebell/bodyweight alternation, in the same way it
// does not advance A -> B -> C.
export function lastCompletedTraining(sessions) {
  const training = completed(sessions)
    .filter(s => s.workoutType !== 'RECOVERY')
    .sort(byDateAsc);
  return training.length ? training[training.length - 1].workoutType : null;
}

// What the app proposes today. The calendar only gets to suggest Recovery on
// the configured rest day; the rotation itself is driven by history.
export function todaysWorkout(sessions, settings, date = localDate()) {
  // More than one session can land on a day ("do it again"), so take the
  // latest rather than the first.
  const doneToday = completed(sessions).filter(s => s.date === date);
  if (doneToday.length) return doneToday[doneToday.length - 1].workoutType;

  if (weekdayOf(date) === settings.recoveryWeekday) return 'RECOVERY';

  // Kettlebell and bodyweight alternate, driven by the last completed training
  // day rather than the calendar, so a skipped day cannot desync the pattern.
  // Bodyweight is invisible to the rotation, so a full A -> B -> C cycle now
  // takes six training days.
  const last = lastCompletedTraining(sessions);
  if (last === null) return nextStrengthWorkout(null); // first session ever
  if (last === 'D') return nextStrengthWorkout(lastCompletedStrength(sessions));
  return 'D';
}

// Consecutive days ending yesterday where each day either has a completed
// session or falls on the configured rest day. Today not being done yet does
// not break it, and the prescribed rest day never breaks it.
export function streak(sessions, settings, today = localDate()) {
  const days = new Set(completed(sessions).map(s => s.date));
  let count = 0;
  let cursor = days.has(today) ? today : addDays(today, -1);

  while (true) {
    if (days.has(cursor)) {
      count++;
    } else if (weekdayOf(cursor) === settings.recoveryWeekday) {
      // Rest day passes through without counting or breaking.
    } else {
      break;
    }
    cursor = addDays(cursor, -1);
    if (count > 3650) break; // paranoia
  }
  return count;
}

export function lastCompletedSession(sessions) {
  const done = completed(sessions).sort(byDateAsc);
  return done.length ? done[done.length - 1] : null;
}

export function daysSince(isoStamp, now = Date.now()) {
  if (!isoStamp) return null;
  const then = new Date(isoStamp).getTime();
  if (isNaN(then)) return null;
  return Math.floor((now - then) / 86400000);
}

// Offer a return screen once per lapse.
export function checkLapse(sessions, lapseAckFor) {
  const last = lastCompletedSession(sessions);
  if (!last) return null;

  const stamp = last.completedAt || last.date;
  if (lapseAckFor === stamp) return null;

  const away = daysSince(last.completedAt || `${last.date}T12:00:00`);
  if (away === null || away < LAPSE_DAYS) return null;

  return { days: away, last, stamp };
}

// Prefill from the most recent completed session of the same workout, so
// repeating last week's numbers requires touching nothing.
export function lastResultsFor(sessions, workoutType) {
  const prior = completed(sessions)
    .filter(s => s.workoutType === workoutType)
    .sort(byDateAsc);
  const map = {};
  if (!prior.length) return map;
  for (const r of prior[prior.length - 1].results || []) {
    map[r.exerciseId] = { actual: r.actual, weightLb: r.weightLb };
  }
  return map;
}

// null means the row shows no weight field at all. Recovery never progresses,
// so nothing in it is weighted. Loadable bodyweight movements start at zero
// added load rather than the kettlebell default, because the number means
// weight hung off a belt rather than the weight of the bell.
function startingWeight(ex, prev, workoutType, settings) {
  if (workoutType === 'RECOVERY') return null;
  if (ex.loadable) return prev.weightLb != null ? prev.weightLb : 0;
  if (ex.equipment === 'bodyweight') return null;
  return prev.weightLb != null ? prev.weightLb : settings.defaultWeightLb;
}

// Build the editable rows for a workout, prefilled from history and falling
// back to the bottom of the prescribed range.
export function buildResults(sessions, workoutType, settings, deload = false) {
  const workout = WORKOUTS[workoutType];
  const prior = deload ? {} : lastResultsFor(sessions, workoutType);

  return workout.intervals.map(id => {
    const ex = exercise(id);
    const prev = prior[id] || {};
    return {
      exerciseId: id,
      targetType: ex.targetType,
      target: ex.targetMin,
      actual: prev.actual != null ? prev.actual : ex.targetMin,
      weightLb: startingWeight(ex, prev, workoutType, settings),
      substitutionUsed: null
    };
  });
}
