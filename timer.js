// EMOM engine.
//
// Remaining time is always derived from timestamps and never decremented, so
// nothing accumulates drift and a mid-workout refresh restores the exact
// position. The engine is generalised over rounds and intervals-per-round
// because Recovery is 3 rounds of 5 one-minute blocks.
//
// Each minute can optionally be split into work and rest (40/20 on training
// days). Without a split the whole minute is work, which is what Recovery
// uses. Either way the interval itself is always one minute, so skipping and
// scaling still snap to minute boundaries.

export const INTERVAL_MS = 60000;
export const COUNTDOWN_MS = 3000;
// Seconds remaining in a segment at which the per-second ticks begin. Shorter
// when the minute is split, so the ticks do not swallow the whole rest.
export const CUE_FROM_SECONDS = 5;
export const CUE_FROM_SECONDS_SPLIT = 3;

export function createTimer({ rounds, intervalsPerRound, workMs = null, onTick, onCue, onComplete }) {
  const totalIntervals = rounds * intervalsPerRound;
  const totalMs = totalIntervals * INTERVAL_MS;
  const split = workMs !== null && workMs > 0 && workMs < INTERVAL_MS;
  const workLen = split ? workMs : INTERVAL_MS;
  const cueFrom = split ? CUE_FROM_SECONDS_SPLIT : CUE_FROM_SECONDS;

  let startedAt = null;   // wall clock ms; sits in the future during countdown
  let pausedTotal = 0;
  let pausedAt = null;
  let ticker = null;
  let lastInterval = -1;
  let lastSegment = null;
  let lastHalf = -1;
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
        segment: 'work',
        segMsLeft: workLen,
        segProgress: 0,
        split,
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
        segment: split ? 'rest' : 'work',
        segMsLeft: 0,
        segProgress: 1,
        split,
        paused: false,
        progress: 1
      };
    }

    const intervalIndex = Math.floor(e / INTERVAL_MS);
    const intoInterval = e % INTERVAL_MS;
    const working = intoInterval < workLen;
    return {
      phase: 'running',
      intervalIndex,
      round: Math.floor(intervalIndex / intervalsPerRound) + 1,
      indexInRound: intervalIndex % intervalsPerRound,
      msLeft: INTERVAL_MS - intoInterval,
      segment: working ? 'work' : 'rest',
      segMsLeft: working ? workLen - intoInterval : INTERVAL_MS - intoInterval,
      segProgress: working
        ? intoInterval / workLen
        : (intoInterval - workLen) / (INTERVAL_MS - workLen),
      // True from the middle of the work segment onward, for "switch sides".
      pastHalf: intoInterval >= workLen / 2,
      split,
      paused: pausedAt !== null,
      progress: intoInterval / INTERVAL_MS
    };
  }

  // Mark the current position as already cued, so restoring or jumping does
  // not replay cues for time that has already passed.
  function settle(state) {
    lastInterval = state.intervalIndex;
    lastSegment = state.segment;
    lastHalf = state.pastHalf ? state.intervalIndex : -1;
    lastCountdownSecond = -1;
  }

  function tick() {
    const state = read();

    if (state.phase === 'running') {
      if (state.intervalIndex !== lastInterval) {
        lastInterval = state.intervalIndex;
        lastSegment = state.segment;
        lastCountdownSecond = -1;
        onCue && onCue('interval', state);
      } else if (state.segment !== lastSegment) {
        lastSegment = state.segment;
        lastCountdownSecond = -1;
        onCue && onCue('rest', state);
      }

      if (state.segment === 'work' && state.pastHalf && lastHalf !== state.intervalIndex) {
        lastHalf = state.intervalIndex;
        onCue && onCue('half', state);
      }

      // One tick per second over the last few seconds of each segment.
      const secsLeft = Math.ceil(state.segMsLeft / 1000);
      if (secsLeft <= cueFrom && secsLeft > 0 && secsLeft !== lastCountdownSecond) {
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
    split,

    start() {
      startedAt = Date.now() + COUNTDOWN_MS;
      pausedTotal = 0;
      pausedAt = null;
      finished = false;
      lastInterval = -1;
      lastSegment = null;
      lastHalf = -1;
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
      settle(read());
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
      settle(read());
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
