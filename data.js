// Exercise library and workout definitions.
// Every workout totals 15 minutes: rounds * intervals.length === 15.

export const EXERCISES = {
  swing: {
    id: 'swing',
    name: 'Two-handed swing',
    short: 'Swing',
    equipment: 'one-kettlebell',
    primaryMuscles: ['glutes', 'hamstrings', 'back'],
    secondaryMuscles: ['core', 'grip'],
    targetType: 'repetitions',
    targetMin: 15,
    targetMax: 20,
    perSide: false,
    cue: 'Snap the hips, float the bell'
  },
  row: {
    id: 'row',
    name: 'Double-bell bent-over row',
    short: 'Row',
    equipment: 'two-kettlebells',
    primaryMuscles: ['back', 'arms'],
    secondaryMuscles: ['core', 'grip'],
    targetType: 'repetitions',
    targetMin: 8,
    targetMax: 10,
    perSide: false,
    cue: 'Brace trunk, pull elbows toward hips'
  },
  farmer: {
    id: 'farmer',
    name: 'Double farmer hold',
    short: 'Farmer carry',
    equipment: 'two-kettlebells',
    primaryMuscles: ['grip', 'core'],
    secondaryMuscles: ['shoulders', 'back'],
    targetType: 'seconds',
    targetMin: 35,
    targetMax: 45,
    perSide: false,
    cue: 'Tall spine, ribs down, breathe'
  },
  frontSquat: {
    id: 'frontSquat',
    name: 'Double front squat',
    short: 'Front squat',
    equipment: 'two-kettlebells',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['core'],
    targetType: 'repetitions',
    targetMin: 6,
    targetMax: 8,
    perSide: false,
    cue: 'Elbows in, sit between the hips',
    substitutionExerciseId: 'gobletSquat'
  },
  gobletSquat: {
    id: 'gobletSquat',
    name: 'Goblet squat',
    short: 'Goblet squat',
    equipment: 'one-kettlebell',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['core'],
    targetType: 'repetitions',
    targetMin: 10,
    targetMax: 12,
    perSide: false,
    cue: 'Chest tall, knees track toes'
  },
  floorPress: {
    id: 'floorPress',
    name: 'Double floor press',
    short: 'Floor press',
    equipment: 'two-kettlebells',
    primaryMuscles: ['chest', 'arms'],
    secondaryMuscles: ['shoulders'],
    targetType: 'repetitions',
    targetMin: 8,
    targetMax: 12,
    perSide: false,
    cue: 'Triceps kiss the floor, then drive'
  },
  plankDrag: {
    id: 'plankDrag',
    name: 'Plank with bell drag',
    short: 'Plank drag',
    equipment: 'bodyweight',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders'],
    targetType: 'seconds',
    targetMin: 30,
    targetMax: 40,
    perSide: false,
    cue: 'Hips still, no rotation'
  },
  reverseLunge: {
    id: 'reverseLunge',
    name: 'Goblet reverse lunge',
    short: 'Reverse lunge',
    equipment: 'one-kettlebell',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['core'],
    targetType: 'repetitions',
    targetMin: 6,
    targetMax: 8,
    perSide: true,
    cue: 'Step back long, knee kisses the floor'
  },
  cleanPress: {
    id: 'cleanPress',
    name: 'One-arm clean and press',
    short: 'Clean + press',
    equipment: 'one-kettlebell',
    primaryMuscles: ['shoulders', 'back'],
    secondaryMuscles: ['core', 'grip'],
    targetType: 'repetitions',
    targetMin: 5,
    targetMax: 8,
    perSide: true,
    cue: 'Tame the arc, lock out overhead',
    substitutionExerciseId: 'halfKneelPress'
  },
  halfKneelPress: {
    id: 'halfKneelPress',
    name: 'Half-kneeling one-arm press',
    short: 'Half-kneel press',
    equipment: 'one-kettlebell',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['core'],
    targetType: 'repetitions',
    targetMin: 5,
    targetMax: 8,
    perSide: true,
    cue: 'Squeeze the down-side glute'
  },
  suitcase: {
    id: 'suitcase',
    name: 'Suitcase hold',
    short: 'Suitcase hold',
    equipment: 'one-kettlebell',
    primaryMuscles: ['core', 'grip'],
    secondaryMuscles: ['shoulders'],
    targetType: 'seconds',
    targetMin: 20,
    targetMax: 30,
    perSide: true,
    cue: 'Do not lean, stay square'
  },
  halo: {
    id: 'halo',
    name: 'Kettlebell halo',
    short: 'Halo',
    equipment: 'one-kettlebell',
    primaryMuscles: ['mobility', 'shoulders'],
    secondaryMuscles: [],
    targetType: 'seconds',
    targetMin: 60,
    perSide: false,
    cue: 'Slow circles, ribs down'
  },
  gluteBridge: {
    id: 'gluteBridge',
    name: 'Glute bridge',
    short: 'Glute bridge',
    equipment: 'bodyweight',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['core'],
    targetType: 'seconds',
    targetMin: 60,
    perSide: false,
    cue: 'Squeeze at the top, do not arch'
  },
  deadBug: {
    id: 'deadBug',
    name: 'Dead bug',
    short: 'Dead bug',
    equipment: 'bodyweight',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    targetType: 'seconds',
    targetMin: 60,
    perSide: false,
    cue: 'Low back stays glued down'
  },
  hipFlexor: {
    id: 'hipFlexor',
    name: 'Hip-flexor mobility',
    short: 'Hip flexor',
    equipment: 'bodyweight',
    primaryMuscles: ['mobility'],
    secondaryMuscles: ['glutes'],
    targetType: 'seconds',
    targetMin: 60,
    perSide: true,
    cue: 'Tuck the pelvis, then lean'
  },
  lightCarry: {
    id: 'lightCarry',
    name: 'Light suitcase carry',
    short: 'Light carry',
    equipment: 'one-kettlebell',
    primaryMuscles: ['core', 'grip'],
    secondaryMuscles: [],
    targetType: 'seconds',
    targetMin: 60,
    perSide: false,
    cue: 'Easy pace, tall posture'
  }
};

export const WORKOUTS = {
  A: {
    id: 'A',
    name: 'Workout A',
    emphasis: 'Hinge + pull',
    rounds: 5,
    intervals: ['swing', 'row', 'farmer']
  },
  B: {
    id: 'B',
    name: 'Workout B',
    emphasis: 'Squat + push',
    rounds: 5,
    intervals: ['frontSquat', 'floorPress', 'plankDrag']
  },
  C: {
    id: 'C',
    name: 'Workout C',
    emphasis: 'Unilateral + shoulders',
    rounds: 5,
    intervals: ['reverseLunge', 'cleanPress', 'suitcase']
  },
  RECOVERY: {
    id: 'RECOVERY',
    name: 'Recovery',
    emphasis: 'Mobility + carries',
    rounds: 3,
    intervals: ['halo', 'gluteBridge', 'deadBug', 'hipFlexor', 'lightCarry']
  }
};

export const STRENGTH_TYPES = ['A', 'B', 'C'];

export function isStrength(type) {
  return STRENGTH_TYPES.includes(type);
}

export function exercise(id) {
  return EXERCISES[id];
}

// Formats a target for display: "15-20", "6/side", "35-45 sec".
export function targetLabel(ex) {
  const range = ex.targetMax && ex.targetMax !== ex.targetMin
    ? ex.targetMin + '-' + ex.targetMax
    : String(ex.targetMin);
  const unit = ex.targetType === 'seconds' ? ' sec' : ' reps';
  return range + unit + (ex.perSide ? ' per side' : '');
}
