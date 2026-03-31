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
  if (score >= 80) return 'text-cognition-accent02';
  if (score >= 60) return 'text-cognition-accent01';
  if (score >= 40) return 'text-amber-400';
  return 'text-cognition-error';
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-cognition-accent02';
  if (score >= 60) return 'bg-cognition-accent01';
  if (score >= 40) return 'bg-amber-400';
  return 'bg-cognition-error';
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
    <div className="border border-cognition-dark03 rounded-xl bg-cognition-dark02 overflow-hidden animate-fade-in">
      <div className="p-5 border-b border-cognition-dark03 bg-cognition-dark03/30">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
            exercise.type === 'prompt-writing' ? 'bg-purple-500/20' :
            exercise.type === 'freeform' ? 'bg-amber-500/20' :
            exercise.type === 'scenario' ? 'bg-orange-500/20' : 'bg-cognition-accent01/20'
          }`}>
            <span className={`text-sm font-bold ${
              exercise.type === 'prompt-writing' ? 'text-purple-400' :
              exercise.type === 'freeform' ? 'text-amber-400' :
              exercise.type === 'scenario' ? 'text-orange-400' : 'text-cognition-accent01'
            }`}>
              {exercise.type === 'multiple-choice' ? 'MC' :
               exercise.type === 'prompt-writing' ? 'PW' :
               exercise.type === 'scenario' ? 'SC' :
               exercise.type === 'freeform' ? 'FF' : 'EX'}
            </span>
          </div>
          <div className="flex-1">
            <span className={`text-xs font-medium uppercase tracking-wide font-heading ${
              exercise.type === 'prompt-writing' ? 'text-purple-400' :
              exercise.type === 'freeform' ? 'text-amber-400' :
              exercise.type === 'scenario' ? 'text-orange-400' : 'text-cognition-accent01'
            }`}>
              {exercise.type === 'multiple-choice' ? 'Multiple Choice' :
               exercise.type === 'prompt-writing' ? 'Prompt Writing' :
               exercise.type === 'comparison' ? 'Comparison' :
               exercise.type === 'scenario' ? 'Scenario Challenge' :
               exercise.type === 'freeform' ? 'Freeform' : 'Exercise'}
            </span>
            <p className="text-cognition-light01 font-medium mt-1">{exercise.question}</p>
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
                  feedback.score >= 80 ? 'bg-cognition-accent02/20 text-cognition-accent02' :
                  feedback.score >= 60 ? 'bg-cognition-accent01/20 text-cognition-accent01' :
                  feedback.score >= 40 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-cognition-error/20 text-cognition-error'
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
          <div className="mb-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide font-heading">Scenario</span>
            </div>
            <p className="text-sm text-orange-200">{exercise.scenario}</p>
          </div>
        )}

        {/* Multiple Choice */}
        {(exercise.type === 'multiple-choice' || exercise.type === 'comparison') && exercise.options && (
          <div className="space-y-2">
            {exercise.options.map((option, idx) => {
              let optionClass = 'border-cognition-dark03 hover:border-cognition-accent01/50 hover:bg-cognition-accent01/5 cursor-pointer';
              if (submitted) {
                if (idx === exercise.correctOption) {
                  optionClass = 'border-cognition-accent02/50 bg-cognition-accent02/10';
                } else if (idx === selectedOption && idx !== exercise.correctOption) {
                  optionClass = 'border-cognition-error/50 bg-cognition-error/10';
                } else {
                  optionClass = 'border-cognition-dark03/50 opacity-50';
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
                        ? 'border-cognition-accent02 bg-cognition-accent02 text-cognition-dark01'
                        : submitted && idx === selectedOption
                        ? 'border-cognition-error bg-cognition-error text-white'
                        : 'border-cognition-grey02 text-cognition-grey02'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm text-cognition-grey01">{option}</span>
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
                className={`w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cognition-accent01/50 focus:border-transparent text-sm bg-cognition-dark01 text-cognition-light01 placeholder-cognition-grey02 disabled:bg-cognition-dark03/30 disabled:text-cognition-grey02 ${
                  exercise.type === 'prompt-writing' || exercise.type === 'scenario' ? 'h-40' : 'h-28'
                } border-cognition-dark03`}
              />
              {!submitted && (exercise.type === 'prompt-writing' || exercise.type === 'scenario') && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    wordCount >= 30 ? 'bg-cognition-accent02/20 text-cognition-accent02' :
                    wordCount >= 15 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-cognition-dark03 text-cognition-grey02'
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
                  <span className="text-xs px-2 py-1 bg-cognition-error/10 text-cognition-error rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Too short
                  </span>
                )}
                {/(?:src\/|\.tsx?|\.jsx?|\.py|\.css)/.test(userAnswer.toLowerCase()) && (
                  <span className="text-xs px-2 py-1 bg-cognition-accent02/10 text-cognition-accent02 rounded-full">File paths mentioned</span>
                )}
                {/test|spec|verify|assert/.test(userAnswer.toLowerCase()) && (
                  <span className="text-xs px-2 py-1 bg-cognition-accent02/10 text-cognition-accent02 rounded-full">Testing included</span>
                )}
                {/pattern|convention|follow|existing|same as|similar/.test(userAnswer.toLowerCase()) && (
                  <span className="text-xs px-2 py-1 bg-cognition-accent02/10 text-cognition-accent02 rounded-full">Pattern reference</span>
                )}
                {/should|must|ensure|require/.test(userAnswer.toLowerCase()) && (
                  <span className="text-xs px-2 py-1 bg-cognition-accent02/10 text-cognition-accent02 rounded-full">Clear requirements</span>
                )}
              </div>
            )}

            {!submitted && (
              <button
                onClick={handleSubmitPrompt}
                disabled={!userAnswer.trim()}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cognition-accent01 to-cognition-accent02 text-cognition-dark01 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="p-4 bg-cognition-dark01 rounded-lg border border-cognition-dark03">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-cognition-grey01">Prompt Quality Score</span>
                <span className={`text-lg font-bold ${getScoreColor(feedback.score)}`}>
                  {feedback.score}% &mdash; {getScoreLabel(feedback.score)}
                </span>
              </div>
              <div className="w-full h-3 bg-cognition-dark03 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getScoreBgColor(feedback.score)}`}
                  style={{ width: `${feedback.score}%` }}
                />
              </div>
            </div>

            {/* Strengths */}
            {feedback.strengths.length > 0 && (
              <div className="p-4 bg-cognition-accent02/10 rounded-lg border border-cognition-accent02/30">
                <p className="text-xs font-semibold text-cognition-accent02 uppercase tracking-wide mb-2 font-heading">What you did well</p>
                <ul className="space-y-1">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-cognition-accent02 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements.length > 0 && (
              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2 font-heading">How to improve</p>
                <ul className="space-y-1">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-amber-300 flex items-center gap-2">
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cognition-accent01 hover:text-cognition-accent01/80 hover:bg-cognition-accent01/10 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Explanation / Feedback (for MC) */}
        {submitted && exercise.explanation && (exercise.type === 'multiple-choice' || exercise.type === 'comparison') && (
          <div className="mt-4 p-4 bg-cognition-accent01/10 rounded-lg border border-cognition-accent01/30">
            <p className="text-sm text-cognition-accent01">
              <span className="font-semibold">Explanation: </span>
              {exercise.explanation}
            </p>
          </div>
        )}

        {/* Hint */}
        {exercise.hint && !submitted && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-3 flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
            {showHint ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
        {showHint && exercise.hint && (
          <div className="mt-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 animate-fade-in">
            <p className="text-sm text-amber-300">{exercise.hint}</p>
          </div>
        )}

        {/* Ideal Answer */}
        {submitted && exercise.idealAnswer && (
          <div className="mt-3">
            <button
              onClick={() => setShowIdeal(!showIdeal)}
              className="flex items-center gap-2 text-sm text-cognition-accent02 hover:text-cognition-accent02/80 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {showIdeal ? 'Hide Ideal Answer' : 'View Ideal Answer'}
              {showIdeal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showIdeal && (
              <div className="mt-2 p-4 bg-cognition-accent02/10 rounded-lg border border-cognition-accent02/20 animate-fade-in">
                <p className="text-xs font-semibold text-cognition-accent02 uppercase tracking-wide mb-2 font-heading">Ideal Answer</p>
                <p className="text-sm text-cognition-grey01 whitespace-pre-wrap">{exercise.idealAnswer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
