// EMOM engine.
//
// Remaining time is always derived from timestamps and never decremented, so
// nothing accumulates drift and a mid-workout refresh restores the exact
// position. The engine is generalised over rounds and intervals-per-round
// because Recovery is 3 rounds of 5 while strength work is 5 rounds of 3.

export const INTERVAL_MS = 60000;
export const COUNTDOWN_MS = 3000;
// Seconds remaining at which the per-second countdown ticks begin.
export const CUE_FROM_SECONDS = 5;

export function createTimer({ rounds, intervalsPerRound, onTick, onCue, onComplete }) {
  const totalIntervals = rounds * intervalsPerRound;
  const totalMs = totalIntervals * INTERVAL_MS;

  let startedAt = null;   // wall clock ms; sits in the future during countdown
  let pausedTotal = 0;
  let pausedAt = null;
  let ticker = null;
  let lastInterval = -1;
  let lastCountdownSecond = -1;
  let finished = false;

  function elapsed(now = Date.now()) {
    if (startedAt === null) return -COUNTDOWN_MS;
    const frozen = pausedAt !== null ? pausedAt : now;
    return frozen - startedAt - pausedTotal;
  }

  function read(now = Date.now()) {
    const e = elapsed(now);

    if (e < 0) {
      return {
        phase: 'countdown',
        countdownLeft: Math.max(1, Math.ceil(-e / 1000)),
        intervalIndex: 0,
        round: 1,
        indexInRound: 0,
        msLeft: INTERVAL_MS,
        paused: pausedAt !== null,
        progress: 0
      };
    }

    if (e >= totalMs) {
      return {
        phase: 'done',
        intervalIndex: totalIntervals - 1,
        round: rounds,
        indexInRound: intervalsPerRound - 1,
        msLeft: 0,
        paused: false,
        progress: 1
      };
    }

    const intervalIndex = Math.floor(e / INTERVAL_MS);
    const intoInterval = e % INTERVAL_MS;
    return {
      phase: 'running',
      intervalIndex,
      round: Math.floor(intervalIndex / intervalsPerRound) + 1,
      indexInRound: intervalIndex % intervalsPerRound,
      msLeft: INTERVAL_MS - intoInterval,
      paused: pausedAt !== null,
      progress: intoInterval / INTERVAL_MS
    };
  }

  function tick() {
    const state = read();

    if (state.phase === 'running') {
      if (state.intervalIndex !== lastInterval) {
        lastInterval = state.intervalIndex;
        lastCountdownSecond = -1;
        onCue && onCue('interval', state);
      }
      // One tick per second over the last few seconds. Ticking on each distinct
      // second rather than once on entering the window.
      const secsLeft = Math.ceil(state.msLeft / 1000);
      if (secsLeft <= CUE_FROM_SECONDS && secsLeft > 0 && secsLeft !== lastCountdownSecond) {
        lastCountdownSecond = secsLeft;
        onCue && onCue('countdown-tick', state, secsLeft);
      }
    }

    onTick && onTick(state);

    if (state.phase === 'done' && !finished) {
      finished = true;
      stop();
      onCue && onCue('complete', state);
      onComplete && onComplete(state);
    }
  }

  function run() {
    if (ticker) clearInterval(ticker);
    ticker = setInterval(tick, 100);
    tick();
  }

  return {
    totalIntervals,

    start() {
      startedAt = Date.now() + COUNTDOWN_MS;
      pausedTotal = 0;
      pausedAt = null;
      finished = false;
      lastInterval = -1;
      lastCountdownSecond = -1;
      onCue && onCue('start', read());
      run();
    },

    // Restore an interrupted session from persisted timestamps.
    resumeFrom(saved) {
      startedAt = saved.startedAt;
      pausedTotal = saved.pausedTotal || 0;
      pausedAt = saved.pausedAt || null;
      finished = false;
      // Do not replay cues for intervals that already elapsed while away.
      lastInterval = read().intervalIndex;
      lastCountdownSecond = -1;
      run();
    },

    pause() {
      if (pausedAt !== null || startedAt === null) return;
      pausedAt = Date.now();
      tick();
    },

    resume() {
      if (pausedAt === null) return;
      pausedTotal += Date.now() - pausedAt;
      pausedAt = null;
      tick();
    },

    togglePause() {
      pausedAt === null ? this.pause() : this.resume();
    },

    // Snap to the start of another interval rather than nudging by an offset,
    // so repeated skips cannot leave the clock mid-minute.
    jumpTo(index) {
      const target = Math.max(0, Math.min(totalIntervals - 1, index));
      const base = pausedAt !== null ? pausedAt : Date.now();
      startedAt = base - pausedTotal - target * INTERVAL_MS;
      finished = false;
      lastInterval = target;
      lastCountdownSecond = -1;
      tick();
    },

    next() { this.jumpTo(read().intervalIndex + 1); },
    prev() { this.jumpTo(read().intervalIndex - 1); },

    read,

    serialise() {
      return { startedAt, pausedTotal, pausedAt };
    },

    stop() { stop(); }
  };

  function stop() {
    if (ticker) clearInterval(ticker);
    ticker = null;
  }
}
