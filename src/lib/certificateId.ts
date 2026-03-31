// Generate unique certificate IDs with format: DA-XXXX-XXXX-XXXX
export function generateCertificateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += chars[Math.floor(Math.random() * chars.length)];
    }
    return s;
  };
  return `DA-${segment()}-${segment()}-${segment()}`;
}

// Get certificate verification URL
export function getCertificateVerifyUrl(certificateId: string): string {
  return `${window.location.origin}/certificate/${encodeURIComponent(certificateId)}`;
}

// Determine tier based on track level and score
export type CertificateTier = 'bronze' | 'silver' | 'gold';

export function getCertificateTier(trackLevel: string, promptScore?: number): CertificateTier {
  const score = promptScore ?? 0;
  if (trackLevel === 'advanced' && score >= 70) return 'gold';
  if (trackLevel === 'advanced') return 'silver';
  if (trackLevel === 'intermediate' && score >= 70) return 'gold';
  if (trackLevel === 'intermediate') return 'silver';
  if (score >= 80) return 'gold';
  if (score >= 50) return 'silver';
  return 'bronze';
}

export const tierConfig: Record<CertificateTier, { label: string; color: string; gradient: string; badgeEmoji: string }> = {
  bronze: {
    label: 'Bronze',
    color: '#CD7F32',
    gradient: 'from-amber-700 via-amber-500 to-amber-700',
    badgeEmoji: '\uD83E\uDD49',
  },
  silver: {
    label: 'Silver',
    color: '#C0C0C0',
    gradient: 'from-gray-400 via-gray-200 to-gray-400',
    badgeEmoji: '\uD83E\uDD48',
  },
  gold: {
    label: 'Gold',
    color: '#FFD700',
    gradient: 'from-yellow-500 via-yellow-300 to-yellow-500',
    badgeEmoji: '\uD83E\uDD47',
  },
};

// Certificate expiration: 1 year from completion
export function getCertificateExpiration(completionDate: string): string {
  const date = new Date(completionDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}

export function isCertificateExpired(expirationDate: string): boolean {
  return new Date() > new Date(expirationDate);
}

export function getDaysUntilExpiration(expirationDate: string): number {
  const diff = new Date(expirationDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
