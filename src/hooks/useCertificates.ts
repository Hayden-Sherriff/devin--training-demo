import { useState, useEffect, useCallback } from 'react';
import { generateCertificateId, getCertificateExpiration, getCertificateTier } from '../lib/certificateId';

const STORAGE_KEY = 'devin-training-certificates';

export interface CertificateData {
  id: string;
  certificateId: string;
  trackId: string;
  trackTitle: string;
  trackLevel: 'beginner' | 'intermediate' | 'advanced';
  recipientName: string;
  recipientEmail: string;
  completionDate: string;
  lessonCount: number;
  exerciseCount: number;
  emailSent: boolean;
  linkedinShared: boolean;
  twitterShared: boolean;
  promptQualityScore: number;
  tier: 'bronze' | 'silver' | 'gold';
  expirationDate: string;
  profilePhotoUrl: string;
  referralCode: string;
}

function loadCertificates(): CertificateData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveCertificates(certs: CertificateData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  } catch {
    // ignore storage errors
  }
}

export function useCertificates() {
  const [certificates, setCertificates] = useState<CertificateData[]>(loadCertificates);

  useEffect(() => {
    saveCertificates(certificates);
  }, [certificates]);

  const addCertificate = useCallback((cert: Omit<CertificateData, 'id' | 'certificateId' | 'tier' | 'expirationDate' | 'twitterShared'>) => {
    const certificateId = generateCertificateId();
    const tier = getCertificateTier(cert.trackLevel, cert.promptQualityScore);
    const expirationDate = getCertificateExpiration(cert.completionDate);
    const newCert: CertificateData = {
      ...cert,
      id: `cert-${cert.trackId}-${Date.now()}`,
      certificateId,
      tier,
      expirationDate,
      twitterShared: false,
    };
    setCertificates(prev => {
      const filtered = prev.filter(c => c.trackId !== cert.trackId);
      return [...filtered, newCert];
    });
    return newCert;
  }, []);

  const getCertificateForTrack = useCallback((trackId: string): CertificateData | undefined => {
    return certificates.find(c => c.trackId === trackId);
  }, [certificates]);

  const getCertificateById = useCallback((certId: string): CertificateData | undefined => {
    return certificates.find(c => c.certificateId === certId);
  }, [certificates]);

  const markEmailSent = useCallback((trackId: string) => {
    setCertificates(prev =>
      prev.map(c => c.trackId === trackId ? { ...c, emailSent: true } : c)
    );
  }, []);

  const markLinkedInShared = useCallback((trackId: string) => {
    setCertificates(prev =>
      prev.map(c => c.trackId === trackId ? { ...c, linkedinShared: true } : c)
    );
  }, []);

  const markTwitterShared = useCallback((trackId: string) => {
    setCertificates(prev =>
      prev.map(c => c.trackId === trackId ? { ...c, twitterShared: true } : c)
    );
  }, []);

  const hasCertificate = useCallback((trackId: string): boolean => {
    return certificates.some(c => c.trackId === trackId);
  }, [certificates]);

  const updateProfilePhoto = useCallback((trackId: string, photoUrl: string) => {
    setCertificates(prev =>
      prev.map(c => c.trackId === trackId ? { ...c, profilePhotoUrl: photoUrl } : c)
    );
  }, []);

  return {
    certificates,
    addCertificate,
    getCertificateForTrack,
    getCertificateById,
    markEmailSent,
    markLinkedInShared,
    markTwitterShared,
    hasCertificate,
    updateProfilePhoto,
  };
}
