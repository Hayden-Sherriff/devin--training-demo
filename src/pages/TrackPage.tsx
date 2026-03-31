import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  BookOpen,
  Rocket,
  Award,
} from 'lucide-react';
import { useState } from 'react';
import { getTrackById } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { ProgressBar } from '../components/ProgressBar';
import { CompletionModal } from '../components/CompletionModal';
import { useCertificates } from '../hooks/useCertificates';

const trackIcons: Record<string, React.ReactNode> = {
  beginner: <GraduationCap className="w-6 h-6" />,
  intermediate: <BookOpen className="w-6 h-6" />,
  advanced: <Rocket className="w-6 h-6" />,
};

const trackGradients: Record<string, string> = {
  beginner: 'from-cognition-accent02/80 to-cognition-accent02',
  intermediate: 'from-cognition-accent01/80 to-cognition-accent01',
  advanced: 'from-purple-400/80 to-purple-500',
};

const trackProgressColors: Record<string, string> = {
  beginner: 'bg-cognition-accent02',
  intermediate: 'bg-cognition-accent01',
  advanced: 'bg-purple-400',
};

export function TrackPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const { isLessonComplete, getTrackProgress, getModuleProgress } = useProgress();
  const { hasCertificate } = useCertificates();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const track = trackId ? getTrackById(trackId) : undefined;

  if (!track) {
    return (
      <div className="text-center py-16">
        <p className="text-cognition-grey02">Track not found.</p>
        <Link to="/" className="text-cognition-accent01 hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const trackProgress = getTrackProgress(track.id);
  const isTrackComplete = trackProgress.percentage === 100;
  const hasExistingCert = hasCertificate(track.id);

  // Count total exercises in this track
  const totalExercises = track.modules.reduce(
    (sum, mod) => sum + mod.lessons.reduce((s, l) => s + l.exercises.length, 0),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-cognition-grey02 hover:text-cognition-light01 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Track Header */}
      <div className="bg-cognition-dark02 rounded-2xl p-8 text-cognition-light01 border border-cognition-dark03">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${trackGradients[track.level]} flex items-center justify-center`}>
            {trackIcons[track.level]}
          </div>
          <h1 className="text-2xl font-heading font-light tracking-wide">{track.title}</h1>
        </div>
        <p className="text-cognition-grey01 max-w-xl">{track.description}</p>
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-cognition-grey02">
              {trackProgress.completed} of {trackProgress.total} lessons complete
            </span>
            <span className="font-semibold text-cognition-light01">{trackProgress.percentage}%</span>
          </div>
          <div className="w-full bg-cognition-dark03 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-cognition-accent01 to-cognition-accent02 rounded-full h-2.5 transition-all duration-500"
              style={{ width: `${trackProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Certificate / Completion Button */}
        {isTrackComplete && (
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setShowCompletionModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-cognition-dark01 font-medium text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
            >
              <Award className="w-4 h-4" />
              {hasExistingCert ? 'View Certificate' : 'Claim Your Certificate'}
            </button>
            {hasExistingCert && (
              <Link
                to="/certificates"
                className="text-sm text-cognition-grey02 hover:text-cognition-light01 transition-colors"
              >
                View all certificates
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {track.modules.map((mod, modIdx) => {
          const modProgress = getModuleProgress(mod.id);
          return (
            <div key={mod.id} className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 overflow-hidden">
              {/* Module Header */}
              <div className="p-5 border-b border-cognition-dark03">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-cognition-dark03 rounded-lg flex items-center justify-center text-sm font-bold text-cognition-grey02">
                      {modIdx + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-cognition-light01">{mod.title}</h3>
                      <p className="text-sm text-cognition-grey02">{mod.description}</p>
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
              <div className="divide-y divide-cognition-dark03/50">
                {mod.lessons.map(lesson => {
                  const completed = isLessonComplete(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      to={`/lesson/${lesson.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-cognition-dark03/30 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completed
                          ? 'bg-cognition-accent02/20'
                          : 'bg-cognition-dark03'
                      }`}>
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-cognition-accent02" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-cognition-grey02" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium group-hover:text-cognition-accent01 transition-colors ${
                          completed ? 'text-cognition-grey02' : 'text-cognition-light01'
                        }`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-cognition-grey02 mt-0.5 truncate">
                          {lesson.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="flex items-center gap-1 text-xs text-cognition-grey02">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.duration}
                        </span>
                        <ArrowRight className="w-4 h-4 text-cognition-grey02 group-hover:text-cognition-accent01 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
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
