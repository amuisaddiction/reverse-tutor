export const PAST_PAPERS = [
  {
    id: "jee-main-2023-physics",
    title: "JEE Main 2023 Shift 1",
    exam: "JEE",
    subject: "Physics",
    year: 2023,
    questions: [
      {
        q: "A block of mass m is placed on a smooth inclined plane of inclination θ. The acceleration of the block is:",
        options: ["g sin θ", "g cos θ", "g tan θ", "g"],
        answer: 0,
        explanation: "The component of gravitational force along the incline is mg sin θ. Thus, ma = mg sin θ => a = g sin θ."
      },
      {
        q: "The stopping potential in a photoelectric experiment is linearly related to:",
        options: ["Intensity of incident light", "Frequency of incident light", "Wavelength of incident light", "Number of emitted electrons"],
        answer: 1,
        explanation: "According to Einstein's photoelectric equation, eV₀ = hν - Φ. So stopping potential V₀ is linearly proportional to frequency ν."
      }
    ]
  },
  {
    id: "neet-2022-bio",
    title: "NEET UG 2022",
    exam: "NEET",
    subject: "Biology",
    year: 2022,
    questions: [
      {
        q: "Which of the following is responsible for peat formation?",
        options: ["Marchantia", "Riccia", "Funaria", "Sphagnum"],
        answer: 3,
        explanation: "Sphagnum, a species of moss, provides peat that has long been used as fuel and packing material."
      },
      {
        q: "Identify the basic amino acid from the following.",
        options: ["Glutamic Acid", "Lysine", "Valine", "Tyrosine"],
        answer: 1,
        explanation: "Lysine and Arginine are basic amino acids. Glutamic acid is acidic."
      }
    ]
  },
  {
    id: "jee-adv-2021-math",
    title: "JEE Advanced 2021 Paper 1",
    exam: "JEE",
    subject: "Math",
    year: 2021,
    questions: [
      {
        q: "Let f: R -> R be a continuous function such that f(x) + f(-x) = 0. Then the integral from -a to a of f(x)dx is:",
        options: ["2 * integral(0 to a) f(x)dx", "0", "a * f(a)", "None of the above"],
        answer: 1,
        explanation: "Since f(x) + f(-x) = 0, the function is odd. The definite integral of an odd function from -a to a is always 0."
      }
    ]
  }
];

