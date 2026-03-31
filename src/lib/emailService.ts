import emailjs from '@emailjs/browser';

// EmailJS configuration - these will be set by the site owner
// To set up: Create a free account at https://www.emailjs.com/
// 1. Create an Email Service (e.g., Gmail)
// 2. Create an Email Template with variables: {{to_email}}, {{to_name}}, {{track_title}}, {{track_level}}, {{completion_date}}, {{linkedin_share_url}}, {{training_url}}, {{certificate_image_url}}
// 3. Get your Public Key from Account > API Keys
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export interface CertificateEmailParams {
  toEmail: string;
  toName: string;
  trackTitle: string;
  trackLevel: string;
  completionDate: string;
  linkedinShareUrl: string;
  trainingUrl: string;
  certificateImageUrl?: string;
}

export function isEmailJSConfigured(): boolean {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
}

export async function sendCertificateEmail(params: CertificateEmailParams): Promise<boolean> {
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY environment variables.');
    return false;
  }

  try {
    const templateParams = {
      to_email: params.toEmail,
      to_name: params.toName,
      track_title: params.trackTitle,
      track_level: params.trackLevel,
      completion_date: params.completionDate,
      linkedin_share_url: params.linkedinShareUrl,
      training_url: params.trainingUrl,
      certificate_image_url: params.certificateImageUrl || '',
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    return true;
  } catch (error) {
    console.error('Failed to send certificate email:', error);
    return false;
  }
}
