import { useParams, Link } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Download, ArrowLeft, ExternalLink, Linkedin, Twitter, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Certificate } from '../components/Certificate';
import { useCertificates } from '../hooks/useCertificates';
import { toPng } from 'html-to-image';
import { generateLinkedInShareUrl } from '../lib/linkedinShare';
import { generateTwitterShareUrl, copyToClipboard } from '../lib/sharing';
import { generateQRCodeDataUrl } from '../lib/qrcode';
import { isCertificateExpired, getDaysUntilExpiration, tierConfig } from '../lib/certificateId';

export function CertificateViewPage() {
  const { certId } = useParams<{ certId: string }>();
  const { getCertificateById } = useCertificates();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const cert = certId ? getCertificateById(certId) : undefined;

  useEffect(() => {
    if (cert?.certificateId) {
      const url = `${window.location.origin}/certificate/${cert.certificateId}`;
      generateQRCodeDataUrl(url).then(setQrCodeUrl);
    }
  }, [cert?.certificateId]);

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(certificateRef.current, { quality: 1, pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = `devin-academy-${cert?.trackLevel || 'certificate'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download:', err);
    } finally {
      setDownloading(false);
    }
  }, [cert?.trackLevel]);

  const handleCopyLink = useCallback(async () => {
    await copyToClipboard(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  if (!cert) {
    return (
      <div className="min-h-screen bg-cognition-dark01 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-cognition-grey02 mx-auto mb-4" />
          <h1 className="text-xl font-heading font-light tracking-wide text-cognition-light01 mb-2">Certificate Not Found</h1>
          <p className="text-cognition-grey02 mb-6">This certificate may not exist or hasn&apos;t been created on this device.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-cognition-dark01 font-medium text-sm hover:opacity-90"
            style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
          >
            Start Your Training
          </Link>
        </div>
      </div>
    );
  }

  const expired = cert.expirationDate ? isCertificateExpired(cert.expirationDate) : false;
  const daysLeft = cert.expirationDate ? getDaysUntilExpiration(cert.expirationDate) : 365;
  const tierInfo = cert.tier ? tierConfig[cert.tier] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        to="/certificates"
        className="inline-flex items-center gap-2 text-sm text-cognition-grey02 hover:text-cognition-light01 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Certificates
      </Link>

      {/* Certificate Header */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-heading font-light tracking-wide text-cognition-light01 mb-1">
              {cert.recipientName}&apos;s Certificate
            </h1>
            <p className="text-sm text-cognition-grey02">
              {cert.trackTitle} &middot; Completed {cert.completionDate}
            </p>
            {tierInfo && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${tierInfo.color}20`, color: tierInfo.color }}>
                {tierInfo.badgeEmoji} {tierInfo.label} Tier
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-cognition-grey02 font-mono">
            <span>ID: {cert.certificateId}</span>
            {expired ? (
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400">Expired</span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-cognition-accent02/20 text-cognition-accent02">
                Valid ({daysLeft} days remaining)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Display */}
      <div className="flex justify-center overflow-x-auto pb-4">
        <Certificate
          ref={certificateRef}
          recipientName={cert.recipientName}
          trackTitle={cert.trackTitle}
          trackLevel={cert.trackLevel}
          completionDate={cert.completionDate}
          lessonCount={cert.lessonCount}
          exerciseCount={cert.exerciseCount}
          certificateId={cert.certificateId}
          tier={cert.tier}
          promptQualityScore={cert.promptQualityScore}
          expirationDate={cert.expirationDate}
          profilePhotoUrl={cert.profilePhotoUrl}
          qrCodeDataUrl={qrCodeUrl}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50 transition-colors disabled:opacity-50 text-sm"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
        <button
          onClick={() => {
            const url = generateLinkedInShareUrl({ trackTitle: cert.trackTitle, trackLevel: cert.trackLevel, recipientName: cert.recipientName });
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-cognition-dark01 font-medium text-sm hover:opacity-90"
          style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
          <ExternalLink className="w-3 h-3" />
        </button>
        <button
          onClick={() => {
            const url = generateTwitterShareUrl({ trackTitle: cert.trackTitle, trackLevel: cert.trackLevel, recipientName: cert.recipientName, certificateId: cert.certificateId, tier: cert.tier });
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50 transition-colors text-sm"
        >
          <Twitter className="w-4 h-4" />
          Twitter / X
        </button>
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm transition-colors ${
            copied ? 'border-cognition-accent02/50 text-cognition-accent02 bg-cognition-accent02/10' : 'border-cognition-dark03 text-cognition-light01 hover:bg-cognition-dark03/50'
          }`}
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* CTA for viewers */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-accent01/30 p-6 text-center">
        <h3 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-2">
          Want to earn your own certificate?
        </h3>
        <p className="text-sm text-cognition-grey02 mb-4">
          Start the free Devin Training Academy and master AI-powered software engineering.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-cognition-dark01 font-medium text-sm hover:opacity-90"
          style={{ background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)' }}
        >
          Start Learning Free
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
