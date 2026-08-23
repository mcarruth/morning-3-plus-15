// Persistence. localStorage, one versioned key.
// Kept behind this module so it can be swapped without touching anything else.

const KEY = 'morning3plus15';
const VERSION = 1;

const DEFAULT_SETTINGS = {
  kettlebellCount: 2,
  defaultWeightLb: 45,
  strengthDurationMinutes: 15,
  recoveryWeekday: 0, // Sunday
  soundEnabled: true,
  weightUnit: 'pounds'
};

function blank() {
  return {
    version: VERSION,
    sessions: [],
    settings: { ...DEFAULT_SETTINGS },
    active: null,
    lapseAckFor: null
  };
}

let state = blank();

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      state = {
        version: VERSION,
        sessions: Array.isArray(data.sessions) ? data.sessions : [],
        settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
        active: data.active || null,
        lapseAckFor: data.lapseAckFor || null
      };
    }
  } catch (e) {
    // A corrupt blob should not brick the app. Start clean rather than crash.
    console.error('Could not read saved data, starting fresh:', e);
    state = blank();
  }
  return state;
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Could not save:', e);
  }
}

export function getState() {
  return state;
}

export function settings() {
  return state.settings;
}

export function updateSettings(patch) {
  state.settings = { ...state.settings, ...patch };
  save();
}

export function sessions() {
  return state.sessions;
}

export function addSession(session) {
  state.sessions.push(session);
  save();
  return session;
}

export function updateSession(id, patch) {
  const i = state.sessions.findIndex(s => s.id === id);
  if (i === -1) return null;
  state.sessions[i] = { ...state.sessions[i], ...patch };
  save();
  return state.sessions[i];
}

// The in-progress session, persisted every tick so a refresh mid-workout
// restores the exact position.
export function getActive() {
  return state.active;
}

export function setActive(active) {
  state.active = active;
  save();
}

export function clearActive() {
  state.active = null;
  save();
}

export function getLapseAck() {
  return state.lapseAckFor;
}

export function setLapseAck(stamp) {
  state.lapseAckFor = stamp;
  save();
}

export function resetRotation() {
  state.sessions = [];
  state.active = null;
  state.lapseAckFor = null;
  save();
}

export function exportJSON() {
  return JSON.stringify(state, null, 2);
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
