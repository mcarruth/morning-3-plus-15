# Morning 3 + 15

Daily kettlebell EMOM timer. Opens straight to today's workout, runs fifteen
minutes, logs what you did, and picks tomorrow's session for you.

The three-mile run is tracked on a Garmin. This app covers the fifteen minutes.

See [SPEC.md](SPEC.md) for the full specification and [Appendix A](SPEC.md) for
how it differs from the original draft.

## Run it

```sh
npm run dev        # or: npx serve .
```

No build step, no dependencies, no framework. Native ES modules loaded straight
from the file system.

## Deploy

Push to GitHub, then import the repo in the Vercel dashboard. Every push to
`main` deploys. There is no CLI step and nothing to configure.

## Files

```
index.html      shell and view markup
styles.css      dark palette, one accent, state colours
app.js          views, home screen, history, wiring
timer.js        EMOM engine
schedule.js     rotation, streak, lapse, prefill
data.js         exercise library and workout definitions
store.js        localStorage behind a small interface
sw.js           offline cache
```

## How the timer works

Remaining time is derived from timestamps on every tick and never decremented:

```
elapsed   = now - startedAt - pausedTotal
interval  = floor(elapsed / 60000)
remaining = 60000 - (elapsed % 60000)
round     = floor(interval / intervalsPerRound) + 1
```

Nothing accumulates drift, and the active session is written to storage as it
runs, so a refresh or a browser suspension mid-workout restores the exact
position. Skipping intervals snaps to a minute boundary rather than nudging by
an offset, so repeated skips cannot leave the clock stranded mid-minute.

The engine is generalised over rounds and intervals-per-round because Recovery
is three rounds of five movements while strength work is five rounds of three.
Both total fifteen minutes.

## Rotation

`A -> B -> C -> A`, driven by the last completed **strength** session, which is
derived from history rather than stored so it cannot drift out of sync.

Recovery and skipped days are invisible to the rotation. Finish B on Friday,
skip Saturday, do Recovery on Sunday, and Monday is still C.

## Streak

Consecutive days ending yesterday where each day either has a completed session
or falls on the configured rest day. The prescribed rest day never breaks it,
and today not being done yet does not break it. A deliberate skip does.

## iOS notes

- **No haptics.** Safari on iOS does not implement the Vibration API, so the
  spec's haptic cues and vibration toggle were cut rather than shipped as a
  dead switch.
- **The workout does not run with the screen locked.** Backgrounding an iOS PWA
  throttles timers and suspends the audio context. Wake Lock holds the screen on
  instead, so the phone stays awake and unlocked for the fifteen minutes.
- **Audio is unlocked on the Start tap.** The AudioContext is created inside
  that click handler. Built any later it starts suspended and the first cue is
  silent. If iOS reloads the page mid-session, the restored timer has had no
  gesture and cannot make sound, so it shows "Tap anywhere to turn sound back
  on" and the next tap fixes it.
- **Cues:** one beep at the top of each minute, then a tick every second over
  the last five seconds.
- **Storage is the only copy.** `Copy my data` at the bottom of History puts the
  full JSON on the clipboard. There is no file download, because an installed
  iOS PWA cannot reliably trigger one.
- **A deploy appears on the second launch.** The service worker is cache-first
  so the app opens instantly offline, and refreshes its cache in the background.

## Exercise help

Tapping any exercise name, on the home screen or mid-workout, opens numbered
instructions and a "watch for" note covering the most common way that movement
goes wrong. All sixteen exercises are covered, and the text is bundled so it
works offline like everything else.

The "Watch on YouTube" button opens a *search* for the movement rather than a
specific video. No invented URLs, and nothing to rot. It is the one thing in the
app that needs a connection.

Opening help during a session does not pause anything. The timer runs off
timestamps and does not care what is on screen.

## Decisions that deviate from the spec

- **Home shows today's exercises inline** rather than behind a preview screen.
  It gives you the "set your numbers before you start" surface without adding a
  tap to every morning.
- **Swap-to-Recovery is available before starting, not mid-workout.** The spec
  asked for it at any time, but swapping mid-session would discard the round
  structure already in progress. Mid-workout scaling is limited to dropping a
  round, which is the change actually wanted at that moment.
- **Recovery carries no weight fields.** It never progresses, so logging load
  for it is noise.
- **Results are per exercise, not per round.** Three numbers per session rather
  than fifteen.

## Phase 2

Progression engine, dashboard metrics beyond the streak, pain flagging with
automatic substitution prompts, and voice countdown. Sections 10, 11 and 9.3 of
the spec.
