// Exercise library and workout definitions.
// Every workout totals 15 minutes: rounds * intervals.length === 15.
// Training days split each minute into 40 seconds of work and 20 of rest, so
// rep targets are what a solid 40 seconds looks like, not a fixed set to
// finish early. Per-side exercises switch at the halfway beep.

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
    targetMin: 40,
    perSide: false,
    instructions: [
      "Bells on the floor either side of your feet.",
      "Hinge, grip both handles, and stand up by driving through your legs.",
      "Stand tall or walk slowly, arms straight, shoulders pulled down and back.",
      "Hold for the full 40 seconds, then hinge to set them down rather than dropping them."
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
    targetMin: 8,
    targetMax: 10,
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
    targetMin: 40,
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
    targetMin: 5,
    targetMax: 6,
    perSide: true,
    instructions: [
      "Hold one bell at your chest in the goblet position.",
      "Step one foot back and lower until your back knee lightly touches the floor.",
      "Drive through your front heel to stand back up.",
      "Stay on one leg, then switch at the halfway beep."
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
    targetMin: 4,
    targetMax: 6,
    perSide: true,
    instructions: [
      "Bell between your feet. Hinge and grip it with one hand.",
      "Pull it up close to your body and keep it there, so it arrives softly in the rack at your shoulder instead of flipping over and banging your wrist.",
      "From the rack, press straight overhead until your arm locks out beside your ear.",
      "Lower to the rack, then back to the floor. Switch arms at the halfway beep."
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
    perSide: true,
    instructions: [
      "One bell on the floor beside you. Hinge and grip it.",
      "Stand tall with the bell hanging at your side like a suitcase.",
      "Resist the sideways pull and stay perfectly square.",
      "Switch sides at the halfway beep."
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
    switchHalfway: true,
    instructions: [
      "One bell in one hand, hanging at your side.",
      "Walk at an easy pace with a tall posture.",
      "Stay square. Do not lean away from the bell.",
      "Switch hands halfway through."
    ],
    watchFor: "Rushing. This is recovery work, so keep it relaxed and unhurried.",
    cue: 'Easy pace, tall posture'
  },
  pullup: {
    id: 'pullup',
    name: 'Pull-up',
    short: 'Pull-up',
    equipment: 'bodyweight',
    loadable: true,
    primaryMuscles: ['back', 'arms'],
    secondaryMuscles: ['core', 'grip'],
    targetType: 'repetitions',
    targetMin: 5,
    targetMax: 7,
    perSide: false,
    instructions: [
      "Hang from the bar with your hands a little wider than your shoulders, palms facing away.",
      "Pull your shoulder blades down and back before your arms do anything.",
      "Pull until your chin clears the bar, leading with your chest rather than your chin.",
      "Lower all the way to straight arms under control."
    ],
    watchFor: "Cutting the bottom short. A half rep from a bent-arm hang is not a rep. Straight arms every time.",
    cue: 'Shoulders down first, chest to the bar'
  },
  pushup: {
    id: 'pushup',
    name: 'Push-up',
    short: 'Push-up',
    equipment: 'bodyweight',
    loadable: true,
    primaryMuscles: ['chest', 'arms'],
    secondaryMuscles: ['shoulders', 'core'],
    targetType: 'repetitions',
    targetMin: 12,
    targetMax: 16,
    perSide: false,
    instructions: [
      "High plank, hands under your shoulders, body in one line from heels to head.",
      "Lower until your chest is a fist off the floor, elbows tracking back at about 45 degrees.",
      "Press back up and finish with your elbows straight.",
      "Squeeze your glutes the whole time to keep the line."
    ],
    watchFor: "Hips sagging or piking, and elbows flaring straight out to the sides. Move as one plank.",
    cue: 'One straight line, elbows back'
  },
  dip: {
    id: 'dip',
    name: 'Dip',
    short: 'Dip',
    equipment: 'bodyweight',
    loadable: true,
    primaryMuscles: ['chest', 'arms'],
    secondaryMuscles: ['shoulders'],
    targetType: 'repetitions',
    targetMin: 5,
    targetMax: 8,
    perSide: false,
    instructions: [
      "Support yourself on the parallel bars with straight arms and your shoulders pushed down away from your ears.",
      "Lean your torso forward slightly and bend your knees to keep your feet clear.",
      "Lower until your upper arms are about parallel to the floor.",
      "Press back to straight arms."
    ],
    watchFor: "Going deeper than parallel, which puts the shoulder in a bad spot for no extra benefit. Stop at parallel.",
    cue: 'Shoulders down, stop at parallel'
  },
  pushPress: {
    id: 'pushPress',
    name: 'Double push press',
    short: 'Push press',
    equipment: 'two-kettlebells',
    primaryMuscles: ['shoulders', 'arms'],
    secondaryMuscles: ['quadriceps', 'core'],
    targetType: 'repetitions',
    targetMin: 6,
    targetMax: 8,
    perSide: false,
    instructions: [
      "Clean both bells to the rack, elbows tucked against your ribs.",
      "Dip a few inches by bending your knees, torso staying upright.",
      "Drive up hard through your legs and use that pop to punch both bells overhead.",
      "Lock out with your biceps by your ears, then lower back to the rack."
    ],
    watchFor: "Leaning back to finish the press. Squeeze your glutes and keep your ribs down so the bells finish over your shoulders, not behind them.",
    cue: 'Dip, drive, punch the ceiling'
  },
  slRdl: {
    id: 'slRdl',
    name: 'Single-leg Romanian deadlift',
    short: 'SL deadlift',
    equipment: 'one-kettlebell',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['core', 'grip'],
    targetType: 'repetitions',
    targetMin: 5,
    targetMax: 6,
    perSide: true,
    instructions: [
      "Hold one bell in the hand opposite your standing leg.",
      "Soft knee on the standing leg. Hinge forward as the free leg reaches straight back.",
      "Lower until you feel a stretch in the back of the standing leg, hips square to the floor.",
      "Drive the standing hip forward to stand tall. Switch legs at the halfway beep."
    ],
    watchFor: "Hips opening up toward the ceiling as the back leg rises. Point the back toes at the floor to keep them square.",
    cue: 'Hips square, reach long'
  },
  lateralLunge: {
    id: 'lateralLunge',
    name: 'Goblet lateral lunge',
    short: 'Lateral lunge',
    equipment: 'one-kettlebell',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['adductors', 'core'],
    targetType: 'repetitions',
    targetMin: 8,
    targetMax: 10,
    perSide: false,
    instructions: [
      "Hold one bell at your chest in the goblet position, feet together.",
      "Take a big step out to the side and sit back into that hip, the other leg straight.",
      "Keep both feet flat and pointing forward.",
      "Push back to the start and alternate sides. Count every rep."
    ],
    watchFor: "The working knee caving inward or the heel lifting. Sit back into the hip rather than down onto the knee.",
    cue: 'Sit back into the hip'
  },
  gorillaRow: {
    id: 'gorillaRow',
    name: 'Gorilla row',
    short: 'Gorilla row',
    equipment: 'two-kettlebells',
    primaryMuscles: ['back', 'arms'],
    secondaryMuscles: ['core', 'grip'],
    targetType: 'repetitions',
    targetMin: 10,
    targetMax: 12,
    perSide: false,
    instructions: [
      "Bells on the floor between your feet, feet a little wider than shoulder width.",
      "Hinge with soft knees until your torso is close to parallel, and grip both handles.",
      "Row one bell to your hip while pressing the other into the floor, then lower it and row the other side.",
      "Keep alternating. Count every rep."
    ],
    watchFor: "Twisting your torso to heave the bell up, or standing taller as you tire. Hips and chest stay square to the floor.",
    cue: 'Square hips, elbow to the pocket'
  },
  singleRow: {
    id: 'singleRow',
    name: 'Single-arm row',
    short: 'One-arm row',
    equipment: 'one-kettlebell',
    primaryMuscles: ['back', 'arms'],
    secondaryMuscles: ['core', 'grip'],
    targetType: 'repetitions',
    targetMin: 6,
    targetMax: 8,
    perSide: true,
    instructions: [
      "Staggered stance, front forearm resting on your front thigh, bell in the opposite hand.",
      "Flat back, torso close to parallel with the floor.",
      "Pull the bell to your hip, elbow brushing your side.",
      "Lower to a full stretch. Switch arms at the halfway beep."
    ],
    watchFor: "Twisting your torso open to heave the bell up. Your chest stays facing the floor.",
    cue: 'Elbow to the hip, no twist'
  },
  snatch: {
    id: 'snatch',
    name: 'One-arm snatch',
    short: 'Snatch',
    equipment: 'one-kettlebell',
    primaryMuscles: ['glutes', 'shoulders', 'back'],
    secondaryMuscles: ['hamstrings', 'grip', 'core'],
    targetType: 'repetitions',
    targetMin: 5,
    targetMax: 7,
    perSide: true,
    instructions: [
      "Start like a one-arm swing: hike the bell back between your legs.",
      "Snap the hips and pull the bell up close to your body.",
      "As it rises past your chest, punch your hand up through the handle so the bell lands softly on your forearm at lockout.",
      "Let it drop back into the swing and repeat. Switch arms at the halfway beep."
    ],
    watchFor: "The bell flipping over and slamming your forearm. Punch through early. If it still bangs, use a one-arm swing until it is smooth.",
    cue: 'Hips throw it, punch through'
  },
  chinup: {
    id: 'chinup',
    name: 'Chin-up',
    short: 'Chin-up',
    equipment: 'bodyweight',
    loadable: true,
    primaryMuscles: ['back', 'arms'],
    secondaryMuscles: ['core', 'grip'],
    targetType: 'repetitions',
    targetMin: 5,
    targetMax: 7,
    perSide: false,
    instructions: [
      "Hang from the bar with your palms facing you, hands about shoulder width.",
      "Pull your shoulder blades down before you bend your arms.",
      "Pull until your chin clears the bar, chest toward the bar.",
      "Lower all the way to straight arms under control."
    ],
    watchFor: "Kicking or swinging to get up. If the reps are gone, do slow lowerings from the top instead.",
    cue: 'Shoulders down, chest up'
  },
  splitSquat: {
    id: 'splitSquat',
    name: 'Bulgarian split squat',
    short: 'Split squat',
    equipment: 'bodyweight',
    loadable: true,
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    targetType: 'repetitions',
    targetMin: 6,
    targetMax: 8,
    perSide: true,
    instructions: [
      "Stand a long stride in front of a chair or bench and rest the top of your back foot on it.",
      "Lower straight down until your back knee nearly touches the floor, front shin close to vertical.",
      "Drive through your front heel to stand back up.",
      "Switch legs at the halfway beep. Hold a bell at your chest or a pair at your sides for added weight."
    ],
    watchFor: "Standing too close to the bench, which drives the front knee far past the toes. If the back hip feels jammed, move the front foot further out.",
    cue: 'Straight down, drive the front heel'
  },
  deadlift: {
    id: 'deadlift',
    name: 'Double kettlebell deadlift',
    short: 'Deadlift',
    equipment: 'two-kettlebells',
    primaryMuscles: ['glutes', 'hamstrings', 'back'],
    secondaryMuscles: ['grip'],
    targetType: 'repetitions',
    targetMin: 10,
    targetMax: 12,
    perSide: false,
    instructions: [
      "Stand between the bells, handles lined up with the middle of your feet.",
      "Push your hips back, soft knees, flat back, and grip both handles.",
      "Pull the slack out, then stand up by driving the floor away and squeezing your glutes at the top.",
      "Hinge to lower the bells back to the floor under control."
    ],
    watchFor: "Rounding your back to reach the bells, or turning it into a squat. Hips back first, and keep the bells close to your legs.",
    cue: 'Hips back, push the floor away'
  },
  singleFloorPress: {
    id: 'singleFloorPress',
    name: 'Single-arm floor press',
    short: 'One-arm floor press',
    equipment: 'one-kettlebell',
    primaryMuscles: ['chest', 'arms'],
    secondaryMuscles: ['shoulders'],
    targetType: 'repetitions',
    targetMin: 6,
    targetMax: 8,
    perSide: true,
    instructions: [
      "Lie on your back, knees bent. Roll to one side, grip the bell, and roll back with it on your chest.",
      "Press it straight up until your elbow locks, wrist stacked over elbow.",
      "Lower until your triceps touch the floor, pause, and press again.",
      "Switch arms at the halfway beep: roll to the side to hand it over safely."
    ],
    watchFor: "The bell drifting toward your face or your body rolling toward the bell. Keep it over your shoulder and both shoulder blades on the floor.",
    cue: 'Stack the wrist, pause at the floor'
  },
  hangingLegRaise: {
    id: 'hangingLegRaise',
    name: 'Hanging leg raise',
    short: 'Leg raise',
    equipment: 'bodyweight',
    primaryMuscles: ['core'],
    secondaryMuscles: ['grip', 'hip flexors'],
    targetType: 'repetitions',
    targetMin: 6,
    targetMax: 10,
    perSide: false,
    instructions: [
      "Hang from the bar with straight arms, shoulders pulled down away from your ears.",
      "Brace your abs and tilt your pelvis back slightly before you lift.",
      "Raise your legs as high as you can control, aiming for parallel or higher, without swinging.",
      "Lower slowly to a dead hang before the next rep. Bend your knees to make it easier."
    ],
    watchFor: "Swinging and using momentum. If your body rocks, pause at the bottom until it settles, or switch to bent-knee raises.",
    cue: 'Curl the pelvis, no swing'

  }
};

export const WORKOUTS = {
  A: {
    id: 'A',
    name: 'Workout A',
    emphasis: 'Hinge + pull',
    rounds: 3,
    workSeconds: 40,
    // Grip-heavy moves are split up by the press so grip is not the limiter.
    intervals: ['swing', 'row', 'pushPress', 'slRdl', 'farmer']
  },
  B: {
    id: 'B',
    name: 'Workout B',
    emphasis: 'Squat + push',
    rounds: 3,
    workSeconds: 40,
    // The row sits away from the deadlift so the low back gets a break.
    intervals: ['frontSquat', 'gorillaRow', 'floorPress', 'lateralLunge', 'deadlift']
  },
  C: {
    id: 'C',
    name: 'Workout C',
    emphasis: 'Unilateral + shoulders',
    rounds: 3,
    workSeconds: 40,
    intervals: ['reverseLunge', 'cleanPress', 'singleRow', 'snatch', 'singleFloorPress']
  },
  D: {
    id: 'D',
    name: 'Bodyweight',
    emphasis: 'Pull + push',
    rounds: 3,
    workSeconds: 40,
    // Two pulls to one push: bodyweight comes round three times a cycle, so
    // this is where the week's push/pull balance is set. The three hanging
    // movements are split up so grip gets a break between them. No planks or
    // holds: those are covered by a separate plank app.
    intervals: ['pullup', 'dip', 'chinup', 'splitSquat', 'hangingLegRaise']
  },
  RECOVERY: {
    id: 'RECOVERY',
    name: 'Recovery',
    emphasis: 'Mobility + carries',
    rounds: 3,
    workSeconds: null,
    intervals: ['halo', 'gluteBridge', 'deadBug', 'hipFlexor', 'lightCarry']
  }
};

// True when an exercise should get the "switch sides" beep halfway through
// its work. Alternating moves count every rep and do not need it.
export function switchesHalfway(ex) {
  return !!(ex.perSide || ex.switchHalfway);
}

// D and RECOVERY are deliberately absent: both must stay invisible to the
// A -> B -> C rotation, which is driven by the last completed strength day.
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
