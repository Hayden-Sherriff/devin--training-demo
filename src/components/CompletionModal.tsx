import { useState, useRef, useCallback } from 'react';
import { X, Download, Mail, Linkedin, Award, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { Certificate } from './Certificate';
import { toPng } from 'html-to-image';
import { sendCertificateEmail, isEmailJSConfigured } from '../lib/emailService';
import { generateLinkedInShareUrl } from '../lib/linkedinShare';
import { useCertificates } from '../hooks/useCertificates';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
  trackLevel: 'beginner' | 'intermediate' | 'advanced';
  lessonCount: number;
  exerciseCount: number;
}

export function CompletionModal({
  isOpen,
  onClose,
  trackId,
  trackTitle,
  trackLevel,
  lessonCount,
  exerciseCount,
}: CompletionModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { addCertificate, markEmailSent, markLinkedInShared, getCertificateForTrack } = useCertificates();

  const existingCert = getCertificateForTrack(trackId);

  const [name, setName] = useState(existingCert?.recipientName || '');
  const [email, setEmail] = useState(existingCert?.recipientEmail || '');
  const [step, setStep] = useState<'form' | 'certificate'>(existingCert ? 'certificate' : 'form');
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [downloading, setDownloading] = useState(false);

  const completionDate = existingCert?.completionDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addCertificate({
      trackId,
      trackTitle,
      trackLevel,
      recipientName: name.trim(),
      recipientEmail: email.trim(),
      completionDate,
      lessonCount,
      exerciseCount,
      emailSent: false,
      linkedinShared: false,
    });

    setStep('certificate');
  }, [name, email, trackId, trackTitle, trackLevel, completionDate, lessonCount, exerciseCount, addCertificate]);

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `devin-academy-${trackLevel}-certificate.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download certificate:', err);
    } finally {
      setDownloading(false);
    }
  }, [trackLevel]);

  const handleSendEmail = useCallback(async () => {
    if (!isEmailJSConfigured()) {
      setEmailStatus('error');
      return;
    }
    setSending(true);
    try {
      const linkedinUrl = generateLinkedInShareUrl({
        trackTitle,
        trackLevel,
        recipientName: name,
      });

      const success = await sendCertificateEmail({
        toEmail: email,
        toName: name,
        trackTitle,
        trackLevel,
        completionDate,
        linkedinShareUrl: linkedinUrl,
        trainingUrl: 'https://devin-training-website-c0fmycjp.devinapps.com',
      });

      if (success) {
        setEmailStatus('sent');
        markEmailSent(trackId);
      } else {
        setEmailStatus('error');
      }
    } catch {
      setEmailStatus('error');
    } finally {
      setSending(false);
    }
  }, [email, name, trackTitle, trackLevel, completionDate, trackId, markEmailSent]);

  const handleLinkedInShare = useCallback(() => {
    const url = generateLinkedInShareUrl({
      trackTitle,
      trackLevel,
      recipientName: name,
    });
    markLinkedInShared(trackId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [trackTitle, trackLevel, name, trackId, markLinkedInShared]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-cognition-dark02 border border-cognition-dark03 rounded-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-cognition-dark03 transition-colors text-cognition-grey02 hover:text-cognition-light01"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          /* Step 1: Collect Name & Email */
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9EAEE9, #A2D1CE)' }}>
              <Award className="w-8 h-8 text-cognition-dark01" />
            </div>

            <h2
              className="text-2xl mb-2"
              style={{
                fontFamily: '"IBM Plex Sans Condensed", sans-serif',
                fontWeight: 300,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
                background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Congratulations!
            </h2>

            <p className="text-cognition-grey01 mb-1">
              You&apos;ve completed the <span className="text-cognition-accent01 font-medium">{trackTitle}</span>!
            </p>
            <p className="text-cognition-grey02 text-sm mb-8">
              Enter your details to receive your certificate of completion.
            </p>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
              <div className="text-left">
                <label className="block text-xs text-cognition-grey02 uppercase tracking-wider mb-1.5 font-mono">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 bg-cognition-dark01 border border-cognition-dark03 rounded-lg text-cognition-light01 placeholder:text-cognition-grey02/50 focus:outline-none focus:border-cognition-accent01 transition-colors"
                />
              </div>
              <div className="text-left">
                <label className="block text-xs text-cognition-grey02 uppercase tracking-wider mb-1.5 font-mono">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 bg-cognition-dark01 border border-cognition-dark03 rounded-lg text-cognition-light01 placeholder:text-cognition-grey02/50 focus:outline-none focus:border-cognition-accent01 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim() || !email.trim()}
                className="w-full py-3 rounded-lg font-medium text-cognition-dark01 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
              >
                Generate My Certificate
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Certificate Preview & Actions */
          <div className="p-8">
            <div className="text-center mb-6">
              <h2
                className="text-xl mb-1"
                style={{
                  fontFamily: '"IBM Plex Sans Condensed", sans-serif',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase' as const,
                  color: '#F2F5FA',
                }}
              >
                Your Certificate
              </h2>
              <p className="text-cognition-grey02 text-sm">Download your certificate and share your achievement!</p>
            </div>

            {/* Certificate Preview */}
            <div className="flex justify-center mb-6 overflow-x-auto">
              <div className="transform scale-[0.85] origin-top">
                <Certificate
                  ref={certificateRef}
                  recipientName={name || existingCert?.recipientName || ''}
                  trackTitle={trackTitle}
                  trackLevel={trackLevel}
                  completionDate={completionDate}
                  lessonCount={lessonCount}
                  exerciseCount={exerciseCount}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              {/* Download */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50 transition-colors disabled:opacity-50"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">Download</span>
              </button>

              {/* Send Email */}
              <button
                onClick={handleSendEmail}
                disabled={sending || emailStatus === 'sent'}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium ${
                  emailStatus === 'sent'
                    ? 'bg-cognition-accent02/20 text-cognition-accent02 border border-cognition-accent02/30'
                    : emailStatus === 'error'
                      ? 'bg-cognition-error/10 text-cognition-error border border-cognition-error/30 hover:bg-cognition-error/20'
                      : 'border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50'
                }`}
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : emailStatus === 'sent' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>
                  {emailStatus === 'sent' ? 'Email Sent!' : emailStatus === 'error' ? 'Email Not Configured' : 'Email Certificate'}
                </span>
              </button>

              {/* LinkedIn Share */}
              <button
                onClick={handleLinkedInShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-cognition-dark01 font-medium text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
              >
                <Linkedin className="w-4 h-4" />
                <span>Share on LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {emailStatus === 'error' && (
              <p className="text-center text-xs text-cognition-grey02 mt-3">
                EmailJS is not configured. You can still download your certificate and share on LinkedIn.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
