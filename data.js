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
    instructions: [
      "Bell about a foot in front of you, feet just outside shoulder width.",
      "Hinge at the hips and tip the bell back between your legs, forearms against your inner thighs.",
      "Snap the hips forward hard and stand tall. The bell floats up to chest height on its own.",
      "Let it fall, hinge again, repeat."
    ],
    watchFor: "Squatting instead of hinging, and lifting with your arms. Your hips throw the bell, not your shoulders.",
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
    instructions: [
      "Bells on the floor just outside each foot, feet hip width.",
      "Hinge until your torso is close to parallel with the floor, back flat.",
      "Grip both handles and pull them toward your hips, elbows tracking back rather than flaring out.",
      "Lower under control until your arms are straight."
    ],
    watchFor: "Standing up as you pull. Your torso angle stays fixed for the whole set.",
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
    instructions: [
      "Bells on the floor either side of your feet.",
      "Hinge, grip both handles, and stand up by driving through your legs.",
      "Stand tall or walk slowly, arms straight, shoulders pulled down and back.",
      "Hold for the time, then hinge to set them down rather than dropping them."
    ],
    watchFor: "Shrugging or leaning back. Ribs down, tall spine, and keep breathing.",
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
    instructions: [
      "Clean both bells to the rack: handles resting on the back of your wrists, bells against your forearms.",
      "Elbows tucked tight to your ribs, feet shoulder width.",
      "Sit down between your hips, chest tall, knees tracking over your toes.",
      "Drive through the whole foot to stand."
    ],
    watchFor: "Elbows drifting out and the chest collapsing forward. If the rack position hurts your wrists, use the goblet squat instead.",
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
    instructions: [
      "Hold one bell by the horns at chest height, close to your body.",
      "Feet shoulder width, toes turned slightly out.",
      "Sit straight down, letting your elbows track inside your knees.",
      "Stand up and squeeze your glutes at the top."
    ],
    watchFor: "Letting the bell drift away from your chest, which pulls you forward onto your toes.",
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
    instructions: [
      "Lie on your back with a bell either side. Roll toward each one, grip it, and pull it onto your chest.",
      "Knees bent, feet flat on the floor.",
      "Press both bells straight up until your elbows lock out.",
      "Lower under control until your triceps touch the floor, pause, then press again."
    ],
    watchFor: "Bouncing your elbows off the floor. The pause is the whole point, and it is what protects your shoulders.",
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
    instructions: [
      "Set up in a high plank with a bell just outside one hand.",
      "Hands slightly wider than your shoulders, feet wide apart for stability.",
      "Reach under with the opposite hand and drag the bell across to the other side.",
      "Alternate hands for the full time."
    ],
    watchFor: "Your hips rotating as you reach. Keep them square to the floor. Widening your feet makes this much easier.",
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
    instructions: [
      "Hold one bell at your chest in the goblet position.",
      "Step one foot back and lower until your back knee lightly touches the floor.",
      "Drive through your front heel to stand back up.",
      "Complete all the reps on one side, then switch."
    ],
    watchFor: "Taking a short step back, which dumps the load onto your front knee. Step back long.",
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
    instructions: [
      "Bell between your feet. Hinge and grip it with one hand.",
      "Pull it up close to your body and keep it there, so it arrives softly in the rack at your shoulder instead of flipping over and banging your wrist.",
      "From the rack, press straight overhead until your arm locks out beside your ear.",
      "Lower to the rack, then back to the floor. All reps one side, then switch."
    ],
    watchFor: "The bell crashing onto your forearm. Keep it close and let your hand rotate around the handle rather than letting the bell swing over it.",
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
    instructions: [
      "Kneel on the knee on the same side as the bell, other foot forward.",
      "Bell in the rack position at your shoulder.",
      "Squeeze the glute of the kneeling leg, then press straight overhead.",
      "Lower under control. All reps, then switch sides."
    ],
    watchFor: "Arching your low back to get the bell up. Ribs down and glute tight fixes it.",
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
    instructions: [
      "One bell on the floor beside you. Hinge and grip it.",
      "Stand tall with the bell hanging at your side like a suitcase.",
      "Resist the sideways pull and stay perfectly square.",
      "Hold for the time, then switch sides."
    ],
    watchFor: "Leaning away from the bell to counterbalance. Not leaning is the entire exercise.",
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
    instructions: [
      "Hold one bell upside down by the horns at chest height.",
      "Circle it slowly around your head, keeping it close to your ears.",
      "Ribs down and torso still. Only your arms move.",
      "Alternate directions as you go."
    ],
    watchFor: "Rushing, and letting your low back arch as the bell passes behind your head.",
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
    instructions: [
      "Lie on your back, knees bent, feet flat and hip width apart.",
      "Push through your heels and lift your hips until you make a straight line from knees to shoulders.",
      "Squeeze your glutes hard at the top for a second.",
      "Lower slowly."
    ],
    watchFor: "Arching your low back to get higher. The height should come from your glutes, not your spine.",
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
    instructions: [
      "Lie on your back, arms straight up, knees and hips bent to ninety degrees.",
      "Press your low back flat into the floor and keep it there the whole time.",
      "Slowly extend one arm overhead and the opposite leg straight out.",
      "Return to the start and alternate sides."
    ],
    watchFor: "Your low back lifting off the floor. If it lifts, use a shorter range.",
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
    instructions: [
      "Half kneeling, one knee down and the other foot forward.",
      "Tuck your pelvis under, as if pointing your beltline up toward your chin.",
      "Holding that tuck, shift your weight gently forward until you feel a stretch at the front of the kneeling hip.",
      "Breathe steadily. Switch sides halfway through."
    ],
    watchFor: "Leaning forward without tucking first. The tuck is what makes the stretch work.",
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
    instructions: [
      "One bell in one hand, hanging at your side.",
      "Walk at an easy pace with a tall posture.",
      "Stay square. Do not lean away from the bell.",
      "Switch hands halfway through."
    ],
    watchFor: "Rushing. This is recovery work, so keep it relaxed and unhurried.",
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

// A search rather than a specific video: no invented URLs, and it never rots.
export function videoSearchUrl(ex) {
  const base = /kettlebell/i.test(ex.name) || ex.equipment === 'bodyweight'
    ? ex.name
    : 'kettlebell ' + ex.name;
  return 'https://www.youtube.com/results?search_query=' +
         encodeURIComponent(base + ' proper form');
}
