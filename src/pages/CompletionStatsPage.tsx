import { Link } from 'react-router-dom';
import { BarChart3, Award, Flame, Clock, Target, Users, TrendingUp, Calendar } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useCertificates } from '../hooks/useCertificates';
import { tracks } from '../data/curriculum';
import { getStreakData, getStreakEmoji } from '../lib/streaks';
import { getReferralData } from '../lib/referral';
import { tierConfig } from '../lib/certificateId';

export function CompletionStatsPage() {
  const { getOverallProgress, getTrackProgress, progress } = useProgress();
  const { certificates } = useCertificates();
  const overall = getOverallProgress();
  const streakData = getStreakData();
  const referralData = getReferralData();

  // Calculate total exercises completed
  const totalExercisesCompleted = Object.values(progress.lessons).reduce((sum, lesson) => {
    return sum + (lesson.exerciseResults?.filter(r => r.completed).length || 0);
  }, 0);

  // Calculate average prompt score
  const promptScores = Object.values(progress.lessons).flatMap(lesson =>
    (lesson.exerciseResults || []).filter(r => r.completed && r.userAnswer).map(() => {
      return 50; // placeholder average
    })
  );
  const avgPromptScore = certificates.length > 0
    ? Math.round(certificates.reduce((sum, c) => sum + (c.promptQualityScore || 0), 0) / certificates.length)
    : 0;

  // Tier distribution
  const tierCounts = { bronze: 0, silver: 0, gold: 0 };
  certificates.forEach(c => {
    if (c.tier) tierCounts[c.tier]++;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cognition-accent01 to-cognition-accent02 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-cognition-dark01" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-light tracking-wide text-cognition-light01">Completion Stats</h1>
          <p className="text-sm text-cognition-grey02">Your learning journey at a glance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5 text-center">
          <Target className="w-6 h-6 text-cognition-accent02 mx-auto mb-2" />
          <p className="text-2xl font-bold text-cognition-light01">{overall.completed}</p>
          <p className="text-xs text-cognition-grey02">Lessons Done</p>
        </div>
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5 text-center">
          <Award className="w-6 h-6 text-cognition-accent01 mx-auto mb-2" />
          <p className="text-2xl font-bold text-cognition-light01">{certificates.length}</p>
          <p className="text-xs text-cognition-grey02">Certificates</p>
        </div>
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-cognition-light01">{streakData.currentStreak}</p>
          <p className="text-xs text-cognition-grey02">Day Streak {getStreakEmoji(streakData.currentStreak)}</p>
        </div>
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5 text-center">
          <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-cognition-light01">{referralData.referralCount}</p>
          <p className="text-xs text-cognition-grey02">Referrals</p>
        </div>
      </div>

      {/* Extended Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-cognition-grey02" />
            <span className="text-sm text-cognition-grey02">Activity</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cognition-grey02">Total active days</span>
              <span className="text-cognition-light01 font-medium">{streakData.totalActiveDays}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cognition-grey02">Longest streak</span>
              <span className="text-cognition-light01 font-medium">{streakData.longestStreak} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cognition-grey02">Exercises completed</span>
              <span className="text-cognition-light01 font-medium">{totalExercisesCompleted}</span>
            </div>
          </div>
        </div>

        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-cognition-grey02" />
            <span className="text-sm text-cognition-grey02">Prompt Skills</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cognition-grey02">Avg prompt score</span>
              <span className="text-cognition-light01 font-medium">{avgPromptScore}%</span>
            </div>
            <div className="w-full h-2 bg-cognition-dark03 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cognition-accent01 to-cognition-accent02 transition-all duration-500"
                style={{ width: `${avgPromptScore}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cognition-grey02">Prompt exercises</span>
              <span className="text-cognition-light01 font-medium">{promptScores.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-cognition-grey02" />
            <span className="text-sm text-cognition-grey02">Tier Collection</span>
          </div>
          <div className="space-y-2">
            {(['gold', 'silver', 'bronze'] as const).map(tier => (
              <div key={tier} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{tierConfig[tier].badgeEmoji}</span>
                  <span style={{ color: tierConfig[tier].color }}>{tierConfig[tier].label}</span>
                </div>
                <span className="text-cognition-light01 font-medium">{tierCounts[tier]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Track Progress */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-6">
        <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cognition-grey02" />
          Track Progress
        </h2>
        <div className="space-y-4">
          {tracks.map(track => {
            const tp = getTrackProgress(track.id);
            const cert = certificates.find(c => c.trackId === track.id);
            return (
              <Link key={track.id} to={`/track/${track.id}`} className="block hover:bg-cognition-dark03/20 rounded-lg p-3 -mx-3 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-cognition-light01">{track.title}</span>
                    {cert && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cognition-accent02/20 text-cognition-accent02">
                        {cert.tier ? tierConfig[cert.tier].badgeEmoji : ''} Certified
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-cognition-grey02">{tp.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-cognition-dark03 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${tp.percentage}%`,
                      background: 'linear-gradient(to right, #7485CA, #85C4C0)',
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Activity Heatmap (simplified) */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-6">
        <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-4">
          Recent Activity
        </h2>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const dateStr = date.toISOString().split('T')[0];
            const isActive = streakData.activeDates.includes(dateStr);
            return (
              <div
                key={i}
                className="w-4 h-4 rounded-sm"
                style={{
                  backgroundColor: isActive ? '#A2D1CE' : '#1F283B',
                }}
                title={`${dateStr}${isActive ? ' - Active' : ''}`}
              />
            );
          })}
        </div>
        <p className="text-xs text-cognition-grey02 mt-2">Last 30 days</p>
      </div>
    </div>
  );
}
