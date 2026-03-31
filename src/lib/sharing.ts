const TRAINING_URL = 'https://devin-training-website-c0fmycjp.devinapps.com';

export interface ShareParams {
  trackTitle: string;
  trackLevel: string;
  recipientName: string;
  certificateId?: string;
  referralCode?: string;
  tier?: string;
}

function getShareUrl(params: ShareParams): string {
  let url = TRAINING_URL;
  if (params.referralCode) {
    url += `?ref=${params.referralCode}`;
  }
  return url;
}

export function generateTwitterShareUrl(params: ShareParams): string {
  const { trackTitle, recipientName, tier } = params;
  const url = getShareUrl(params);
  const tierLabel = tier ? ` (${tier} tier)` : '';

  const text = `I just earned the "${trackTitle}"${tierLabel} certification at Devin Academy! ${recipientName} is now certified in AI-powered software engineering with @CognitionAI.\n\nTry this free training: ${url}\n\n#DevinAI #AIEngineering #Certification`;

  const twitterUrl = new URL('https://twitter.com/intent/tweet');
  twitterUrl.searchParams.set('text', text);
  return twitterUrl.toString();
}

export function generateCopyLinkText(params: ShareParams): string {
  const url = getShareUrl(params);
  const tierLabel = params.tier ? ` (${params.tier} tier)` : '';
  return `I just completed the "${params.trackTitle}"${tierLabel} certification at Devin Academy!\n\nLearn AI-powered software engineering with Devin: ${url}`;
}

export function generateChallengeUrl(params: ShareParams & { completionTimeMinutes?: number }): string {
  const url = getShareUrl(params);
  const challenge = params.completionTimeMinutes
    ? `\nI completed it in ${params.completionTimeMinutes} minutes. Can you beat my time?`
    : '\nCan you complete it too?';
  return `I challenge you to earn the "${params.trackTitle}" certification at Devin Academy!${challenge}\n\nStart here: ${url}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}
