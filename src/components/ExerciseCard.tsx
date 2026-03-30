import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp, Send, RotateCcw, Target, FileText, Zap, AlertTriangle } from 'lucide-react';
import type { Exercise } from '../data/curriculum';

interface ExerciseCardProps {
  exercise: Exercise;
  lessonId: string;
  savedResult?: { completed: boolean; userAnswer?: string; isCorrect?: boolean };
  onComplete: (exerciseId: string, userAnswer: string, isCorrect: boolean) => void;
}

interface PromptFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
}

function analyzePrompt(userAnswer: string, exercise: Exercise): PromptFeedback {
  const answer = userAnswer.toLowerCase().trim();
  const words = answer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const strengths: string[] = [];
  const improvements: string[] = [];
  let score = 0;

  // Length check
  if (wordCount >= 30) {
    strengths.push('Good level of detail');
    score += 20;
  } else if (wordCount >= 15) {
    strengths.push('Reasonable length');
    score += 10;
  } else {
    improvements.push('Add more detail \u2014 aim for at least 30 words');
  }

  // Specificity indicators
  const hasFilePaths = /(?:src\/|\/[a-z]+\/[a-z]+|\.tsx?|\.jsx?|\.py|\.ts|\.js|\.css)/.test(answer);
  if (hasFilePaths) {
    strengths.push('References specific files/paths');
    score += 15;
  } else {
    improvements.push('Reference specific file paths (e.g., src/components/...)');
  }

  // Action clarity
  const actionWords = ['add', 'create', 'update', 'fix', 'implement', 'build', 'remove', 'change', 'migrate', 'refactor', 'test', 'deploy', 'configure', 'install', 'set up', 'write'];
  const foundActions = actionWords.filter(w => answer.includes(w));
  if (foundActions.length >= 2) {
    strengths.push('Clear action verbs used');
    score += 15;
  } else if (foundActions.length === 1) {
    score += 8;
  } else {
    improvements.push('Use clear action verbs (add, create, update, fix, etc.)');
  }

  // Context/requirements
  const hasRequirements = /should|must|need|require|ensure|verify|make sure|expect/.test(answer);
  if (hasRequirements) {
    strengths.push('Includes clear requirements');
    score += 10;
  } else {
    improvements.push('Add requirements (should, must, ensure, etc.)');
  }

  // Testing mention
  const hasTestMention = /test|spec|coverage|verify|assert|expect|check/.test(answer);
  if (hasTestMention) {
    strengths.push('Mentions testing/verification');
    score += 10;
  } else {
    improvements.push('Consider mentioning testing or verification');
  }

  // Pattern/convention reference
  const hasPatternRef = /pattern|convention|follow|existing|like|same as|similar|match|consistent/.test(answer);
  if (hasPatternRef) {
    strengths.push('References existing patterns or conventions');
    score += 10;
  } else {
    improvements.push('Reference existing patterns to follow (e.g., "follow the same pattern as...")');
  }

  // Structured format
  const hasStructure = /\d\.\s|\u2022|-\s|\n/.test(userAnswer);
  if (hasStructure) {
    strengths.push('Well-structured format');
    score += 10;
  }

  // Edge cases / error handling
  const hasEdgeCases = /edge case|error|fail|invalid|empty|null|undefined|fallback|default|timeout|retry/.test(answer);
  if (hasEdgeCases) {
    strengths.push('Considers edge cases');
    score += 10;
  }

  // Keyword matching against ideal answer
  if (exercise.idealAnswer) {
    const idealLower = exercise.idealAnswer.toLowerCase();
    const importantTerms = idealLower.match(/(?:src\/[\w/.-]+|[a-z]+_[a-z]+|[a-z]+\.[a-z]+(?:\.[a-z]+)?)/g);
    if (importantTerms) {
      const uniqueTerms = [...new Set(importantTerms)].slice(0, 6);
      const matched = uniqueTerms.filter(t => answer.includes(t));
      const matchRatio = uniqueTerms.length > 0 ? matched.length / uniqueTerms.length : 0;
      score += Math.round(matchRatio * 20);
    }
  }

  score = Math.min(100, Math.max(5, score));

  if (strengths.length === 0) {
    strengths.push('Good start \u2014 keep iterating!');
  }

  return { score, strengths, improvements: improvements.slice(0, 3) };
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-500';
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}

export function ExerciseCard({ exercise, savedResult, onComplete }: ExerciseCardProps) {
  const [userAnswer, setUserAnswer] = useState(savedResult?.userAnswer || '');
  const [selectedOption, setSelectedOption] = useState<number | null>(
    savedResult?.userAnswer ? parseInt(savedResult.userAnswer) : null
  );
  const [submitted, setSubmitted] = useState(savedResult?.completed || false);
  const [showHint, setShowHint] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);

  const wordCount = useMemo(() => {
    return userAnswer.trim().split(/\s+/).filter(Boolean).length;
  }, [userAnswer]);

  const feedback = useMemo(() => {
    if (!submitted || (exercise.type !== 'prompt-writing' && exercise.type !== 'scenario')) return null;
    return analyzePrompt(userAnswer, exercise);
  }, [submitted, userAnswer, exercise]);

  const handleSubmitPrompt = () => {
    if (!userAnswer.trim()) return;
    setSubmitted(true);
    onComplete(exercise.id, userAnswer, true);
  };

  const handleRetry = () => {
    setUserAnswer('');
    setSubmitted(false);
    setShowHint(false);
    setShowIdeal(false);
  };

  const handleSelectOption = (idx: number) => {
    if (submitted) return;
    setSelectedOption(idx);
    setSubmitted(true);
    const isCorrect = idx === exercise.correctOption;
    onComplete(exercise.id, idx.toString(), isCorrect);
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden animate-fade-in">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
            exercise.type === 'prompt-writing' ? 'bg-purple-100' :
            exercise.type === 'freeform' ? 'bg-amber-100' :
            exercise.type === 'scenario' ? 'bg-orange-100' : 'bg-blue-100'
          }`}>
            <span className={`text-sm font-bold ${
              exercise.type === 'prompt-writing' ? 'text-purple-600' :
              exercise.type === 'freeform' ? 'text-amber-600' :
              exercise.type === 'scenario' ? 'text-orange-600' : 'text-blue-600'
            }`}>
              {exercise.type === 'multiple-choice' ? 'MC' :
               exercise.type === 'prompt-writing' ? 'PW' :
               exercise.type === 'scenario' ? 'SC' :
               exercise.type === 'freeform' ? 'FF' : 'EX'}
            </span>
          </div>
          <div className="flex-1">
            <span className={`text-xs font-medium uppercase tracking-wide ${
              exercise.type === 'prompt-writing' ? 'text-purple-600' :
              exercise.type === 'freeform' ? 'text-amber-600' :
              exercise.type === 'scenario' ? 'text-orange-600' : 'text-blue-600'
            }`}>
              {exercise.type === 'multiple-choice' ? 'Multiple Choice' :
               exercise.type === 'prompt-writing' ? 'Prompt Writing' :
               exercise.type === 'comparison' ? 'Comparison' :
               exercise.type === 'scenario' ? 'Scenario Challenge' :
               exercise.type === 'freeform' ? 'Freeform' : 'Exercise'}
            </span>
            <p className="text-gray-800 font-medium mt-1">{exercise.question}</p>
          </div>
          {submitted && (
            <div className="flex-shrink-0">
              {exercise.type === 'multiple-choice' || exercise.type === 'comparison' ? (
                selectedOption === exercise.correctOption ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )
              ) : feedback ? (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  feedback.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                  feedback.score >= 60 ? 'bg-blue-100 text-blue-700' :
                  feedback.score >= 40 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <Target className="w-3.5 h-3.5" />
                  {feedback.score}%
                </div>
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Scenario context */}
        {exercise.type === 'scenario' && exercise.scenario && !submitted && (
          <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Scenario</span>
            </div>
            <p className="text-sm text-orange-900">{exercise.scenario}</p>
          </div>
        )}

        {/* Multiple Choice */}
        {(exercise.type === 'multiple-choice' || exercise.type === 'comparison') && exercise.options && (
          <div className="space-y-2">
            {exercise.options.map((option, idx) => {
              let optionClass = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer';
              if (submitted) {
                if (idx === exercise.correctOption) {
                  optionClass = 'border-emerald-300 bg-emerald-50';
                } else if (idx === selectedOption && idx !== exercise.correctOption) {
                  optionClass = 'border-red-300 bg-red-50';
                } else {
                  optionClass = 'border-gray-100 opacity-50';
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionClass}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      submitted && idx === exercise.correctOption
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : submitted && idx === selectedOption
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm text-gray-700">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Prompt Writing / Scenario / Freeform */}
        {(exercise.type === 'prompt-writing' || exercise.type === 'freeform' || exercise.type === 'scenario') && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={submitted}
                placeholder={
                  exercise.type === 'scenario'
                    ? 'Write the prompt you would give to Devin for this scenario...'
                    : exercise.type === 'prompt-writing'
                    ? 'Write your prompt here...'
                    : 'Type your answer...'
                }
                className={`w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-500 ${
                  exercise.type === 'prompt-writing' || exercise.type === 'scenario' ? 'h-40' : 'h-28'
                } border-gray-200`}
              />
              {!submitted && (exercise.type === 'prompt-writing' || exercise.type === 'scenario') && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    wordCount >= 30 ? 'bg-emerald-100 text-emerald-700' :
                    wordCount >= 15 ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <FileText className="w-3 h-3 inline mr-1" />
                    {wordCount} words
                  </span>
                </div>
              )}
            </div>

            {/* Live quality indicators while typing */}
            {!submitted && (exercise.type === 'prompt-writing' || exercise.type === 'scenario') && wordCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {wordCount < 15 && (
                  <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Too short
                  </span>
                )}
                {/(?:src\/|\.tsx?|\.jsx?|\.py|\.css)/.test(userAnswer.toLowerCase()) && (
                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">File paths mentioned</span>
                )}
                {/test|spec|verify|assert/.test(userAnswer.toLowerCase()) && (
                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">Testing included</span>
                )}
                {/pattern|convention|follow|existing|same as|similar/.test(userAnswer.toLowerCase()) && (
                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">Pattern reference</span>
                )}
                {/should|must|ensure|require/.test(userAnswer.toLowerCase()) && (
                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">Clear requirements</span>
                )}
              </div>
            )}

            {!submitted && (
              <button
                onClick={handleSubmitPrompt}
                disabled={!userAnswer.trim()}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Submit & Get Feedback
              </button>
            )}
          </div>
        )}

        {/* Prompt Analysis Feedback */}
        {submitted && feedback && (exercise.type === 'prompt-writing' || exercise.type === 'scenario') && (
          <div className="mt-4 space-y-3 animate-fade-in">
            {/* Score bar */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Prompt Quality Score</span>
                <span className={`text-lg font-bold ${getScoreColor(feedback.score)}`}>
                  {feedback.score}% &mdash; {getScoreLabel(feedback.score)}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getScoreBgColor(feedback.score)}`}
                  style={{ width: `${feedback.score}%` }}
                />
              </div>
            </div>

            {/* Strengths */}
            {feedback.strengths.length > 0 && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">What you did well</p>
                <ul className="space-y-1">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">How to improve</p>
                <ul className="space-y-1">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-amber-800 flex items-center gap-2">
                      <Lightbulb className="w-3.5 h-3.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Retry button */}
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Explanation / Feedback (for MC) */}
        {submitted && exercise.explanation && (exercise.type === 'multiple-choice' || exercise.type === 'comparison') && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Explanation: </span>
              {exercise.explanation}
            </p>
          </div>
        )}

        {/* Hint */}
        {exercise.hint && !submitted && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-3 flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
            {showHint ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
        {showHint && exercise.hint && (
          <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100 animate-fade-in">
            <p className="text-sm text-amber-800">{exercise.hint}</p>
          </div>
        )}

        {/* Ideal Answer */}
        {submitted && exercise.idealAnswer && (
          <div className="mt-3">
            <button
              onClick={() => setShowIdeal(!showIdeal)}
              className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {showIdeal ? 'Hide Ideal Answer' : 'View Ideal Answer'}
              {showIdeal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showIdeal && (
              <div className="mt-2 p-4 bg-emerald-50 rounded-lg border border-emerald-100 animate-fade-in">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Ideal Answer</p>
                <p className="text-sm text-emerald-800 whitespace-pre-wrap">{exercise.idealAnswer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
