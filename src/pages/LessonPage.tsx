import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Timer,
  GitCompare,
  Brain,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getLessonById, getNextLesson, getPrevLesson } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { LessonContentRenderer } from '../components/LessonContent';
import { ExerciseCard } from '../components/ExerciseCard';
import { CompletionModal } from '../components/CompletionModal';
import { recordActivity } from '../lib/streaks';

// Mini-quiz questions injected between lessons
interface MiniQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const miniQuizzes: Record<string, MiniQuiz> = {
  'what-is-devin': {
    question: 'What is Devin primarily designed to do?',
    options: ['Replace human developers', 'Assist developers as an AI software engineer', 'Only write documentation', 'Manage project timelines'],
    correctIndex: 1,
    explanation: 'Devin is an AI software engineer that assists developers with coding tasks, not replaces them.',
  },
  'basic-prompting': {
    question: 'What makes a prompt effective for Devin?',
    options: ['Being as short as possible', 'Using technical jargon only', 'Being specific with context, file paths, and clear requirements', 'Asking multiple unrelated things at once'],
    correctIndex: 2,
    explanation: 'Effective prompts include specific context, file paths, and clear requirements so Devin knows exactly what to do.',
  },
  'assigning-tasks': {
    question: 'When assigning tasks to Devin, you should:',
    options: ['Give vague instructions', 'Break complex tasks into smaller steps', 'Never review the output', 'Skip providing context'],
    correctIndex: 1,
    explanation: 'Breaking complex tasks into smaller, well-defined steps helps Devin deliver better results.',
  },
  'multi-step-tasks': {
    question: 'How should you approach multi-step tasks with Devin?',
    options: ['Send everything in one massive prompt', 'Break them into sequential, dependent steps', 'Only use Devin for single-step tasks', 'Skip the planning phase'],
    correctIndex: 1,
    explanation: 'Multi-step tasks work best when broken into sequential steps where each builds on the previous.',
  },
  'debugging-outputs': {
    question: 'When Devin produces incorrect output, you should:',
    options: ['Start over completely', 'Provide specific feedback on what went wrong', 'Ignore the errors', 'Never use Devin again'],
    correctIndex: 1,
    explanation: 'Providing specific feedback helps Devin understand the issue and correct it effectively.',
  },
  'prompt-engineering': {
    question: 'Which prompt engineering pattern is most effective?',
    options: ['Minimal context prompts', 'Structured prompts with examples and constraints', 'Only using keywords', 'Copying prompts from others without modification'],
    correctIndex: 1,
    explanation: 'Structured prompts with examples, constraints, and clear expectations produce the best results.',
  },
};

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const {
    progress,
    markLessonComplete,
    markLessonIncomplete,
    saveExerciseResult,
    isLessonComplete,
    getTrackProgress,
  } = useProgress();
  const [showTips, setShowTips] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const prevTrackPercentage = useRef<number | null>(null);

  // Mini-quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizExplanation, setShowQuizExplanation] = useState(false);

  // Timed challenge state
  const [timedChallengeActive, setTimedChallengeActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [timedPrompt, setTimedPrompt] = useState('');
  const [timedChallengeCompleted, setTimedChallengeCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Before/after state
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  const data = lessonId ? getLessonById(lessonId) : null;
  const track = data?.track;
  const trackProgress = track ? getTrackProgress(track.id) : { completed: 0, total: 0, percentage: 0 };

  // Record streak activity
  useEffect(() => {
    recordActivity();
  }, []);

  // Reset quiz state when lesson changes
  useEffect(() => {
    setQuizAnswer(null);
    setShowQuizExplanation(false);
    setTimedChallengeActive(false);
    setTimedChallengeCompleted(false);
    setTimedPrompt('');
    setTimeRemaining(120);
    setShowBeforeAfter(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [lessonId]);

  // Timed challenge timer
  useEffect(() => {
    if (timedChallengeActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimedChallengeActive(false);
            setTimedChallengeCompleted(true);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [timedChallengeActive, timeRemaining]);

  const startTimedChallenge = useCallback(() => {
    setTimedChallengeActive(true);
    setTimeRemaining(120);
    setTimedPrompt('');
    setTimedChallengeCompleted(false);
  }, []);

  const submitTimedChallenge = useCallback(() => {
    setTimedChallengeActive(false);
    setTimedChallengeCompleted(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Auto-trigger completion modal when track reaches 100%
  useEffect(() => {
    if (prevTrackPercentage.current !== null && prevTrackPercentage.current < 100 && trackProgress.percentage === 100) {
      setShowCompletionModal(true);
    }
    prevTrackPercentage.current = trackProgress.percentage;
  }, [trackProgress.percentage]);

  if (!data || !track) {
    return (
      <div className="text-center py-16">
        <p className="text-cognition-grey02">Lesson not found.</p>
        <Link to="/" className="text-cognition-accent01 hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { module: mod, lesson } = data;
  const nextLesson = getNextLesson(lesson.id);
  const prevLesson = getPrevLesson(lesson.id);
  const completed = isLessonComplete(lesson.id);
  const lessonProgress = progress.lessons[lesson.id];

  // Count total exercises in this track
  const totalExercises = track.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.exercises.length, 0),
    0
  );

  const handleExerciseComplete = (exerciseId: string, userAnswer: string, isCorrect: boolean) => {
    saveExerciseResult(lesson.id, {
      exerciseId,
      completed: true,
      userAnswer,
      isCorrect,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-cognition-grey02">
        <Link to="/" className="hover:text-cognition-light01 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link to={`/track/${track.id}`} className="hover:text-cognition-light01 transition-colors">
          {track.title}
        </Link>
        <span>/</span>
        <span className="text-cognition-light01 font-medium truncate">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-cognition-grey02 mb-2">
              <span className="px-2 py-0.5 bg-cognition-dark03 rounded-full font-medium capitalize text-cognition-grey01">
                {track.level}
              </span>
              <span>{mod.title}</span>
            </div>
            <h1 className="text-2xl font-heading font-light tracking-wide text-cognition-light01">{lesson.title}</h1>
            <p className="text-cognition-grey02 mt-1">{lesson.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-cognition-grey02">
                <Clock className="w-4 h-4" />
                {lesson.duration}
              </span>
              {lesson.exercises.length > 0 && (
                <span className="text-sm text-cognition-grey02">
                  {lesson.exercises.length} exercise{lesson.exercises.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => completed ? markLessonIncomplete(lesson.id) : markLessonComplete(lesson.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              completed
                ? 'bg-cognition-accent02/10 text-cognition-accent02 border border-cognition-accent02/30 hover:bg-cognition-accent02/20'
                : 'bg-cognition-dark03 text-cognition-grey02 hover:bg-cognition-accent01/10 hover:text-cognition-accent01 border border-cognition-dark03'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${completed ? 'text-cognition-accent02' : 'text-cognition-grey02'}`} />
            {completed ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-6">
        <LessonContentRenderer content={lesson.content} />
      </div>

      {/* Tips Section */}
      {lesson.tips.length > 0 && (
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 overflow-hidden">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between p-5 hover:bg-cognition-dark03/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-medium text-cognition-light01">
                Tips & Best Practices ({lesson.tips.length})
              </span>
            </div>
            {showTips ? (
              <ChevronUp className="w-5 h-5 text-cognition-grey02" />
            ) : (
              <ChevronDown className="w-5 h-5 text-cognition-grey02" />
            )}
          </button>
          {showTips && (
            <div className="px-5 pb-5 animate-fade-in">
              <ul className="space-y-2">
                {lesson.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <span className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-amber-200">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Exercises */}
      {lesson.exercises.length > 0 && (
        <div>
          <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-cognition-accent01/10 rounded-lg flex items-center justify-center text-xs font-bold text-cognition-accent01">
              {lesson.exercises.length}
            </span>
            Practice Exercises
          </h2>
          <div className="space-y-4">
            {lesson.exercises.map(exercise => {
              const savedResult = lessonProgress?.exerciseResults.find(
                r => r.exerciseId === exercise.id
              );
              return (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  lessonId={lesson.id}
                  savedResult={savedResult}
                  onComplete={handleExerciseComplete}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Mini-Quiz */}
      {lessonId && miniQuizzes[lessonId] && (
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 overflow-hidden">
          <div className="p-5 border-b border-cognition-dark03 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <span className="font-medium text-cognition-light01">Quick Knowledge Check</span>
          </div>
          <div className="p-5">
            <p className="text-sm text-cognition-grey01 mb-4">{miniQuizzes[lessonId].question}</p>
            <div className="space-y-2">
              {miniQuizzes[lessonId].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuizAnswer(idx);
                    setShowQuizExplanation(true);
                  }}
                  disabled={quizAnswer !== null}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${
                    quizAnswer === null
                      ? 'border-cognition-dark03 text-cognition-grey01 hover:bg-cognition-dark03/50 hover:text-cognition-light01'
                      : idx === miniQuizzes[lessonId].correctIndex
                        ? 'border-cognition-accent02/50 bg-cognition-accent02/10 text-cognition-accent02'
                        : idx === quizAnswer
                          ? 'border-red-500/50 bg-red-500/10 text-red-400'
                          : 'border-cognition-dark03 text-cognition-grey02 opacity-50'
                  }`}
                >
                  <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>
            {showQuizExplanation && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                quizAnswer === miniQuizzes[lessonId].correctIndex
                  ? 'bg-cognition-accent02/10 border border-cognition-accent02/30 text-cognition-accent02'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                <p className="font-medium mb-1">
                  {quizAnswer === miniQuizzes[lessonId].correctIndex ? 'Correct!' : 'Not quite!'}
                </p>
                <p className="text-xs opacity-80">{miniQuizzes[lessonId].explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timed Prompt Challenge */}
      {lesson.exercises.length > 0 && (
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 overflow-hidden">
          <div className="p-5 border-b border-cognition-dark03 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Timer className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="font-medium text-cognition-light01">Timed Prompt Challenge</span>
                <p className="text-xs text-cognition-grey02">Write the best prompt you can in 2 minutes</p>
              </div>
            </div>
            {timedChallengeActive && (
              <span className={`text-lg font-mono font-bold ${timeRemaining <= 30 ? 'text-red-400' : 'text-cognition-accent02'}`}>
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </span>
            )}
          </div>
          <div className="p-5">
            {!timedChallengeActive && !timedChallengeCompleted && (
              <div className="text-center py-4">
                <p className="text-sm text-cognition-grey02 mb-4">
                  Challenge: Write a prompt for Devin to complete a task related to this lesson's topic. You have 2 minutes!
                </p>
                <button
                  onClick={startTimedChallenge}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-cognition-dark01 transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
                >
                  Start Challenge
                </button>
              </div>
            )}
            {timedChallengeActive && (
              <div>
                <textarea
                  value={timedPrompt}
                  onChange={e => setTimedPrompt(e.target.value)}
                  placeholder="Write your prompt here... Be specific, include file paths, requirements, and testing instructions."
                  className="w-full h-32 bg-cognition-dark01 text-cognition-grey01 border border-cognition-dark03 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-cognition-accent01"
                  autoFocus
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-cognition-grey02">{timedPrompt.length} characters</span>
                  <button
                    onClick={submitTimedChallenge}
                    disabled={timedPrompt.length < 10}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-cognition-accent02/20 text-cognition-accent02 border border-cognition-accent02/30 hover:bg-cognition-accent02/30 disabled:opacity-50 transition-all"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            {timedChallengeCompleted && (
              <div className="space-y-3">
                <div className="p-3 bg-cognition-accent02/10 border border-cognition-accent02/30 rounded-lg">
                  <p className="text-sm text-cognition-accent02 font-medium mb-1">
                    Challenge Complete! {timeRemaining > 0 ? `(${120 - timeRemaining}s)` : '(Time\'s up!)'}
                  </p>
                  <p className="text-xs text-cognition-grey02">
                    {timedPrompt.length > 200 ? 'Great detail!' : timedPrompt.length > 100 ? 'Good effort!' : 'Try adding more detail next time.'}
                  </p>
                </div>
                {timedPrompt && (
                  <pre className="text-xs text-cognition-grey01 bg-cognition-dark01 rounded-lg p-3 border border-cognition-dark03 whitespace-pre-wrap font-mono">
                    {timedPrompt}
                  </pre>
                )}
                <button
                  onClick={startTimedChallenge}
                  className="text-xs text-cognition-accent01 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Before/After Prompt Comparison */}
      {lesson.exercises.some(e => e.type === 'freeform' || e.type === 'scenario') && (
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 overflow-hidden">
          <button
            onClick={() => setShowBeforeAfter(!showBeforeAfter)}
            className="w-full flex items-center justify-between p-5 hover:bg-cognition-dark03/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cognition-accent01/10 rounded-lg flex items-center justify-center">
                <GitCompare className="w-4 h-4 text-cognition-accent01" />
              </div>
              <span className="font-medium text-cognition-light01">Before vs After: Prompt Improvement</span>
            </div>
            {showBeforeAfter ? <ChevronUp className="w-5 h-5 text-cognition-grey02" /> : <ChevronDown className="w-5 h-5 text-cognition-grey02" />}
          </button>
          {showBeforeAfter && (
            <div className="px-5 pb-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Before</span>
                    <span className="text-xs text-cognition-grey02">Vague prompt</span>
                  </div>
                  <p className="text-sm text-cognition-grey01 font-mono">
                    "Fix the bug in the login page"
                  </p>
                </div>
                <div className="p-4 bg-cognition-accent02/5 border border-cognition-accent02/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-cognition-accent02 uppercase tracking-wider">After</span>
                    <span className="text-xs text-cognition-grey02">Detailed prompt</span>
                  </div>
                  <p className="text-sm text-cognition-grey01 font-mono">
                    "Fix the login form validation in src/components/LoginForm.tsx. The email field accepts invalid formats. Add regex validation, show an error message below the field in red, and add a test in src/__tests__/LoginForm.test.tsx."
                  </p>
                </div>
              </div>
              <p className="text-xs text-cognition-grey02 mt-3">
                Notice how the "after" prompt includes specific file paths, the exact issue, visual requirements, and testing instructions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-cognition-dark03">
        {prevLesson ? (
          <Link
            to={`/lesson/${prevLesson.lesson.id}`}
            className="flex items-center gap-2 text-sm text-cognition-grey02 hover:text-cognition-light01 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="text-left">
              <span className="text-xs text-cognition-grey02 block">Previous</span>
              <span className="font-medium text-cognition-grey01">{prevLesson.lesson.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <button
            onClick={() => {
              if (!completed) markLessonComplete(lesson.id);
              navigate(`/lesson/${nextLesson.lesson.id}`);
            }}
            className="flex items-center gap-2 text-sm bg-gradient-to-r from-cognition-accent01 to-cognition-accent02 text-cognition-dark01 px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <div className="text-right">
              <span className="text-xs text-cognition-dark02 block">Next Lesson</span>
              <span>{nextLesson.lesson.title}</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            to={`/track/${track.id}`}
            className="flex items-center gap-2 text-sm bg-cognition-accent02 text-cognition-dark01 px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Back to Track
            <CheckCircle2 className="w-4 h-4" />
          </Link>
        )}
      </div>
      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        trackId={track.id}
        trackTitle={track.title}
        trackLevel={track.level}
        lessonCount={trackProgress.total}
        exerciseCount={totalExercises}
      />
    </div>
  );
}
