import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { getLessonById, getNextLesson, getPrevLesson } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { LessonContentRenderer } from '../components/LessonContent';
import { ExerciseCard } from '../components/ExerciseCard';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const {
    progress,
    markLessonComplete,
    markLessonIncomplete,
    saveExerciseResult,
    isLessonComplete,
  } = useProgress();
  const [showTips, setShowTips] = useState(false);

  const data = lessonId ? getLessonById(lessonId) : null;

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-cognition-grey02">Lesson not found.</p>
        <Link to="/" className="text-cognition-accent01 hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { track, module: mod, lesson } = data;
  const nextLesson = getNextLesson(lesson.id);
  const prevLesson = getPrevLesson(lesson.id);
  const completed = isLessonComplete(lesson.id);
  const lessonProgress = progress.lessons[lesson.id];

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
    </div>
  );
}
