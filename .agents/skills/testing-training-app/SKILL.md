# Testing the Devin Training Academy

## Overview
React 18 + Vite + Tailwind CSS + TypeScript frontend app. No backend — all data in localStorage.

## Dev Server
```bash
cd /home/ubuntu/repos/devin--training-demo
npm run dev
# Runs on http://localhost:5173 (or next available port)
```

## Deployed URL
https://devin-training-website-c0fmycjp.devinapps.com

To redeploy after changes:
```bash
npm run build
# Then use deploy tool with command="frontend" dir="dist"
```

## Launching Chrome on VM
The `google-chrome` wrapper script connects to a CDP server that may not be running. Use the actual Chrome binary instead:
```bash
/opt/.devin/chrome/chrome/linux-133.0.6943.126/chrome-linux64/chrome --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-software-rasterizer --no-first-run --disable-session-crashed-bubble http://localhost:5173 &
```
Note: The Chrome version path may change. Check `/opt/.devin/chrome/chrome/` for available versions.

Maximize before recording:
```bash
wmctrl -r "Google Chrome" -b add,maximized_vert,maximized_horz
```

## Key App Routes
- `/` — Dashboard
- `/track/beginner` — Beginner track page (also `/track/intermediate`, `/track/advanced`)
- `/lesson/{lesson-id}` — Individual lesson page
- `/playground` — Prompt playground
- `/progress` — Progress tracker
- `/certificates` — Certificates page

## Testing Certificate Feature

### Quick Path to Certificate
1. Navigate to each beginner lesson and click "Mark Complete":
   - `/lesson/what-is-devin`
   - `/lesson/devin-capabilities`
   - `/lesson/devin-interface`
   - `/lesson/basic-prompting`
   - `/lesson/assigning-tasks`
2. After marking the 5th lesson complete, completion modal auto-triggers
3. Enter name and email, click "Generate My Certificate"
4. Certificate preview appears with Download, Email, and Share on LinkedIn buttons

### What to Verify
- Modal auto-triggers when track reaches 100% (not before)
- Certificate shows correct name, track title, date, lesson/exercise counts
- Download produces a PNG file named `devin-academy-{track}-certificate.png`
- Email button shows "Email Not Configured" gracefully when EmailJS env vars are not set
- LinkedIn share opens `linkedin.com/feed/?shareActive=true&text=...` with pre-populated post
- `/certificates` page shows earned certificates with Download/Email/LinkedIn buttons
- Data persists after page refresh (localStorage)

### Clearing State
To reset all progress and certificates:
```javascript
// In browser console
localStorage.clear(); location.reload();
```

Or clear specific keys:
```javascript
localStorage.removeItem('devin-training-progress');
localStorage.removeItem('devin-training-certificates');
location.reload();
```

## EmailJS Configuration
Email sending requires three environment variables:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

Without these, the email button gracefully degrades. To test email sending, the repo owner needs to set up an EmailJS account.

## Devin Secrets Needed
- No secrets required for basic testing
- For email testing: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` (from EmailJS account)

## Known Quirks
- Port 5173 might be in use; Vite auto-increments to 5174, 5175, etc.
- The `google-chrome` wrapper at `~/.local/bin/google-chrome` may fail with exit code 7 if the CDP server isn't running. Use the actual Chrome binary from `/opt/.devin/chrome/` instead.
- The sidebar progress % label might not update immediately after using `localStorage.clear()` — a full page reload fixes this.
- PR creation tool may have issues with repos containing double-dashes (`--`) in the name.
