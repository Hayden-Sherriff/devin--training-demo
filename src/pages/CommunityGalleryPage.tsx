import { useState } from 'react';
import { Users, ThumbsUp, Copy, CheckCircle2, Lightbulb, Zap, Rocket } from 'lucide-react';
import { copyToClipboard } from '../lib/sharing';

interface GalleryPrompt {
  id: string;
  author: string;
  trackLevel: 'beginner' | 'intermediate' | 'advanced';
  task: string;
  prompt: string;
  score: number;
  likes: number;
  tags: string[];
}

const samplePrompts: GalleryPrompt[] = [
  {
    id: '1',
    author: 'Sarah K.',
    trackLevel: 'beginner',
    task: 'Add a dark mode toggle',
    prompt: 'Add a dark mode toggle to the settings page. Create a new component at src/components/ThemeToggle.tsx that uses a context provider at src/contexts/ThemeContext.tsx. The toggle should persist the user\'s preference to localStorage under the key "theme-preference". Use the existing Button component pattern from src/components/Button.tsx. Add a sun/moon icon that transitions smoothly. Test by verifying the toggle switches between themes and persists across page refreshes.',
    score: 92,
    likes: 47,
    tags: ['React', 'localStorage', 'Context API'],
  },
  {
    id: '2',
    author: 'Alex M.',
    trackLevel: 'intermediate',
    task: 'Debug API timeout issue',
    prompt: 'The /api/users endpoint in src/routes/users.ts is timing out after 30 seconds when fetching large datasets. 1) Add pagination with limit/offset query params, defaulting to limit=50. 2) Add a database index on the users.created_at column since we sort by it. 3) Add response caching with a 5-minute TTL using the existing Redis client at src/lib/redis.ts. 4) Add request timeout middleware that returns 408 after 10s. Follow the existing pagination pattern used in src/routes/posts.ts. Verify with a test that fetches 1000+ records.',
    score: 95,
    likes: 63,
    tags: ['API', 'Performance', 'Pagination'],
  },
  {
    id: '3',
    author: 'Jordan P.',
    trackLevel: 'advanced',
    task: 'Set up CI/CD pipeline',
    prompt: 'Create a GitHub Actions CI/CD pipeline at .github/workflows/deploy.yml. Requirements: 1) Run on push to main and PRs. 2) Steps: install deps (npm ci), lint (npm run lint), type-check (npm run typecheck), unit tests (npm test), build (npm run build). 3) For main branch only: deploy to Vercel using the vercel CLI with VERCEL_TOKEN secret. 4) Add a preview deployment step for PRs that posts the preview URL as a PR comment. 5) Cache node_modules using actions/cache with package-lock.json hash. 6) Fail fast if any step errors. Follow the existing workflow pattern in .github/workflows/test.yml.',
    score: 98,
    likes: 89,
    tags: ['CI/CD', 'GitHub Actions', 'Deployment'],
  },
  {
    id: '4',
    author: 'Morgan L.',
    trackLevel: 'beginner',
    task: 'Create a contact form',
    prompt: 'Build a contact form component at src/components/ContactForm.tsx with fields: name (required), email (required, validate format), message (required, min 10 chars). Use react-hook-form for validation following the pattern in src/components/SignupForm.tsx. On submit, POST to /api/contact. Show success/error toast notifications using the existing toast utility at src/lib/toast.ts. Add loading state to the submit button. Ensure the form is accessible with proper aria labels and keyboard navigation.',
    score: 88,
    likes: 35,
    tags: ['Forms', 'Validation', 'Accessibility'],
  },
  {
    id: '5',
    author: 'Taylor R.',
    trackLevel: 'intermediate',
    task: 'Implement real-time notifications',
    prompt: 'Add real-time notifications using WebSocket. 1) Create a WebSocket hook at src/hooks/useNotifications.ts that connects to ws://localhost:3001/notifications. 2) Create NotificationBell component at src/components/NotificationBell.tsx showing unread count badge. 3) Create NotificationPanel dropdown listing recent notifications with mark-as-read functionality. 4) Store notifications in a context provider. 5) Handle reconnection with exponential backoff (1s, 2s, 4s, max 30s). 6) Follow the existing WebSocket pattern in src/hooks/useChat.ts. Test by sending a test notification and verifying it appears in real-time.',
    score: 91,
    likes: 52,
    tags: ['WebSocket', 'Real-time', 'Hooks'],
  },
  {
    id: '6',
    author: 'Casey W.',
    trackLevel: 'advanced',
    task: 'Database migration system',
    prompt: 'Create a database migration system for our PostgreSQL database. 1) Create a migrations directory at db/migrations/ with numbered SQL files (001_create_users.sql, etc.). 2) Create a migration runner at scripts/migrate.ts that reads the migrations directory, checks a migrations_log table for already-run migrations, and executes pending ones in order within a transaction. 3) Add rollback support with corresponding down migrations. 4) Add CLI commands: migrate:up, migrate:down, migrate:status. 5) Handle edge cases: empty migrations, duplicate numbers, failed partial migrations. 6) Add a seed script at scripts/seed.ts for development data. Follow existing DB patterns in src/lib/db.ts.',
    score: 96,
    likes: 71,
    tags: ['Database', 'Migrations', 'PostgreSQL'],
  },
];

const levelIcons: Record<string, React.ReactNode> = {
  beginner: <Lightbulb className="w-3.5 h-3.5" />,
  intermediate: <Zap className="w-3.5 h-3.5" />,
  advanced: <Rocket className="w-3.5 h-3.5" />,
};

const levelColors: Record<string, string> = {
  beginner: 'bg-cognition-accent02/20 text-cognition-accent02',
  intermediate: 'bg-cognition-accent01/20 text-cognition-accent01',
  advanced: 'bg-purple-500/20 text-purple-400',
};

export function CommunityGalleryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const filteredPrompts = filter === 'all'
    ? samplePrompts
    : samplePrompts.filter(p => p.trackLevel === filter);

  const handleCopy = async (prompt: GalleryPrompt) => {
    await copyToClipboard(prompt.prompt);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cognition-accent01 to-cognition-accent02 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-cognition-dark01" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-light tracking-wide text-cognition-light01">Community Prompt Gallery</h1>
          <p className="text-sm text-cognition-grey02">Learn from high-scoring prompts written by other learners</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'All Levels' },
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-cognition-accent01/20 text-cognition-accent01 border border-cognition-accent01/30'
                : 'bg-cognition-dark02 text-cognition-grey02 border border-cognition-dark03 hover:bg-cognition-dark03/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Prompts */}
      <div className="space-y-4">
        {filteredPrompts.map(prompt => (
          <div key={prompt.id} className="bg-cognition-dark02 rounded-xl border border-cognition-dark03 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-cognition-dark03 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cognition-dark03 flex items-center justify-center text-sm font-bold text-cognition-grey01">
                  {prompt.author[0]}
                </div>
                <div>
                  <span className="text-sm font-medium text-cognition-light01">{prompt.author}</span>
                  <span className="text-xs text-cognition-grey02 ml-2">&middot; {prompt.task}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${levelColors[prompt.trackLevel]}`}>
                  {levelIcons[prompt.trackLevel]}
                  {prompt.trackLevel}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  prompt.score >= 90 ? 'bg-cognition-accent02/20 text-cognition-accent02' :
                  prompt.score >= 70 ? 'bg-cognition-accent01/20 text-cognition-accent01' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {prompt.score}%
                </span>
              </div>
            </div>

            {/* Prompt Content */}
            <div className="p-4">
              <pre className="text-sm text-cognition-grey01 whitespace-pre-wrap font-mono bg-cognition-dark01 rounded-lg p-4 border border-cognition-dark03">
                {prompt.prompt}
              </pre>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {prompt.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cognition-dark03 text-cognition-grey02">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(prompt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    likedIds.has(prompt.id)
                      ? 'bg-cognition-accent02/20 text-cognition-accent02'
                      : 'bg-cognition-dark03 text-cognition-grey02 hover:text-cognition-light01'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {prompt.likes + (likedIds.has(prompt.id) ? 1 : 0)}
                </button>
                <button
                  onClick={() => handleCopy(prompt)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    copiedId === prompt.id
                      ? 'bg-cognition-accent02/20 text-cognition-accent02'
                      : 'bg-cognition-dark03 text-cognition-grey02 hover:text-cognition-light01'
                  }`}
                >
                  {copiedId === prompt.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === prompt.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit CTA */}
      <div className="bg-cognition-dark02 rounded-xl border border-cognition-accent01/30 p-6 text-center">
        <h3 className="text-lg font-heading font-light tracking-wide text-cognition-light01 mb-2">
          Share Your Best Prompts
        </h3>
        <p className="text-sm text-cognition-grey02 mb-1">
          Earn a high score in any exercise and your prompt could appear here! Complete exercises in the training tracks to submit your best work.
        </p>
      </div>
    </div>
  );
}
