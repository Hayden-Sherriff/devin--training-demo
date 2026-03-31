import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Download, Mail, Linkedin, Award, Loader2, CheckCircle2, ExternalLink, Twitter, Copy, Users, Camera } from 'lucide-react';
import { Certificate } from './Certificate';
import { toPng } from 'html-to-image';
import { sendCertificateEmail, isEmailJSConfigured } from '../lib/emailService';
import { generateLinkedInShareUrl } from '../lib/linkedinShare';
import { useCertificates } from '../hooks/useCertificates';
import { fireCelebrationConfetti } from '../lib/confetti';
import { playCompletionSound } from '../lib/audio';
import { generateTwitterShareUrl, generateCopyLinkText, generateChallengeUrl, copyToClipboard } from '../lib/sharing';
import { generateQRCodeDataUrl } from '../lib/qrcode';
import { getReferralData } from '../lib/referral';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
  trackLevel: 'beginner' | 'intermediate' | 'advanced';
  lessonCount: number;
  exerciseCount: number;
  averagePromptScore?: number;
}

export function CompletionModal({
  isOpen,
  onClose,
  trackId,
  trackTitle,
  trackLevel,
  lessonCount,
  exerciseCount,
  averagePromptScore,
}: CompletionModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { addCertificate, markEmailSent, markLinkedInShared, markTwitterShared, getCertificateForTrack, updateProfilePhoto } = useCertificates();

  const existingCert = getCertificateForTrack(trackId);

  const [name, setName] = useState(existingCert?.recipientName || '');
  const [email, setEmail] = useState(existingCert?.recipientEmail || '');
  const [step, setStep] = useState<'form' | 'certificate'>(existingCert ? 'certificate' : 'form');
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(existingCert?.profilePhotoUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasPlayedEffects = useRef(false);

  const referralData = getReferralData();

  const completionDate = existingCert?.completionDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate QR code for certificate verification
  useEffect(() => {
    if (existingCert?.certificateId) {
      const certUrl = `${window.location.origin}/certificate/${existingCert.certificateId}`;
      generateQRCodeDataUrl(certUrl).then(setQrCodeUrl);
    }
  }, [existingCert?.certificateId]);

  // Confetti + audio on first reveal
  useEffect(() => {
    if (step === 'certificate' && !hasPlayedEffects.current) {
      hasPlayedEffects.current = true;
      setShowReveal(true);
      setTimeout(() => {
        fireCelebrationConfetti();
        playCompletionSound();
      }, 300);
    }
  }, [step]);

  const handleProfilePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setProfilePhoto(dataUrl);
      if (existingCert) {
        updateProfilePhoto(trackId, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  }, [existingCert, trackId, updateProfilePhoto]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const cert = addCertificate({
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
      promptQualityScore: averagePromptScore || 0,
      profilePhotoUrl: profilePhoto,
      referralCode: referralData.myReferralCode,
    });

    // Generate QR for new cert
    const certUrl = `${window.location.origin}/certificate/${cert.certificateId}`;
    generateQRCodeDataUrl(certUrl).then(setQrCodeUrl);

    setStep('certificate');
  }, [name, email, trackId, trackTitle, trackLevel, completionDate, lessonCount, exerciseCount, addCertificate, averagePromptScore, profilePhoto, referralData.myReferralCode]);

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
      recipientName: name || existingCert?.recipientName || '',
    });
    markLinkedInShared(trackId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [trackTitle, trackLevel, name, trackId, markLinkedInShared, existingCert]);

  const handleTwitterShare = useCallback(() => {
    const url = generateTwitterShareUrl({
      trackTitle,
      trackLevel,
      recipientName: name || existingCert?.recipientName || '',
      certificateId: existingCert?.certificateId,
      tier: existingCert?.tier,
    });
    markTwitterShared(trackId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [trackTitle, trackLevel, name, trackId, markTwitterShared, existingCert]);

  const handleCopyLink = useCallback(async () => {
    const text = generateCopyLinkText({
      trackTitle,
      trackLevel,
      recipientName: name || existingCert?.recipientName || '',
      certificateId: existingCert?.certificateId,
      referralCode: referralData.myReferralCode,
    });
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [trackTitle, trackLevel, name, existingCert, referralData.myReferralCode]);

  const handleChallengeFriend = useCallback(() => {
    const url = generateChallengeUrl({
      trackTitle,
      trackLevel,
      recipientName: name || existingCert?.recipientName || '',
      referralCode: referralData.myReferralCode,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [trackTitle, trackLevel, name, existingCert, referralData.myReferralCode]);

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
              {/* Profile Photo Upload */}
              <div className="flex justify-center mb-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-full border-2 border-dashed border-cognition-dark03 hover:border-cognition-accent01 transition-colors flex items-center justify-center overflow-hidden group"
                >
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-cognition-grey02 group-hover:text-cognition-accent01" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-cognition-grey02">Add a photo (optional)</p>

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
          <div className={`p-8 transition-all duration-700 ${showReveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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
              {existingCert?.tier && (
                <p className="text-sm mb-1" style={{ color: existingCert.tier === 'gold' ? '#FFD700' : existingCert.tier === 'silver' ? '#C0C0C0' : '#CD7F32' }}>
                  {existingCert.tier === 'gold' ? '🥇' : existingCert.tier === 'silver' ? '🥈' : '🥉'} {existingCert.tier.charAt(0).toUpperCase() + existingCert.tier.slice(1)} Tier
                </p>
              )}
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
                  certificateId={existingCert?.certificateId}
                  tier={existingCert?.tier}
                  promptQualityScore={existingCert?.promptQualityScore}
                  expirationDate={existingCert?.expirationDate}
                  profilePhotoUrl={profilePhoto || existingCert?.profilePhotoUrl}
                  qrCodeDataUrl={qrCodeUrl}
                />
              </div>
            </div>

            {/* Action Buttons - Row 1: Primary */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-3">
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
                  {emailStatus === 'sent' ? 'Email Sent!' : emailStatus === 'error' ? 'Not Configured' : 'Email'}
                </span>
              </button>

              {/* LinkedIn Share */}
              <button
                onClick={handleLinkedInShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-cognition-dark01 font-medium text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Action Buttons - Row 2: Secondary */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              {/* Twitter/X Share */}
              <button
                onClick={handleTwitterShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50 transition-colors text-sm"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter / X</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-colors text-sm ${
                  copied ? 'border-cognition-accent02/50 text-cognition-accent02 bg-cognition-accent02/10' : 'border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50'
                }`}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              {/* Challenge a Friend */}
              <button
                onClick={handleChallengeFriend}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-cognition-accent01/30 text-cognition-accent01 hover:bg-cognition-accent01/10 transition-colors text-sm"
              >
                <Users className="w-4 h-4" />
                <span>Challenge a Friend</span>
              </button>
            </div>

            {/* Certificate ID */}
            {existingCert?.certificateId && (
              <p className="text-center text-xs text-cognition-grey02 mt-4 font-mono">
                Certificate ID: {existingCert.certificateId}
              </p>
            )}

            {emailStatus === 'error' && (
              <p className="text-center text-xs text-cognition-grey02 mt-3">
                EmailJS is not configured. You can still download your certificate and share on social media.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
