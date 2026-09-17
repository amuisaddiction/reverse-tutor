# Reverse Tutor 🔄

"Teach it. Really understand it."

Reverse Tutor flips the traditional tutoring relationship. Instead of an AI teaching you, the AI plays a confused junior student with a specific, hidden misconception. You must explain the concept until the AI "gets it." The AI only concedes when your explanation actually addresses the fundamental flaw — refusing to move on vague or wrong answers.

Built for Class 11-12 students preparing for JEE/NEET.

## 🚀 Features

- **Topic Selector**: Curated topics across Physics, Chemistry, and Math based on the Class 11/12 syllabus.
- **AI Student Persona**: Powered by Anthropic's Claude, the AI never breaks character, asks follow-up questions, and holds a hidden misconception.
- **Dynamic Understanding Meter**: Visibly refuses to budge on weak answers. Jumps on breakthrough moments based on a strict background evaluation rubric.
- **Score Card & Bug Reveal**: After cracking the misconception, see exactly what the AI was hiding and view your clarity score.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **AI Integration**: Anthropic SDK (Claude 3.5 Sonnet dual-call architecture)

## 💻 Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amuisaddiction/reverse-tutor.git
   cd reverse-tutor
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up Environment Variables:**
   Create a `.env` file inside the `server/` directory and add your Anthropic API Key:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   PORT=3001
   ```

4. **Run the Development Servers:**
   ```bash
   npm run dev
   ```
   - The Frontend will run at `http://localhost:5173`
   - The Backend API will run at `http://localhost:3001`
