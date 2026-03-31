import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Rocket,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Trophy,
  Flame,
  Share2,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { tracks } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { ProgressBar } from '../components/ProgressBar';
import { getStreakData, getStreakEmoji } from '../lib/streaks';
import { getReferralData } from '../lib/referral';
import { copyToClipboard } from '../lib/sharing';

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

const trackBorders: Record<string, string> = {
  beginner: 'border-cognition-dark03 hover:border-cognition-accent02/50',
  intermediate: 'border-cognition-dark03 hover:border-cognition-accent01/50',
  advanced: 'border-cognition-dark03 hover:border-purple-400/50',
};

const trackProgressColors: Record<string, string> = {
  beginner: 'bg-cognition-accent02',
  intermediate: 'bg-cognition-accent01',
  advanced: 'bg-purple-400',
};

export function Dashboard() {
  const { getOverallProgress, getTrackProgress } = useProgress();
  const overall = getOverallProgress();
  const streakData = getStreakData();
  const referralData = getReferralData();
  const [copiedReferral, setCopiedReferral] = useState(false);

  const handleCopyReferral = async () => {
    const referralUrl = `https://devin-training-website-c0fmycjp.devinapps.com?ref=${referralData.myReferralCode}`;
    await copyToClipboard(referralUrl);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-cognition-dark02 rounded-2xl p-8 text-cognition-light01 relative overflow-hidden border border-cognition-dark03">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cognition-accent01/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cognition-accent02/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cognition-accent01 to-cognition-accent02 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cognition-dark01" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-light tracking-wide gradient-text">Devin Training Academy</h1>
          </div>
          <p className="text-cognition-grey01 max-w-xl text-lg mb-6">
            Master the art of working with Devin, the AI software engineer. From basic prompting to complex project orchestration.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-cognition-dark03/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm text-cognition-grey02">Progress</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 bg-cognition-dark03 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cognition-accent01 to-cognition-accent02 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${overall.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-cognition-light01">{overall.percentage}%</span>
              </div>
            </div>
            <div className="bg-cognition-dark03/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm text-cognition-grey02">Lessons</span>
              <p className="font-semibold text-cognition-light01">{overall.completed} / {overall.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-cognition-accent02/10 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-cognition-accent02" />
          </div>
          <div>
            <p className="text-sm text-cognition-grey02">Completed</p>
            <p className="text-2xl font-bold text-cognition-light01">{overall.completed}/{overall.total}</p>
          </div>
        </div>
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-cognition-accent01/10 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-cognition-accent01" />
          </div>
          <div>
            <p className="text-sm text-cognition-grey02">Progress</p>
            <p className="text-2xl font-bold text-cognition-light01">{overall.percentage}%</p>
          </div>
        </div>
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-cognition-grey02">Streak {getStreakEmoji(streakData.currentStreak)}</p>
            <p className="text-2xl font-bold text-cognition-light01">{streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-cognition-grey02">Referrals</p>
            <p className="text-2xl font-bold text-cognition-light01">{referralData.referralCount}</p>
          </div>
        </div>
      </div>

      {/* Referral Banner */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-accent01/30 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cognition-accent01/10 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-cognition-accent01" />
            </div>
            <div>
              <h3 className="font-medium text-cognition-light01 text-sm">Share with friends</h3>
              <p className="text-xs text-cognition-grey02">Invite others to train with Devin and track your referrals</p>
            </div>
          </div>
          <button
            onClick={handleCopyReferral}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copiedReferral
                ? 'bg-cognition-accent02/20 text-cognition-accent02 border border-cognition-accent02/30'
                : 'border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50'
            }`}
          >
            {copiedReferral ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedReferral ? 'Copied!' : 'Copy Referral Link'}
          </button>
        </div>
      </div>

      {/* Learning Tracks */}
      <div>
        <h2 className="text-xl font-light text-cognition-light01 mb-4 font-heading tracking-wide">Learning Tracks</h2>
        <div className="grid grid-cols-1 gap-4">
          {tracks.map(track => {
            const progress = getTrackProgress(track.id);
            const totalLessons = track.modules.reduce((sum, m) => sum + m.lessons.length, 0);
            return (
              <Link
                key={track.id}
                to={`/track/${track.id}`}
                className={`block bg-cognition-dark02 rounded-xl border-2 ${trackBorders[track.level]} p-6 transition-all hover:shadow-lg hover:shadow-cognition-dark01/50 group`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trackGradients[track.level]} flex items-center justify-center text-white`}>
                      {trackIcons[track.level]}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-cognition-light01 group-hover:text-cognition-accent01 transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-sm text-cognition-grey02 mt-1 max-w-lg">
                        {track.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-cognition-grey02">
                        <span>{track.modules.length} modules</span>
                        <span>{totalLessons} lessons</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-cognition-grey02 group-hover:text-cognition-accent01 transition-colors mt-1" />
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
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-accent02/30 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-cognition-accent02/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-cognition-accent02" />
            </div>
            <div>
              <h3 className="font-medium text-cognition-light01">New here? Start with the Beginner Track</h3>
              <p className="text-sm text-cognition-grey02 mt-1">
                Learn the fundamentals of Devin, from understanding what it is to writing your first effective prompts.
              </p>
              <Link
                to="/lesson/what-is-devin"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-cognition-accent01 to-cognition-accent02 text-cognition-dark01 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
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
