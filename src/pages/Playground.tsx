import { useState } from 'react';
import {
  Send,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SimulatedResponse {
  thinking: string;
  plan: string[];
  response: string;
}

const examplePrompts = [
  {
    label: 'Bug Fix',
    prompt: 'Fix the login timeout issue. Users report being logged out after 5 minutes. The session management is in src/auth/session.ts. The timeout should be 30 minutes.',
  },
  {
    label: 'New Feature',
    prompt: 'Add a search bar to the dashboard header in src/components/Header.tsx. It should filter the displayed items in real-time using the existing filterItems() function in src/utils/search.ts.',
  },
  {
    label: 'Refactor',
    prompt: 'Refactor the API error handling in src/services/api.ts. Replace all try-catch blocks with a centralized error handler middleware. Follow the pattern in our Express error handler at src/middleware/errorHandler.ts.',
  },
  {
    label: 'Testing',
    prompt: 'Add unit tests for the UserService class in src/services/user.ts. Cover: createUser (valid & invalid input), getUserById (found & not found), and updateUser (partial & full update). Use Jest and mock the database with the existing test helpers in src/test/helpers.ts.',
  },
];

function simulateResponse(prompt: string): SimulatedResponse {
  const wordCount = prompt.split(/\s+/).length;
  const hasFilePath = /src\/|\.ts|\.tsx|\.js|\.py/.test(prompt);
  const hasRequirements = /should|must|need|require/i.test(prompt);
  const hasContext = hasFilePath && hasRequirements;

  if (wordCount < 10) {
    return {
      thinking: 'The task description is quite brief. I\'ll need to make several assumptions about the implementation details.',
      plan: [
        'Explore the codebase to understand the project structure',
        'Make assumptions about the implementation approach',
        'Implement a best-guess solution',
        'May need to ask clarifying questions',
      ],
      response: '⚠️ This prompt is quite short. Devin would need to spend time exploring the codebase and making assumptions. Consider adding:\n\n• Which files to modify\n• Expected behavior details\n• Any patterns to follow\n• Testing requirements\n\nA more detailed prompt would get you faster, more accurate results.',
    };
  }

  if (hasContext) {
    return {
      thinking: 'Good task description with clear context. I can see which files to work with and what the expected outcome should be.',
      plan: [
        'Read the referenced files to understand current implementation',
        'Plan the changes based on the requirements',
        'Implement the solution following existing patterns',
        'Run tests to verify the changes',
        'Create a pull request with the changes',
      ],
      response: '✅ Great prompt! This gives Devin clear direction:\n\n• Specific files are referenced\n• Expected behavior is defined\n• Implementation context is provided\n\nDevin would likely produce a high-quality result on the first attempt with this level of detail.',
    };
  }

  if (hasFilePath && !hasRequirements) {
    return {
      thinking: 'File paths are provided, but the requirements could be more specific. I\'ll do my best to infer the expected behavior.',
      plan: [
        'Read the referenced files',
        'Analyze the code to understand what changes are needed',
        'Implement based on my interpretation',
        'Test and create a PR',
      ],
      response: '🔶 Decent prompt, but could be improved. You\'ve pointed to the right files, but the requirements are a bit vague. Consider adding:\n\n• Specific expected behavior\n• Edge cases to handle\n• Testing requirements\n\nDevin will try its best, but might need a round of feedback.',
    };
  }

  return {
    thinking: 'The prompt provides some context but could benefit from more specifics about file locations and patterns to follow.',
    plan: [
      'Search the codebase for relevant files',
      'Understand the current architecture',
      'Plan and implement the changes',
      'Run linting and tests',
      'Create a PR',
    ],
    response: '🔶 This prompt has room for improvement. To get better results:\n\n• Add specific file paths (e.g., src/components/...)\n• Reference existing patterns to follow\n• Define acceptance criteria\n• Mention testing expectations\n\nDevin can work with this, but adding more detail reduces back-and-forth.',
  };
}

export function Playground() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<SimulatedResponse | null>(null);
  const [showExamples, setShowExamples] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    const response = simulateResponse(prompt);
    setResult(response);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPrompt('');
    setResult(null);
  };

  const handleLoadExample = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cognition-accent01 to-cognition-accent02 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cognition-dark01" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-light tracking-wide text-cognition-light01">Prompt Playground</h1>
            <p className="text-sm text-cognition-grey02">Practice writing prompts and get instant feedback</p>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 overflow-hidden">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="w-full flex items-center justify-between p-4 hover:bg-cognition-dark03/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-cognition-grey01">Example Prompts</span>
          </div>
          {showExamples ? <ChevronUp className="w-4 h-4 text-cognition-grey02" /> : <ChevronDown className="w-4 h-4 text-cognition-grey02" />}
        </button>
        {showExamples && (
          <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fade-in">
            {examplePrompts.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadExample(ex.prompt)}
                className="text-left p-3 bg-cognition-dark01 rounded-lg hover:bg-cognition-accent01/5 hover:border-cognition-accent01/30 border border-cognition-dark03 transition-all"
              >
                <span className="text-xs font-semibold text-cognition-accent01 uppercase tracking-wide font-heading">{ex.label}</span>
                <p className="text-xs text-cognition-grey02 mt-1 line-clamp-2">{ex.prompt}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Prompt Input */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-cognition-grey02" />
          <label className="text-sm font-medium text-cognition-grey01">Your Prompt to Devin</label>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write a task description for Devin... (e.g., 'Fix the authentication bug in src/auth/login.ts. Users are getting 401 errors when...')"
          className="w-full h-40 p-4 border border-cognition-dark03 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cognition-accent01/50 focus:border-transparent text-sm bg-cognition-dark01 text-cognition-light01 placeholder-cognition-grey02"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-cognition-grey02">
            {prompt.split(/\s+/).filter(Boolean).length} words
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-cognition-grey02 hover:text-cognition-light01 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cognition-accent01 to-cognition-accent02 text-cognition-dark01 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Analyze Prompt
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Feedback */}
          <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5">
            <h3 className="font-medium text-cognition-light01 mb-3">Prompt Analysis</h3>
            <div className="whitespace-pre-wrap text-sm text-cognition-grey01 leading-relaxed">
              {result.response}
            </div>
          </div>

          {/* Simulated Devin Thinking */}
          <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5">
            <h3 className="font-medium text-cognition-light01 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cognition-accent01" />
              How Devin Would Approach This
            </h3>
            <div className="mb-4">
              <p className="text-xs font-semibold text-cognition-grey02 uppercase tracking-wide mb-2 font-heading">Thinking</p>
              <p className="text-sm text-cognition-grey01 italic bg-cognition-dark01 p-3 rounded-lg border border-cognition-dark03">
                "{result.thinking}"
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-cognition-grey02 uppercase tracking-wide mb-2 font-heading">Plan</p>
              <ol className="space-y-2">
                {result.plan.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-cognition-accent01/20 rounded-full flex items-center justify-center text-xs font-bold text-cognition-accent01 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-cognition-grey01">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Copy Prompt */}
          <div className="flex justify-end">
            <button
              onClick={() => handleCopy(prompt)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-cognition-grey02 hover:text-cognition-light01 bg-cognition-dark02 border border-cognition-dark03 rounded-lg hover:bg-cognition-dark03/50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-cognition-accent02" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
