export const formulaData = {
  Physics: {
    Mechanics: [
      { id: 'p_m_1', name: "Equations of Motion (Constant Acceleration)", latex: 'v = u + at, \\; s = ut + \\frac{1}{2}at^2, \\; v^2 = u^2 + 2as', description: 'Basic kinematics equations.' },
      { id: 'p_m_2', name: "Newton's Second Law", latex: 'F = m a = \\frac{dp}{dt}', description: 'Force equals mass times acceleration, or the rate of change of momentum.' },
      { id: 'p_m_3', name: "Work-Energy Theorem", latex: 'W = \\Delta K = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2', description: 'Net work done on an object equals its change in kinetic energy.' },
      { id: 'p_m_4', name: "Center of Mass", latex: 'X_{cm} = \\frac{\\sum m_i x_i}{\\sum m_i}', description: 'Coordinate of the center of mass for a discrete system of particles.' },
      { id: 'p_m_5', name: "Moment of Inertia (Solid Sphere)", latex: 'I = \\frac{2}{5}MR^2', description: 'Moment of inertia of a solid sphere about its central axis.' }
    ],
    Electromagnetism: [
      { id: 'p_e_1', name: "Coulomb's Law", latex: 'F = \\frac{1}{4\\pi\\epsilon_0} \\frac{q_1 q_2}{r^2}', description: 'Electrostatic force between two point charges.' },
      { id: 'p_e_2', name: "Electric Field of a Point Charge", latex: 'E = \\frac{1}{4\\pi\\epsilon_0} \\frac{q}{r^2}', description: 'Electric field magnitude at a distance r.' },
      { id: 'p_e_3', name: "Gauss's Law", latex: '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{enclosed}}{\\epsilon_0}', description: 'Total electric flux through a closed surface.' },
      { id: 'p_e_4', name: "Magnetic Force on a Moving Charge", latex: '\\vec{F} = q(\\vec{v} \\times \\vec{B})', description: 'Lorentz force component due to magnetic field.' }
    ]
  },
  Chemistry: {
    'Physical Chemistry': [
      { id: 'c_p_1', name: "Ideal Gas Law", latex: 'PV = nRT', description: 'Equation of state for a hypothetical ideal gas.' },
      { id: 'c_p_2', name: "Arrhenius Equation", latex: 'k = A e^{-E_a / RT}', description: 'Temperature dependence of reaction rates.' },
      { id: 'c_p_3', name: "Nernst Equation", latex: 'E = E^\\circ - \\frac{0.0591}{n} \\log Q', description: 'Cell potential under non-standard conditions at 298K.' }
    ],
    'Organic Chemistry': [
      { id: 'c_o_1', name: "Degree of Unsaturation", latex: 'DU = C + 1 - \\frac{H}{2} + \\frac{N}{2} - \\frac{X}{2}', description: 'Calculates rings plus pi bonds in an organic molecule.' }
    ]
  },
  Mathematics: {
    Calculus: [
      { id: 'm_c_1', name: "Product Rule", latex: '\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}', description: 'Derivative of a product of two functions.' },
      { id: 'm_c_2', name: "Integration by Parts", latex: '\\int u \\, dv = uv - \\int v \\, du', description: 'Technique for integrating products of functions.' }
    ],
    'Coordinate Geometry': [
      { id: 'm_cg_1', name: "Distance Formula", latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}', description: 'Distance between two points.' },
      { id: 'm_cg_2', name: "Equation of a Circle", latex: '(x - h)^2 + (y - k)^2 = r^2', description: 'Standard equation of a circle with center (h,k) and radius r.' }
    ]
  }
};
