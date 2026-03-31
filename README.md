# Devin Training Academy

An interactive, self-paced learning platform that teaches users how to effectively use Devin (Cognition AI) — from basic prompting to complex project orchestration.

## Features

- **3 Learning Tracks**: Beginner, Intermediate, and Advanced with structured progression
- **Interactive Exercises**: Prompt writing, multiple choice, and comparison exercises
- **Prompt Playground**: Practice writing prompts and get instant feedback analysis
- **Progress Tracking**: LocalStorage-based progress persistence across sessions
- **Good vs Bad Comparisons**: Side-by-side prompt examples with explanations
- **Copyable Templates**: Ready-to-use prompt templates for common tasks
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast dev/build
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide Icons** for iconography
- **LocalStorage** for progress persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Curriculum Overview

### Beginner Track
- What is Devin and how it works
- Interface walkthrough
- Basic prompting techniques (SCOPE framework)
- Assigning tasks to Devin

### Intermediate Track
- Breaking down complex multi-step tasks
- Debugging Devin outputs
- Iterating on prompts
- Coding project workflows with Devin

### Advanced Track
- Parallel sessions and child sessions
- Best practices for autonomy
- Advanced prompt engineering patterns
- Real-world workflows (feature building, maintenance, migrations, prototyping)

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout.tsx       # App shell with sidebar
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── ProgressBar.tsx  # Progress indicator
│   ├── ExerciseCard.tsx # Interactive exercise component
│   └── LessonContent.tsx # Lesson content renderer
├── pages/            # Route pages
│   ├── Dashboard.tsx    # Home/landing page
│   ├── TrackPage.tsx    # Track overview with modules
│   ├── LessonPage.tsx   # Individual lesson view
│   ├── Playground.tsx   # Prompt practice area
│   └── ProgressPage.tsx # Progress tracker
├── data/
│   └── curriculum.ts    # All curriculum content and data
├── hooks/
│   └── useProgress.ts   # Progress management hook
└── App.tsx              # Router setup
```
