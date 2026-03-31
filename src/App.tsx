import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TrackPage } from './pages/TrackPage';
import { LessonPage } from './pages/LessonPage';
import { Playground } from './pages/Playground';
import { ProgressPage } from './pages/ProgressPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { CertificateViewPage } from './pages/CertificateViewPage';
import { CompletionStatsPage } from './pages/CompletionStatsPage';
import { CommunityGalleryPage } from './pages/CommunityGalleryPage';
import { captureReferral } from './lib/referral';
import { recordActivity } from './lib/streaks';

function App() {
  // Capture referral on first load
  useEffect(() => {
    captureReferral();
    recordActivity();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/track/:trackId" element={<TrackPage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/certificate/:certId" element={<CertificateViewPage />} />
          <Route path="/stats" element={<CompletionStatsPage />} />
          <Route path="/gallery" element={<CommunityGalleryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
