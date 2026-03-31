const REFERRAL_KEY = 'devin-training-referral';
const REFERRALS_KEY = 'devin-training-referrals-received';

export interface ReferralData {
  myReferralCode: string;
  referredBy: string | null;
  referralCount: number;
  referredUsers: string[];
}

export function generateReferralCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getReferralData(): ReferralData {
  const stored = localStorage.getItem(REFERRAL_KEY);
  if (stored) return JSON.parse(stored);

  const data: ReferralData = {
    myReferralCode: generateReferralCode(),
    referredBy: null,
    referralCount: 0,
    referredUsers: [],
  };

  // Check URL for ?ref= parameter
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref) {
    data.referredBy = ref;
    // Track that this referral was received
    trackReferralReceived(ref);
  }

  localStorage.setItem(REFERRAL_KEY, JSON.stringify(data));
  return data;
}

function trackReferralReceived(referrerCode: string) {
  const received = JSON.parse(localStorage.getItem(REFERRALS_KEY) || '{}');
  if (!received[referrerCode]) {
    received[referrerCode] = 0;
  }
  received[referrerCode] += 1;
  localStorage.setItem(REFERRALS_KEY, JSON.stringify(received));
}

export function getReferralUrl(code: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}?ref=${code}`;
}

export function getReferralShareText(code: string, name?: string): string {
  const url = getReferralUrl(code);
  const greeting = name ? `${name} thinks` : 'Someone thinks';
  return `${greeting} you'd enjoy learning about Devin AI! Try this free training: ${url}`;
}

export function captureReferral(): void {
  // Just calling getReferralData will check URL params and store referral info
  getReferralData();
}
