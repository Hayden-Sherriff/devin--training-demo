import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Rocket,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Trophy,
} from 'lucide-react';
import { tracks } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { ProgressBar } from '../components/ProgressBar';

const trackIcons: Record<string, React.ReactNode> = {
  beginner: <GraduationCap className="w-6 h-6" />,
  intermediate: <BookOpen className="w-6 h-6" />,
  advanced: <Rocket className="w-6 h-6" />,
};

const trackGradients: Record<string, string> = {
  beginner: 'from-emerald-500 to-teal-600',
  intermediate: 'from-blue-500 to-indigo-600',
  advanced: 'from-purple-500 to-pink-600',
};

const trackBorders: Record<string, string> = {
  beginner: 'border-emerald-200 hover:border-emerald-300',
  intermediate: 'border-blue-200 hover:border-blue-300',
  advanced: 'border-purple-200 hover:border-purple-300',
};

const trackProgressColors: Record<string, string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
};

export function Dashboard() {
  const { getOverallProgress, getTrackProgress } = useProgress();
  const overall = getOverallProgress();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Devin Training Academy</h1>
          </div>
          <p className="text-blue-100 max-w-xl text-lg mb-6">
            Master the art of working with Devin, the AI software engineer. From basic prompting to complex project orchestration.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm text-blue-200">Progress</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${overall.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{overall.percentage}%</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm text-blue-200">Lessons</span>
              <p className="font-semibold">{overall.completed} / {overall.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Lessons Completed</p>
            <p className="text-2xl font-bold text-gray-900">{overall.completed}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Lessons</p>
            <p className="text-2xl font-bold text-gray-900">{overall.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Overall Progress</p>
            <p className="text-2xl font-bold text-gray-900">{overall.percentage}%</p>
          </div>
        </div>
      </div>

      {/* Learning Tracks */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Tracks</h2>
        <div className="grid grid-cols-1 gap-4">
          {tracks.map(track => {
            const progress = getTrackProgress(track.id);
            const totalLessons = track.modules.reduce((sum, m) => sum + m.lessons.length, 0);
            return (
              <Link
                key={track.id}
                to={`/track/${track.id}`}
                className={`block bg-white rounded-xl border-2 ${trackBorders[track.level]} p-6 transition-all hover:shadow-md group`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trackGradients[track.level]} flex items-center justify-center text-white`}>
                      {trackIcons[track.level]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-lg">
                        {track.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span>{track.modules.length} modules</span>
                        <span>{totalLessons} lessons</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors mt-1" />
                </div>
                <div className="mt-4">
                  <ProgressBar
                    percentage={progress.percentage}
                    color={trackProgressColors[track.level]}
                    size="sm"
                    showLabel
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Getting Started CTA */}
      {overall.completed === 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">New here? Start with the Beginner Track</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Learn the fundamentals of Devin, from understanding what it is to writing your first effective prompts.
              </p>
              <Link
                to="/lesson/what-is-devin"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
