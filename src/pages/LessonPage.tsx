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
        <p className="text-gray-500">Lesson not found.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
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
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-700 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link to={`/track/${track.id}`} className="hover:text-gray-700 transition-colors">
          {track.title}
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <span className="px-2 py-0.5 bg-gray-100 rounded-full font-medium capitalize">
                {track.level}
              </span>
              <span>{mod.title}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-500 mt-1">{lesson.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {lesson.duration}
              </span>
              {lesson.exercises.length > 0 && (
                <span className="text-sm text-gray-400">
                  {lesson.exercises.length} exercise{lesson.exercises.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => completed ? markLessonIncomplete(lesson.id) : markLessonComplete(lesson.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              completed
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${completed ? 'text-emerald-600' : 'text-gray-400'}`} />
            {completed ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <LessonContentRenderer content={lesson.content} />
      </div>

      {/* Tips Section */}
      {lesson.tips.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-600" />
              </div>
              <span className="font-semibold text-gray-900">
                Tips & Best Practices ({lesson.tips.length})
              </span>
            </div>
            {showTips ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {showTips && (
            <div className="px-5 pb-5 animate-fade-in">
              <ul className="space-y-2">
                {lesson.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-amber-800">{tip}</span>
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
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">
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
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {prevLesson ? (
          <Link
            to={`/lesson/${prevLesson.lesson.id}`}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="text-left">
              <span className="text-xs text-gray-400 block">Previous</span>
              <span className="font-medium">{prevLesson.lesson.title}</span>
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
            className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <div className="text-right">
              <span className="text-xs text-blue-200 block">Next Lesson</span>
              <span>{nextLesson.lesson.title}</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            to={`/track/${track.id}`}
            className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Back to Track
            <CheckCircle2 className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
