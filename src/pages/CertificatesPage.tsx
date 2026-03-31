import { Link } from 'react-router-dom';
import { useRef, useState, useCallback } from 'react';
import {
  Award,
  Download,
  Linkedin,
  ExternalLink,
  Mail,
  Loader2,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Rocket,
  Twitter,
  Copy,
  UserPlus,
  QrCode,
  Shield,
} from 'lucide-react';
import { Certificate } from '../components/Certificate';
import { useCertificates } from '../hooks/useCertificates';
import { useProgress } from '../hooks/useProgress';
import { tracks } from '../data/curriculum';
import { toPng } from 'html-to-image';
import { sendCertificateEmail, isEmailJSConfigured } from '../lib/emailService';
import { generateLinkedInShareUrl } from '../lib/linkedinShare';
import { generateTwitterShareUrl, copyToClipboard, generateChallengeUrl } from '../lib/sharing';
import { tierConfig } from '../lib/certificateId';

const trackIcons: Record<string, React.ReactNode> = {
  beginner: <GraduationCap className="w-5 h-5" />,
  intermediate: <BookOpen className="w-5 h-5" />,
  advanced: <Rocket className="w-5 h-5" />,
};

const trackBgColors: Record<string, string> = {
  beginner: 'bg-cognition-accent02/10 text-cognition-accent02',
  intermediate: 'bg-cognition-accent01/10 text-cognition-accent01',
  advanced: 'bg-purple-500/10 text-purple-400',
};

export function CertificatesPage() {
  const { certificates, markEmailSent, markLinkedInShared } = useCertificates();
  const [copiedTrack, setCopiedTrack] = useState<string | null>(null);
  const { getTrackProgress } = useProgress();
  const certificateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [downloadingTrack, setDownloadingTrack] = useState<string | null>(null);
  const [sendingTrack, setSendingTrack] = useState<string | null>(null);
  const [emailStatuses, setEmailStatuses] = useState<Record<string, 'idle' | 'sent' | 'error'>>({});

  const handleDownload = useCallback(async (trackId: string, trackLevel: string) => {
    const ref = certificateRefs.current[trackId];
    if (!ref) return;
    setDownloadingTrack(trackId);
    try {
      const dataUrl = await toPng(ref, { quality: 1, pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = `devin-academy-${trackLevel}-certificate.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download certificate:', err);
    } finally {
      setDownloadingTrack(null);
    }
  }, []);

  const handleSendEmail = useCallback(async (cert: typeof certificates[0]) => {
    if (!isEmailJSConfigured()) {
      setEmailStatuses(prev => ({ ...prev, [cert.trackId]: 'error' }));
      return;
    }
    setSendingTrack(cert.trackId);
    try {
      const linkedinUrl = generateLinkedInShareUrl({
        trackTitle: cert.trackTitle,
        trackLevel: cert.trackLevel,
        recipientName: cert.recipientName,
      });
      const success = await sendCertificateEmail({
        toEmail: cert.recipientEmail,
        toName: cert.recipientName,
        trackTitle: cert.trackTitle,
        trackLevel: cert.trackLevel,
        completionDate: cert.completionDate,
        linkedinShareUrl: linkedinUrl,
        trainingUrl: 'https://devin-training-website-c0fmycjp.devinapps.com',
      });
      if (success) {
        setEmailStatuses(prev => ({ ...prev, [cert.trackId]: 'sent' }));
        markEmailSent(cert.trackId);
      } else {
        setEmailStatuses(prev => ({ ...prev, [cert.trackId]: 'error' }));
      }
    } catch {
      setEmailStatuses(prev => ({ ...prev, [cert.trackId]: 'error' }));
    } finally {
      setSendingTrack(null);
    }
  }, [markEmailSent]);

  const handleLinkedInShare = useCallback((cert: typeof certificates[0]) => {
    const url = generateLinkedInShareUrl({
      trackTitle: cert.trackTitle,
      trackLevel: cert.trackLevel,
      recipientName: cert.recipientName,
    });
    markLinkedInShared(cert.trackId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [markLinkedInShared]);

  // Get all tracks with their completion status
  const trackStatuses = tracks.map(track => {
    const progress = getTrackProgress(track.id);
    const cert = certificates.find(c => c.trackId === track.id);
    return { track, progress, cert };
  });

  const earnedCertificates = trackStatuses.filter(t => t.cert);
  const inProgressTracks = trackStatuses.filter(t => !t.cert && t.progress.percentage > 0);
  const notStartedTracks = trackStatuses.filter(t => !t.cert && t.progress.percentage === 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cognition-accent01 to-cognition-accent02 rounded-xl flex items-center justify-center">
          <Award className="w-5 h-5 text-cognition-dark01" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-light tracking-wide text-cognition-light01">Certificates</h1>
          <p className="text-sm text-cognition-grey02">Your achievements and certifications</p>
        </div>
      </div>

      {/* Earned Certificates */}
      {earnedCertificates.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01">
            Earned Certificates ({earnedCertificates.length})
          </h2>
          {earnedCertificates.map(({ cert }) => {
            if (!cert) return null;
            const emailStatus = emailStatuses[cert.trackId] || (cert.emailSent ? 'sent' : 'idle');
            return (
              <div key={cert.trackId} className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 overflow-hidden">
                {/* Certificate render (off-screen for download) */}
                <div className="overflow-hidden" style={{ height: 0 }}>
                  <Certificate
                    ref={(el) => { certificateRefs.current[cert.trackId] = el; }}
                    recipientName={cert.recipientName}
                    trackTitle={cert.trackTitle}
                    trackLevel={cert.trackLevel}
                    completionDate={cert.completionDate}
                    lessonCount={cert.lessonCount}
                    exerciseCount={cert.exerciseCount}
                  />
                </div>

                {/* Certificate card */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${trackBgColors[cert.trackLevel]}`}>
                        {trackIcons[cert.trackLevel]}
                      </span>
                      <div>
                        <h3 className="font-medium text-cognition-light01">{cert.trackTitle}</h3>
                        <p className="text-xs text-cognition-grey02">
                          Completed on {cert.completionDate} &middot; {cert.lessonCount} lessons &middot; {cert.exerciseCount} exercises
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cognition-accent02/10 text-cognition-accent02 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Certified
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDownload(cert.trackId, cert.trackLevel)}
                      disabled={downloadingTrack === cert.trackId}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50 transition-colors disabled:opacity-50 text-sm"
                    >
                      {downloadingTrack === cert.trackId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Download
                    </button>

                    <button
                      onClick={() => handleSendEmail(cert)}
                      disabled={sendingTrack === cert.trackId || emailStatus === 'sent'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm ${
                        emailStatus === 'sent'
                          ? 'bg-cognition-accent02/20 text-cognition-accent02 border border-cognition-accent02/30'
                          : emailStatus === 'error'
                            ? 'bg-cognition-error/10 text-cognition-error border border-cognition-error/30'
                            : 'border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50'
                      }`}
                    >
                      {sendingTrack === cert.trackId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : emailStatus === 'sent' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                      {emailStatus === 'sent' ? 'Sent' : emailStatus === 'error' ? 'Not Configured' : 'Email'}
                    </button>

                    <button
                      onClick={() => handleLinkedInShare(cert)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-cognition-dark01 font-medium text-sm transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        const url = generateTwitterShareUrl({ trackTitle: cert.trackTitle, trackLevel: cert.trackLevel, recipientName: cert.recipientName, certificateId: cert.certificateId });
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50 transition-colors text-sm"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </button>

                    <button
                      onClick={async () => {
                        const certUrl = `${window.location.origin}/certificate/${cert.certificateId}`;
                        await copyToClipboard(certUrl);
                        setCopiedTrack(cert.trackId);
                        setTimeout(() => setCopiedTrack(null), 2000);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                        copiedTrack === cert.trackId
                          ? 'bg-cognition-accent02/20 text-cognition-accent02 border border-cognition-accent02/30'
                          : 'border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50'
                      }`}
                    >
                      {copiedTrack === cert.trackId ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedTrack === cert.trackId ? 'Copied!' : 'Copy Link'}
                    </button>

                    <button
                      onClick={() => {
                        const url = generateChallengeUrl({ trackTitle: cert.trackTitle, trackLevel: cert.trackLevel, recipientName: cert.recipientName, certificateId: cert.certificateId });
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50 transition-colors text-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      Challenge Friend
                    </button>
                  </div>

                  {/* Tier & Certificate ID */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-cognition-dark03">
                    {cert.tier && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${tierConfig[cert.tier].color}20`, color: tierConfig[cert.tier].color }}>
                        <Shield className="w-3 h-3" />
                        {tierConfig[cert.tier].badgeEmoji} {tierConfig[cert.tier].label}
                      </span>
                    )}
                    {cert.certificateId && (
                      <span className="flex items-center gap-1.5 text-xs text-cognition-grey02">
                        <QrCode className="w-3 h-3" />
                        ID: {cert.certificateId.slice(0, 12)}...
                      </span>
                    )}
                    <Link
                      to={`/certificate/${cert.certificateId}`}
                      className="text-xs text-cognition-accent01 hover:underline ml-auto"
                    >
                      View Public Page
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In Progress */}
      {inProgressTracks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01">In Progress</h2>
          {inProgressTracks.map(({ track, progress }) => (
            <Link
              key={track.id}
              to={`/track/${track.id}`}
              className="block p-4 bg-cognition-dark02 rounded-xl border border-cognition-dark03 hover:border-cognition-dark03/80 hover:bg-cognition-dark03/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${trackBgColors[track.level]}`}>
                  {trackIcons[track.level]}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-cognition-light01">{track.title}</h3>
                  <p className="text-xs text-cognition-grey02">
                    {progress.completed} of {progress.total} lessons &middot; {progress.percentage}% complete
                  </p>
                </div>
                <div className="w-24 h-2 bg-cognition-dark03 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress.percentage}%`,
                      background: 'linear-gradient(to right, #7485CA, #85C4C0)',
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Not Started */}
      {notStartedTracks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-light tracking-wide text-cognition-light01">Not Started</h2>
          {notStartedTracks.map(({ track }) => (
            <Link
              key={track.id}
              to={`/track/${track.id}`}
              className="block p-4 bg-cognition-dark02 rounded-xl border border-cognition-dark03 hover:border-cognition-dark03/80 hover:bg-cognition-dark03/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${trackBgColors[track.level]}`}>
                  {trackIcons[track.level]}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-cognition-light01">{track.title}</h3>
                  <p className="text-xs text-cognition-grey02">{track.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {earnedCertificates.length === 0 && (
        <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cognition-dark03 flex items-center justify-center">
            <Award className="w-8 h-8 text-cognition-grey02" />
          </div>
          <h3 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-2">No Certificates Yet</h3>
          <p className="text-cognition-grey02 text-sm mb-6 max-w-md mx-auto">
            Complete all lessons in a track to earn your certificate of completion. Start with the Beginner Track!
          </p>
          <Link
            to="/track/beginner"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-cognition-dark01 font-medium text-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
          >
            Start Learning
          </Link>
        </div>
      )}
    </div>
  );
}
