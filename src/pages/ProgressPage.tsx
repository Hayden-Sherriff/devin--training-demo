import { Link } from 'react-router-dom';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Trophy,
  RotateCcw,
  GraduationCap,
  BookOpen,
  Rocket,
} from 'lucide-react';
import { tracks, getAllLessons } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { ProgressBar } from '../components/ProgressBar';

const trackIcons: Record<string, React.ReactNode> = {
  beginner: <GraduationCap className="w-5 h-5" />,
  intermediate: <BookOpen className="w-5 h-5" />,
  advanced: <Rocket className="w-5 h-5" />,
};

const trackColors: Record<string, string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
};

const trackBgColors: Record<string, string> = {
  beginner: 'bg-emerald-50 text-emerald-600',
  intermediate: 'bg-blue-50 text-blue-600',
  advanced: 'bg-purple-50 text-purple-600',
};

export function ProgressPage() {
  const {
    progress,
    getOverallProgress,
    getTrackProgress,
    isLessonComplete,
    resetProgress,
  } = useProgress();

  const overall = getOverallProgress();
  const allLessons = getAllLessons();

  const recentlyAccessed = allLessons
    .filter(l => progress.lessons[l.lesson.id]?.lastAccessed)
    .sort((a, b) =>
      (progress.lessons[b.lesson.id]?.lastAccessed || 0) -
      (progress.lessons[a.lesson.id]?.lastAccessed || 0)
    )
    .slice(0, 5);

  const totalExercises = allLessons.reduce((sum, l) => sum + l.lesson.exercises.length, 0);
  const completedExercises = Object.values(progress.lessons).reduce(
    (sum, lp) => sum + lp.exerciseResults.filter(r => r.completed).length,
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress Tracker</h1>
            <p className="text-sm text-gray-500">Track your learning journey</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
              resetProgress();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Overall Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto relative">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${overall.percentage}, 100`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{overall.percentage}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Complete</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{overall.completed}</p>
              <p className="text-sm text-gray-500">Lessons Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedExercises}</p>
              <p className="text-sm text-gray-500">Exercises Done ({totalExercises} total)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Track Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Track Progress</h2>
        <div className="space-y-4">
          {tracks.map(track => {
            const tp = getTrackProgress(track.id);
            return (
              <Link
                key={track.id}
                to={`/track/${track.id}`}
                className="block p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${trackBgColors[track.level]}`}>
                      {trackIcons[track.level]}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900">{track.title}</h3>
                      <p className="text-xs text-gray-400">
                        {tp.completed} of {tp.total} lessons
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{tp.percentage}%</span>
                </div>
                <ProgressBar percentage={tp.percentage} size="sm" color={trackColors[track.level]} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Lesson Detail */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Lessons</h2>
        <div className="space-y-1">
          {allLessons.map(({ track, lesson }) => {
            const completed = isLessonComplete(lesson.id);
            return (
              <Link
                key={lesson.id}
                to={`/lesson/${lesson.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completed ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  {completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium group-hover:text-blue-600 transition-colors ${
                    completed ? 'text-gray-500' : 'text-gray-800'
                  }`}>
                    {lesson.title}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${trackBgColors[track.level]} font-medium`}>
                  {track.level}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {lesson.duration}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {recentlyAccessed.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {recentlyAccessed.map(({ lesson }) => {
              const lp = progress.lessons[lesson.id];
              return (
                <Link
                  key={lesson.id}
                  to={`/lesson/${lesson.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
                  <span className="text-xs text-gray-400">
                    {lp?.lastAccessed
                      ? new Date(lp.lastAccessed).toLocaleDateString()
                      : ''}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
