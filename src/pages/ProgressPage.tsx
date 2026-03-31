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
  beginner: 'bg-cognition-accent02',
  intermediate: 'bg-cognition-accent01',
  advanced: 'bg-purple-400',
};

const trackBgColors: Record<string, string> = {
  beginner: 'bg-cognition-accent02/10 text-cognition-accent02',
  intermediate: 'bg-cognition-accent01/10 text-cognition-accent01',
  advanced: 'bg-purple-500/10 text-purple-400',
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
          <div className="w-10 h-10 bg-gradient-to-br from-cognition-accent01 to-cognition-accent02 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-cognition-dark01" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-light tracking-wide text-cognition-light01">Progress Tracker</h1>
            <p className="text-sm text-cognition-grey02">Track your learning journey</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
              resetProgress();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-cognition-error hover:text-cognition-error/80 hover:bg-cognition-error/10 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Overall Stats */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-6">
        <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-4">Overall Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto relative">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#364363"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#9EAEE9"
                  strokeWidth="3"
                  strokeDasharray={`${overall.percentage}, 100`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-cognition-light01">{overall.percentage}%</span>
              </div>
            </div>
            <p className="text-sm text-cognition-grey02 mt-2">Complete</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cognition-accent02/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-cognition-accent02" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cognition-light01">{overall.completed}</p>
              <p className="text-sm text-cognition-grey02">Lessons Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cognition-accent01/10 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-cognition-accent01" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cognition-light01">{completedExercises}</p>
              <p className="text-sm text-cognition-grey02">Exercises Done ({totalExercises} total)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Track Progress */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-6">
        <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-4">Track Progress</h2>
        <div className="space-y-4">
          {tracks.map(track => {
            const tp = getTrackProgress(track.id);
            return (
              <Link
                key={track.id}
                to={`/track/${track.id}`}
                className="block p-4 rounded-lg border border-cognition-dark03 hover:border-cognition-dark03/80 hover:bg-cognition-dark03/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${trackBgColors[track.level]}`}>
                      {trackIcons[track.level]}
                    </span>
                    <div>
                      <h3 className="font-medium text-cognition-light01">{track.title}</h3>
                      <p className="text-xs text-cognition-grey02">
                        {tp.completed} of {tp.total} lessons
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-cognition-grey01">{tp.percentage}%</span>
                </div>
                <ProgressBar percentage={tp.percentage} size="sm" color={trackColors[track.level]} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Lesson Detail */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-6">
        <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-4">All Lessons</h2>
        <div className="space-y-1">
          {allLessons.map(({ track, lesson }) => {
            const completed = isLessonComplete(lesson.id);
            return (
              <Link
                key={lesson.id}
                to={`/lesson/${lesson.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-cognition-dark03/30 transition-colors group"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completed ? 'bg-cognition-accent02/20' : 'bg-cognition-dark03'
                }`}>
                  {completed ? (
                    <CheckCircle2 className="w-4 h-4 text-cognition-accent02" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-cognition-grey02" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium group-hover:text-cognition-accent01 transition-colors ${
                    completed ? 'text-cognition-grey02' : 'text-cognition-light01'
                  }`}>
                    {lesson.title}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${trackBgColors[track.level]} font-medium`}>
                  {track.level}
                </span>
                <span className="flex items-center gap-1 text-xs text-cognition-grey02">
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
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-6">
          <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {recentlyAccessed.map(({ lesson }) => {
              const lp = progress.lessons[lesson.id];
              return (
                <Link
                  key={lesson.id}
                  to={`/lesson/${lesson.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-cognition-dark03/30 transition-colors"
                >
                  <Clock className="w-4 h-4 text-cognition-grey02" />
                  <span className="text-sm text-cognition-grey01 flex-1">{lesson.title}</span>
                  <span className="text-xs text-cognition-grey02">
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
