import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  BookOpen,
  Rocket,
} from 'lucide-react';
import { getTrackById } from '../data/curriculum';
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

const trackProgressColors: Record<string, string> = {
  beginner: 'bg-emerald-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
};

export function TrackPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const { isLessonComplete, getTrackProgress, getModuleProgress } = useProgress();

  const track = trackId ? getTrackById(trackId) : undefined;

  if (!track) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Track not found.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const trackProgress = getTrackProgress(track.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Track Header */}
      <div className={`bg-gradient-to-br ${trackGradients[track.level]} rounded-2xl p-8 text-white`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            {trackIcons[track.level]}
          </div>
          <h1 className="text-2xl font-bold">{track.title}</h1>
        </div>
        <p className="text-white/80 max-w-xl">{track.description}</p>
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/70">
              {trackProgress.completed} of {trackProgress.total} lessons complete
            </span>
            <span className="font-semibold">{trackProgress.percentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div
              className="bg-white rounded-full h-2.5 transition-all duration-500"
              style={{ width: `${trackProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {track.modules.map((mod, modIdx) => {
          const modProgress = getModuleProgress(mod.id);
          return (
            <div key={mod.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Module Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500">
                      {modIdx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{mod.title}</h3>
                      <p className="text-sm text-gray-500">{mod.description}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    percentage={modProgress.percentage}
                    size="sm"
                    color={trackProgressColors[track.level]}
                  />
                </div>
              </div>

              {/* Lessons */}
              <div className="divide-y divide-gray-50">
                {mod.lessons.map(lesson => {
                  const completed = isLessonComplete(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      to={`/lesson/${lesson.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completed
                          ? 'bg-emerald-100'
                          : 'bg-gray-100'
                      }`}>
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium group-hover:text-blue-600 transition-colors ${
                          completed ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {lesson.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.duration}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
