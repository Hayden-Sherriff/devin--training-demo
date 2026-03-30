import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TrackPage } from './pages/TrackPage';
import { LessonPage } from './pages/LessonPage';
import { Playground } from './pages/Playground';
import { ProgressPage } from './pages/ProgressPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/track/:trackId" element={<TrackPage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
