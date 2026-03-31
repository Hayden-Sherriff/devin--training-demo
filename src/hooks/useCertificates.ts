import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'devin-training-certificates';

export interface CertificateData {
  id: string;
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

  const addCertificate = useCallback((cert: Omit<CertificateData, 'id'>) => {
    const newCert: CertificateData = {
      ...cert,
      id: `cert-${cert.trackId}-${Date.now()}`,
    };
    setCertificates(prev => {
      // Replace existing certificate for the same track
      const filtered = prev.filter(c => c.trackId !== cert.trackId);
      return [...filtered, newCert];
    });
    return newCert;
  }, []);

  const getCertificateForTrack = useCallback((trackId: string): CertificateData | undefined => {
    return certificates.find(c => c.trackId === trackId);
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

  const hasCertificate = useCallback((trackId: string): boolean => {
    return certificates.some(c => c.trackId === trackId);
  }, [certificates]);

  return {
    certificates,
    addCertificate,
    getCertificateForTrack,
    markEmailSent,
    markLinkedInShared,
    hasCertificate,
  };
}
