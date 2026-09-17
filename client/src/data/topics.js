export const TOPICS = [
  {
    id: "newton3",
    label: "Newton's 3rd Law",
    emoji: "⚡",
    subject: "Physics",
    classLevel: 11,
    easy: {
      misconception: "If a truck and a bicycle collide, the truck exerts more force on the bicycle than the bicycle exerts on the truck.",
      hint: "Think about what Newton's 3rd Law actually says about the magnitudes."
    },
    hard: {
      misconception: "The forces are equal but the truck still 'wins' because it has more mass, so the net force must favor the truck.",
      hint: "Equal forces, different accelerations — why?"
    }
  },
  {
    id: "mag-force",
    label: "Magnetic Force on Charge",
    emoji: "🧲",
    subject: "Physics",
    classLevel: 12,
    easy: {
      misconception: "A stationary charge placed in a strong magnetic field will start moving along the magnetic field lines.",
      hint: "Look at the formula for magnetic force: F = qv × B. What happens if v = 0?"
    },
    hard: {
      misconception: "Magnetic fields do work on charged particles to speed them up.",
      hint: "What is the angle between the magnetic force and the velocity vector?"
    }
  },
  {
    id: "le-chatelier",
    label: "Le Chatelier's Principle",
    emoji: "⚗️",
    subject: "Chemistry",
    classLevel: 11,
    easy: {
      misconception: "Adding a catalyst to a reaction at equilibrium will shift it to the right to make more products.",
      hint: "Does a catalyst affect the equilibrium position, or just the speed?"
    },
    hard: {
      misconception: "If you add an inert gas at constant volume, the pressure increases so the reaction shifts to the side with fewer moles.",
      hint: "Does the partial pressure of the reacting gases change?"
    }
  },
  {
    id: "ohms-law",
    label: "Ohm's Law",
    emoji: "🔋",
    subject: "Physics",
    classLevel: 12,
    easy: {
      misconception: "If you increase the voltage across a fixed resistor, the resistance goes down because more current flows.",
      hint: "Is the resistor itself changing, or just the current?"
    },
    hard: {
      misconception: "Ohm's Law is a fundamental law of physics that applies to every electrical component universally.",
      hint: "Are there non-ohmic devices like diodes?"
    }
  },
  {
    id: "chain-rule",
    label: "Chain Rule",
    emoji: "📐",
    subject: "Math",
    classLevel: 12,
    easy: {
      misconception: "To differentiate f(g(x)), you just do f'(x) * g'(x).",
      hint: "What happens to the inside function when you take the derivative of the outside function?"
    },
    hard: {
      misconception: "I know it's f'(g(x)) * g'(x), but I think g'(x) is just a constant multiplier that we can pull out at the end.",
      hint: "Is g'(x) evaluated at x or g(x)?"
    }
  },
  {
    id: "cond-prob",
    label: "Conditional Probability",
    emoji: "📊",
    subject: "Math",
    classLevel: 12,
    easy: {
      misconception: "P(A|B) is exactly the same as P(B|A).",
      hint: "Think about the probability of having a fever given you have the flu vs having the flu given you have a fever."
    },
    hard: {
      misconception: "If two events are mutually exclusive, they must be independent.",
      hint: "If event A happens, can event B happen if they are mutually exclusive?"
    }
  }
];
