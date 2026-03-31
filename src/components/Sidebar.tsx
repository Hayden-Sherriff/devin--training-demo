import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  GraduationCap,
  BookOpen,
  Rocket,
  Gamepad2,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Award,
} from 'lucide-react';
import { useState } from 'react';
import { tracks } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const trackIcons: Record<string, React.ReactNode> = {
  beginner: <GraduationCap className="w-4 h-4" />,
  intermediate: <BookOpen className="w-4 h-4" />,
  advanced: <Rocket className="w-4 h-4" />,
};

const trackColors: Record<string, string> = {
  beginner: 'text-cognition-accent02',
  intermediate: 'text-cognition-accent01',
  advanced: 'text-purple-400',
};

const trackBgColors: Record<string, string> = {
  beginner: 'bg-cognition-accent02/10',
  intermediate: 'bg-cognition-accent01/10',
  advanced: 'bg-purple-500/10',
};

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const { getTrackProgress } = useProgress();
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({
    beginner: true,
    intermediate: false,
    advanced: false,
  });

  const toggleTrack = (trackId: string) => {
    setExpandedTracks(prev => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: <Home className="w-4 h-4" />, label: 'Dashboard' },
    { path: '/playground', icon: <Gamepad2 className="w-4 h-4" />, label: 'Playground' },
    { path: '/progress', icon: <BarChart3 className="w-4 h-4" />, label: 'Progress' },
    { path: '/certificates', icon: <Award className="w-4 h-4" />, label: 'Certificates' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden bg-cognition-dark02 rounded-lg shadow-md p-2 hover:bg-cognition-dark03 border border-cognition-dark03"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-cognition-dark02 border-r border-cognition-dark03 z-40 transition-transform duration-300 w-72 overflow-y-auto scrollbar-thin ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-cognition-dark03">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-cognition-accent01 to-cognition-accent02 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cognition-dark01" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-cognition-light01 font-heading tracking-wide">Devin Academy</h1>
              <p className="text-xs text-cognition-grey02">Training Platform</p>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-cognition-accent01/10 text-cognition-accent01'
                    : 'text-cognition-grey02 hover:bg-cognition-dark03/50 hover:text-cognition-light01'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Track Navigation */}
          <div className="mt-6">
            <p className="px-3 text-xs font-semibold text-cognition-grey02 uppercase tracking-wider mb-2 font-heading">
              Learning Tracks
            </p>
            <div className="space-y-1">
              {tracks.map(track => {
                const trackProgress = getTrackProgress(track.id);
                return (
                  <div key={track.id}>
                    <button
                      onClick={() => toggleTrack(track.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-cognition-dark03/30 ${
                        trackColors[track.level]
                      }`}
                    >
                      <span className={`p-1 rounded ${trackBgColors[track.level]}`}>
                        {trackIcons[track.level]}
                      </span>
                      <span className="flex-1 text-left">{track.title}</span>
                      {trackProgress.percentage > 0 && (
                        <span className="text-xs opacity-70">
                          {trackProgress.percentage}%
                        </span>
                      )}
                      {expandedTracks[track.id] ? (
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>

                    {expandedTracks[track.id] && (
                      <div className="ml-4 mt-1 space-y-0.5 animate-fade-in">
                        {track.modules.map(mod => (
                          <div key={mod.id} className="space-y-0.5">
                            {mod.lessons.map(lesson => (
                              <Link
                                key={lesson.id}
                                to={`/lesson/${lesson.id}`}
                                onClick={() => window.innerWidth < 1024 && onToggle()}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors ${
                                  isActive(`/lesson/${lesson.id}`)
                                    ? 'bg-cognition-accent01/10 text-cognition-accent01 font-medium'
                                    : 'text-cognition-grey02 hover:bg-cognition-dark03/30 hover:text-cognition-grey01'
                                }`}
                              >
                                <span className="truncate">{lesson.title}</span>
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
