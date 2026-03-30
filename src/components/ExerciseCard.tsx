import { useState } from 'react';
import { CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp, Send } from 'lucide-react';
import type { Exercise } from '../data/curriculum';

interface ExerciseCardProps {
  exercise: Exercise;
  lessonId: string;
  savedResult?: { completed: boolean; userAnswer?: string; isCorrect?: boolean };
  onComplete: (exerciseId: string, userAnswer: string, isCorrect: boolean) => void;
}

export function ExerciseCard({ exercise, savedResult, onComplete }: ExerciseCardProps) {
  const [userAnswer, setUserAnswer] = useState(savedResult?.userAnswer || '');
  const [selectedOption, setSelectedOption] = useState<number | null>(
    savedResult?.userAnswer ? parseInt(savedResult.userAnswer) : null
  );
  const [submitted, setSubmitted] = useState(savedResult?.completed || false);
  const [showHint, setShowHint] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);

  const handleSubmitPrompt = () => {
    if (!userAnswer.trim()) return;
    setSubmitted(true);
    onComplete(exercise.id, userAnswer, true);
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
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">
              {exercise.type === 'multiple-choice' ? 'MC' : exercise.type === 'prompt-writing' ? 'PW' : 'EX'}
            </span>
          </div>
          <div className="flex-1">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              {exercise.type === 'multiple-choice' ? 'Multiple Choice' :
               exercise.type === 'prompt-writing' ? 'Prompt Writing' :
               exercise.type === 'comparison' ? 'Comparison' : 'Exercise'}
            </span>
            <p className="text-gray-800 font-medium mt-1">{exercise.question}</p>
          </div>
          {submitted && (
            <div className="flex-shrink-0">
              {exercise.type === 'multiple-choice' ? (
                selectedOption === exercise.correctOption ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
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

        {/* Prompt Writing */}
        {exercise.type === 'prompt-writing' && (
          <div className="space-y-3">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={submitted}
              placeholder="Write your prompt here..."
              className="w-full h-36 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
            {!submitted && (
              <button
                onClick={handleSubmitPrompt}
                disabled={!userAnswer.trim()}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Submit Answer
              </button>
            )}
          </div>
        )}

        {/* Freeform */}
        {exercise.type === 'freeform' && (
          <div className="space-y-3">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={submitted}
              placeholder="Type your answer..."
              className="w-full h-28 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50"
            />
            {!submitted && (
              <button
                onClick={handleSubmitPrompt}
                disabled={!userAnswer.trim()}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            )}
          </div>
        )}

        {/* Explanation / Feedback */}
        {submitted && exercise.explanation && (
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
