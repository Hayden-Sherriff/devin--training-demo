const TRAINING_URL = 'https://devin-training-website-c0fmycjp.devinapps.com';

export interface LinkedInShareParams {
  trackTitle: string;
  trackLevel: string;
  recipientName: string;
  certificateImageUrl?: string;
}

export function generateLinkedInShareUrl(params: LinkedInShareParams): string {
  const { trackTitle, trackLevel, recipientName } = params;

  const levelEmoji = trackLevel === 'beginner' ? '🎯' : trackLevel === 'intermediate' ? '🚀' : '🏆';

  const shareText = `${levelEmoji} I just completed the "${trackTitle}" certification at Devin Academy!

I'm excited to share that ${recipientName} has successfully passed the ${trackTitle} track, covering ${
    trackLevel === 'beginner'
      ? 'the fundamentals of AI-powered software engineering with Devin'
      : trackLevel === 'intermediate'
        ? 'multi-step tasks, debugging, and iteration techniques with Devin'
        : 'complex project orchestration and advanced best practices with Devin'
  }.

AI-assisted development is the future, and Devin by Cognition AI is leading the way. If you want to level up your skills, I highly recommend this free training:

${TRAINING_URL}

It's an amazing course — give it a try! 🤖

#DevinAI #CognitionAI #AIEngineering #SoftwareEngineering #Certification #LevelUp`;

  // LinkedIn share URL using the share API
  const linkedinUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
  linkedinUrl.searchParams.set('url', TRAINING_URL);

  // For the text content, we use the feed post creation URL which allows pre-populated text
  const feedUrl = new URL('https://www.linkedin.com/feed/');
  feedUrl.searchParams.set('shareActive', 'true');
  feedUrl.searchParams.set('text', shareText);

  return feedUrl.toString();
}

export function generateLinkedInShareText(params: LinkedInShareParams): string {
  const { trackTitle, trackLevel, recipientName } = params;
  const levelEmoji = trackLevel === 'beginner' ? '🎯' : trackLevel === 'intermediate' ? '🚀' : '🏆';

  return `${levelEmoji} I just completed the "${trackTitle}" certification at Devin Academy!

I'm excited to share that ${recipientName} has successfully passed the ${trackTitle} track, covering ${
    trackLevel === 'beginner'
      ? 'the fundamentals of AI-powered software engineering with Devin'
      : trackLevel === 'intermediate'
        ? 'multi-step tasks, debugging, and iteration techniques with Devin'
        : 'complex project orchestration and advanced best practices with Devin'
  }.

AI-assisted development is the future, and Devin by Cognition AI is leading the way. If you want to level up your skills, I highly recommend this free training:

${TRAINING_URL}

It's an amazing course — give it a try! 🤖

#DevinAI #CognitionAI #AIEngineering #SoftwareEngineering #Certification #LevelUp`;
}
