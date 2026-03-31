import { forwardRef } from 'react';

interface CertificateProps {
  recipientName: string;
  trackTitle: string;
  trackLevel: 'beginner' | 'intermediate' | 'advanced';
  completionDate: string;
  lessonCount: number;
  exerciseCount: number;
}

const trackDescriptions: Record<string, string> = {
  beginner: 'Fundamentals of AI-Powered Software Engineering',
  intermediate: 'Multi-Step Tasks, Debugging & Iteration Techniques',
  advanced: 'Complex Project Orchestration & Best Practices',
};

export const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ recipientName, trackTitle, trackLevel, completionDate, lessonCount, exerciseCount }, ref) => {
    return (
      <div
        ref={ref}
        className="relative w-[800px] h-[566px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f131c 0%, #1F283B 50%, #0f131c 100%)',
          fontFamily: '"IBM Plex Sans", sans-serif',
        }}
      >
        {/* Border frame */}
        <div className="absolute inset-3 border border-[#364363] rounded-lg" />
        <div className="absolute inset-5 border border-[#364363]/50 rounded-lg" />

        {/* Corner accents */}
        <svg className="absolute top-6 left-6 w-12 h-12 text-[#9EAEE9]/30" viewBox="0 0 48 48">
          <path d="M0 24 L0 0 L24 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <svg className="absolute top-6 right-6 w-12 h-12 text-[#9EAEE9]/30" viewBox="0 0 48 48">
          <path d="M24 0 L48 0 L48 24" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <svg className="absolute bottom-6 left-6 w-12 h-12 text-[#A2D1CE]/30" viewBox="0 0 48 48">
          <path d="M0 24 L0 48 L24 48" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <svg className="absolute bottom-6 right-6 w-12 h-12 text-[#A2D1CE]/30" viewBox="0 0 48 48">
          <path d="M24 48 L48 48 L48 24" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        {/* Background gradient orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#9EAEE9]/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A2D1CE]/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 text-center">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9EAEE9, #A2D1CE)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f131c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: '"IBM Plex Sans Condensed", sans-serif',
                fontWeight: 300,
                fontSize: '14px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#7B8397',
              }}
            >
              Devin Academy
            </span>
          </div>

          {/* Certificate Title */}
          <h1
            style={{
              fontFamily: '"IBM Plex Sans Condensed", sans-serif',
              fontWeight: 300,
              fontSize: '32px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'linear-gradient(to right, #7485CA 0%, #81B7D4 46%, #85C4C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
            }}
          >
            Certificate of Completion
          </h1>

          {/* Divider */}
          <div className="w-48 h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, #364363, transparent)' }} />

          {/* Presented to */}
          <p style={{ color: '#7B8397', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: '"IBM Plex Sans Condensed", sans-serif', marginBottom: '8px' }}>
            This is to certify that
          </p>

          {/* Recipient Name */}
          <h2
            style={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontWeight: 500,
              fontSize: '36px',
              color: '#F2F5FA',
              marginBottom: '8px',
            }}
          >
            {recipientName}
          </h2>

          {/* Divider */}
          <div className="w-32 h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, #364363, transparent)' }} />

          {/* Description */}
          <p style={{ color: '#CDD3E1', fontSize: '15px', lineHeight: '1.6', maxWidth: '500px', marginBottom: '4px' }}>
            has successfully completed the
          </p>
          <p
            style={{
              fontFamily: '"IBM Plex Sans Condensed", sans-serif',
              fontWeight: 400,
              fontSize: '22px',
              letterSpacing: '0.03em',
              color: trackLevel === 'beginner' ? '#A2D1CE' : trackLevel === 'intermediate' ? '#9EAEE9' : '#c084fc',
              marginBottom: '4px',
            }}
          >
            {trackTitle}
          </p>
          <p style={{ color: '#7B8397', fontSize: '13px', marginBottom: '16px' }}>
            {trackDescriptions[trackLevel]}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span style={{ color: '#364363', fontSize: '12px' }}>[ </span>
              <span style={{ color: '#9EAEE9', fontSize: '13px', fontFamily: '"IBM Plex Mono", monospace' }}>{lessonCount}</span>
              <span style={{ color: '#7B8397', fontSize: '12px' }}>lessons</span>
              <span style={{ color: '#364363', fontSize: '12px' }}> ]</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#364363', fontSize: '12px' }}>[ </span>
              <span style={{ color: '#A2D1CE', fontSize: '13px', fontFamily: '"IBM Plex Mono", monospace' }}>{exerciseCount}</span>
              <span style={{ color: '#7B8397', fontSize: '12px' }}>exercises</span>
              <span style={{ color: '#364363', fontSize: '12px' }}> ]</span>
            </div>
          </div>

          {/* Date */}
          <p style={{ color: '#7B8397', fontSize: '12px', fontFamily: '"IBM Plex Mono", monospace' }}>
            {completionDate}
          </p>

          {/* Footer brand */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <p style={{ color: '#364363', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"IBM Plex Sans Condensed", sans-serif' }}>
              Powered by Cognition AI
            </p>
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';
