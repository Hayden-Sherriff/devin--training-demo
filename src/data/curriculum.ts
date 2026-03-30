export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: LessonContent[];
  exercises: Exercise[];
  tips: string[];
}

export interface LessonContent {
  type: 'text' | 'heading' | 'code' | 'comparison' | 'list' | 'callout' | 'template';
  value: string;
  items?: string[];
  good?: string;
  bad?: string;
  goodExplanation?: string;
  badExplanation?: string;
  variant?: 'info' | 'warning' | 'tip' | 'success';
  templateTitle?: string;
}

export interface Exercise {
  id: string;
  type: 'prompt-writing' | 'multiple-choice' | 'comparison' | 'freeform';
  question: string;
  hint?: string;
  idealAnswer?: string;
  options?: string[];
  correctOption?: number;
  explanation?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  color: string;
  modules: Module[];
}

export const tracks: Track[] = [
  {
    id: 'beginner',
    title: 'Beginner Track',
    description: 'Start your journey with Devin. Learn the fundamentals of AI-powered software engineering.',
    level: 'beginner',
    color: 'emerald',
    modules: [
      {
        id: 'intro-to-devin',
        title: 'What is Devin?',
        description: 'Understand what Devin is, how it works, and what makes it different from other AI tools.',
        icon: 'Sparkles',
        lessons: [
          {
            id: 'what-is-devin',
            title: 'Understanding Devin',
            description: 'Learn what Devin is and how it fits into your development workflow.',
            duration: '10 min',
            content: [
              { type: 'heading', value: 'What is Devin?' },
              { type: 'text', value: 'Devin is an AI software engineer built by Cognition AI. Unlike simple code completion tools, Devin is a fully autonomous agent that can plan, write code, debug, deploy, and collaborate with you on complex software engineering tasks.' },
              { type: 'callout', value: 'Devin is not just a chatbot that writes code snippets. It has its own development environment with a shell, browser, and code editor \u2014 just like a real developer.', variant: 'info' },
              { type: 'heading', value: 'How Devin is Different' },
              { type: 'list', value: 'Key capabilities:', items: [
                'Plans and executes multi-step tasks autonomously',
                'Has its own virtual machine with shell, browser, and editor',
                'Can browse documentation, install packages, and run tests',
                'Creates pull requests and responds to code review feedback',
                'Learns from your codebase context and conventions',
                'Can run multiple sessions in parallel'
              ]},
              { type: 'heading', value: 'When to Use Devin' },
              { type: 'text', value: 'Devin excels at well-defined tasks that you can describe clearly. Think of it as delegating work to a capable junior developer \u2014 the clearer your instructions, the better the results.' },
              { type: 'comparison', value: 'Task Description', good: 'Add a password reset feature to the auth module. Use the existing email service in src/services/email.ts. The reset token should expire after 1 hour. Add tests.', bad: 'Add password reset', goodExplanation: 'Specific, references existing code, defines requirements', badExplanation: 'Too vague \u2014 Devin has to guess at implementation details' },
            ],
            exercises: [
              {
                id: 'ex-what-is-devin-1',
                type: 'multiple-choice',
                question: 'What makes Devin different from a typical AI code assistant?',
                options: [
                  'It can only write Python code',
                  'It has its own development environment and can autonomously plan, code, and deploy',
                  'It requires you to write most of the code yourself',
                  'It only works with GitHub Copilot'
                ],
                correctOption: 1,
                explanation: 'Devin has a full development environment (shell, browser, editor) and can autonomously plan and execute multi-step software engineering tasks.'
              },
              {
                id: 'ex-what-is-devin-2',
                type: 'prompt-writing',
                question: 'Write a task description asking Devin to add input validation to a signup form. Be specific about what fields need validation and what rules to apply.',
                hint: 'Think about: which fields, what validation rules, error message style, and where the form lives in the codebase.',
                idealAnswer: 'Add input validation to the signup form in src/components/SignupForm.tsx. Validate: email (must be valid format), password (min 8 chars, at least one number and one uppercase letter), and username (3-20 chars, alphanumeric only). Show inline error messages below each field in red text. Prevent form submission until all fields are valid.'
              }
            ],
            tips: [
              'Start with small, well-defined tasks to build confidence with Devin.',
              'Devin works best when you provide context about your codebase.',
              'You can watch Devin work in real-time through its session interface.'
            ]
          },
          {
            id: 'devin-capabilities',
            title: 'Devin\'s Capabilities',
            description: 'Explore what Devin can do across the software development lifecycle.',
            duration: '12 min',
            content: [
              { type: 'heading', value: 'Full Development Lifecycle' },
              { type: 'text', value: 'Devin can handle tasks across the entire software development lifecycle, from planning and implementation to testing and deployment.' },
              { type: 'list', value: 'Development Tasks:', items: [
                'Writing new features and components',
                'Fixing bugs and resolving issues',
                'Refactoring and improving code quality',
                'Adding tests and improving coverage',
                'Setting up CI/CD pipelines',
                'Database migrations and schema changes'
              ]},
              { type: 'list', value: 'Research & Analysis:', items: [
                'Reading and understanding documentation',
                'Exploring codebases to understand architecture',
                'Researching libraries and best practices',
                'Analyzing error logs and stack traces'
              ]},
              { type: 'list', value: 'Operations:', items: [
                'Setting up development environments',
                'Configuring build tools and linters',
                'Deploying applications',
                'Managing dependencies and updates'
              ]},
              { type: 'callout', value: 'Devin can also create and manage child sessions to parallelize work across multiple tasks simultaneously.', variant: 'tip' },
            ],
            exercises: [
              {
                id: 'ex-capabilities-1',
                type: 'multiple-choice',
                question: 'Which of the following can Devin NOT do?',
                options: [
                  'Browse the web to read documentation',
                  'Run shell commands and install packages',
                  'Access your production database with admin privileges by default',
                  'Create pull requests and respond to review comments'
                ],
                correctOption: 2,
                explanation: 'Devin does not have automatic access to production systems. You must explicitly provide credentials and access, following the principle of least privilege.'
              }
            ],
            tips: [
              'Devin can learn about your project through your repo\'s README, CONTRIBUTING.md, and other docs.',
              'Use Devin\'s knowledge system to store important project context for future sessions.'
            ]
          }
        ]
      },
      {
        id: 'interface-walkthrough',
        title: 'Interface Walkthrough',
        description: 'Get familiar with the Devin interface and learn how to navigate it effectively.',
        icon: 'Layout',
        lessons: [
          {
            id: 'devin-interface',
            title: 'Navigating the Devin Interface',
            description: 'Learn the key parts of the Devin webapp and how to use them.',
            duration: '8 min',
            content: [
              { type: 'heading', value: 'The Devin Webapp' },
              { type: 'text', value: 'The Devin webapp (app.devin.ai) is your command center for interacting with Devin. Here\'s what you\'ll find:' },
              { type: 'list', value: 'Key Interface Elements:', items: [
                'Session Chat \u2014 where you communicate with Devin and assign tasks',
                'Desktop View \u2014 watch Devin\'s screen in real-time as it works',
                'Timeline \u2014 see a structured log of Devin\'s actions and decisions',
                'Shell/Editor/Browser tabs \u2014 inspect Devin\'s development environment',
                'Session List \u2014 manage multiple concurrent sessions',
                'Settings \u2014 configure repos, secrets, environment, and integrations'
              ]},
              { type: 'heading', value: 'Starting a New Session' },
              { type: 'text', value: 'To start working with Devin, create a new session from the dashboard. You can select which repository to work in and provide your initial task description.' },
              { type: 'callout', value: 'Pro tip: You can also start Devin sessions from Slack, Linear, or other integrated tools.', variant: 'tip' },
              { type: 'heading', value: 'Monitoring Progress' },
              { type: 'text', value: 'While Devin works, you can watch its progress in real-time. The timeline shows each step Devin takes, and you can switch to the Desktop tab to see its screen directly.' },
            ],
            exercises: [
              {
                id: 'ex-interface-1',
                type: 'multiple-choice',
                question: 'What is the Desktop tab used for in the Devin webapp?',
                options: [
                  'Writing code directly in Devin\'s editor',
                  'Watching Devin\'s screen in real-time as it works',
                  'Managing your account settings',
                  'Viewing pull request diffs'
                ],
                correctOption: 1,
                explanation: 'The Desktop tab lets you watch Devin\'s screen live, so you can see exactly what it\'s doing \u2014 browsing, coding, running commands, etc.'
              }
            ],
            tips: [
              'Keep the session open while Devin works so you can provide feedback early.',
              'Use the timeline view to quickly scan what Devin has done without reading the full chat.'
            ]
          }
        ]
      },
      {
        id: 'basic-prompting',
        title: 'Basic Prompting',
        description: 'Learn how to write clear, effective prompts that get great results from Devin.',
        icon: 'MessageSquare',
        lessons: [
          {
            id: 'prompting-fundamentals',
            title: 'Prompting Fundamentals',
            description: 'Master the basics of writing effective task descriptions for Devin.',
            duration: '15 min',
            content: [
              { type: 'heading', value: 'The Art of Good Prompts' },
              { type: 'text', value: 'The quality of Devin\'s output is directly tied to the quality of your instructions. A well-written prompt saves time and reduces back-and-forth.' },
              { type: 'heading', value: 'The SCOPE Framework' },
              { type: 'text', value: 'Use this framework to structure your task descriptions:' },
              { type: 'list', value: 'SCOPE:', items: [
                'Specific \u2014 What exactly needs to be done?',
                'Context \u2014 What existing code, files, or systems are involved?',
                'Output \u2014 What should the end result look like?',
                'Patterns \u2014 What conventions or patterns should be followed?',
                'Edge cases \u2014 What should happen in unusual situations?'
              ]},
              { type: 'comparison', value: 'Bug Fix Request', good: 'Fix the login timeout issue. Users report being logged out after 5 minutes of inactivity. The session management is in src/auth/session.ts. The timeout should be 30 minutes. Make sure to update the related tests in __tests__/session.test.ts.', bad: 'Fix the login bug', goodExplanation: 'Describes the symptom, points to relevant files, specifies the expected behavior, and mentions tests', badExplanation: 'No detail about what the bug is, where to look, or what "fixed" means' },
              { type: 'comparison', value: 'Feature Request', good: 'Add a dark mode toggle to the settings page (src/pages/Settings.tsx). Use the existing ThemeContext in src/context/theme.ts. Store the preference in localStorage. The toggle should be a switch component matching our design system in src/components/ui/.', bad: 'Add dark mode to the app', goodExplanation: 'Points to exact files, references existing systems, specifies storage mechanism and UI component style', badExplanation: 'Too broad \u2014 Devin would have to make many assumptions about where and how to implement this' },
              { type: 'heading', value: 'Common Prompting Mistakes' },
              { type: 'list', value: 'Avoid these:', items: [
                'Being too vague ("make it better")',
                'Assuming Devin knows your preferences without stating them',
                'Giving multiple unrelated tasks in one prompt',
                'Not specifying which files or modules to work with',
                'Forgetting to mention testing requirements'
              ]},
              { type: 'template', templateTitle: 'Bug Fix Template', value: 'Fix [describe the bug]. The issue occurs when [describe trigger]. The relevant code is in [file path]. Expected behavior: [describe]. Current behavior: [describe]. Please also update the tests in [test file path].' },
              { type: 'template', templateTitle: 'Feature Request Template', value: 'Add [feature name] to [component/page]. It should [describe functionality]. Use the existing [services/utilities/patterns] in [file paths]. Follow the same conventions as [similar existing feature]. Include tests.' },
            ],
            exercises: [
              {
                id: 'ex-prompting-1',
                type: 'prompt-writing',
                question: 'You need Devin to add pagination to an API endpoint. Write a clear, specific prompt using the SCOPE framework.',
                hint: 'Include: which endpoint, page size, response format, existing patterns to follow.',
                idealAnswer: 'Add cursor-based pagination to the GET /api/users endpoint in src/routes/users.ts. Use 20 items per page by default (configurable via ?limit= query param, max 100). Return a response with { data: User[], nextCursor: string | null, hasMore: boolean }. Follow the same pagination pattern used in src/routes/products.ts. Add tests covering: first page, middle page, last page, and custom limit.'
              },
              {
                id: 'ex-prompting-2',
                type: 'comparison',
                question: 'Which prompt would get better results from Devin?',
                options: [
                  'Refactor the database queries to be faster',
                  'Optimize the slow database queries in src/models/orders.ts. The getOrderHistory() function takes 3+ seconds for users with 1000+ orders. Consider adding an index on the created_at column, and implement result caching with a 5-minute TTL using the existing Redis client in src/lib/redis.ts.'
                ],
                correctOption: 1,
                explanation: 'The second prompt is far more effective because it identifies the specific slow function, quantifies the problem, suggests concrete solutions, and points to existing infrastructure to use.'
              }
            ],
            tips: [
              'When in doubt, give more context rather than less.',
              'Reference specific files and functions when possible.',
              'Tell Devin what "done" looks like \u2014 define your acceptance criteria.',
              'If you want Devin to follow a specific approach, say so explicitly.'
            ]
          },
          {
            id: 'assigning-tasks',
            title: 'Assigning Tasks to Devin',
            description: 'Learn the workflow for delegating tasks to Devin effectively.',
            duration: '10 min',
            content: [
              { type: 'heading', value: 'Task Assignment Workflow' },
              { type: 'text', value: 'Here\'s the recommended workflow for getting great results from Devin:' },
              { type: 'list', value: 'Step-by-step:', items: [
                '1. Start a new session and select your repository',
                '2. Write a clear task description using the SCOPE framework',
                '3. Provide any necessary context (links to issues, design specs, etc.)',
                '4. Let Devin plan and begin working',
                '5. Monitor progress and provide feedback early',
                '6. Review the PR when Devin creates it',
                '7. Leave comments on the PR for any changes needed'
              ]},
              { type: 'heading', value: 'Providing Feedback' },
              { type: 'text', value: 'You can guide Devin during a session by sending messages in the chat. You can also leave comments directly on the pull request \u2014 Devin will read and act on them.' },
              { type: 'callout', value: 'Devin works best with specific, actionable feedback. Instead of "this doesn\'t look right," try "the button color should be blue-500 instead of blue-700, and add 8px of padding."', variant: 'tip' },
              { type: 'heading', value: 'Setting Up Your Repo' },
              { type: 'text', value: 'For the best experience, make sure your repository has:' },
              { type: 'list', value: 'Repo setup checklist:', items: [
                'A clear README with setup instructions',
                'Environment configuration in Devin settings',
                'Necessary secrets configured (API keys, tokens)',
                'Lint and test commands documented',
                'AGENTS.md or SKILL.md files for project-specific guidance'
              ]},
            ],
            exercises: [
              {
                id: 'ex-assigning-1',
                type: 'multiple-choice',
                question: 'What is the best way to give Devin feedback on its work?',
                options: [
                  'Wait until the task is fully complete, then reject everything',
                  'Provide specific, actionable feedback early in the session or via PR comments',
                  'Start a completely new session with different instructions',
                  'Edit the code yourself and push to the branch'
                ],
                correctOption: 1,
                explanation: 'Providing specific feedback early helps Devin course-correct quickly. PR comments are especially effective because Devin can see exactly which code you\'re referring to.'
              },
              {
                id: 'ex-assigning-2',
                type: 'prompt-writing',
                question: 'You notice Devin used the wrong CSS framework in its implementation. Write a feedback message to correct this.',
                hint: 'Be specific about what was used vs. what should be used, and point to examples.',
                idealAnswer: 'Please use Tailwind CSS classes instead of inline styles. Our project uses Tailwind throughout \u2014 see src/components/Button.tsx for an example of our styling conventions. Replace the inline style={{ padding: "8px 16px" }} with className="px-4 py-2" and similarly for all other inline styles in the new components.'
              }
            ],
            tips: [
              'Set up your repository\'s environment config in Devin settings for faster session starts.',
              'Use playbooks for tasks you delegate frequently.',
              'Devin can read comments on pull requests, so use PR reviews to request changes.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'intermediate',
    title: 'Intermediate Track',
    description: 'Level up your Devin skills with multi-step tasks, debugging, and iteration techniques.',
    level: 'intermediate',
    color: 'blue',
    modules: [
      {
        id: 'multi-step-tasks',
        title: 'Multi-Step Tasks',
        description: 'Learn to orchestrate complex tasks that involve multiple steps and components.',
        icon: 'ListChecks',
        lessons: [
          {
            id: 'breaking-down-tasks',
            title: 'Breaking Down Complex Tasks',
            description: 'Learn how to decompose large tasks for Devin to handle effectively.',
            duration: '12 min',
            content: [
              { type: 'heading', value: 'Why Break Down Tasks?' },
              { type: 'text', value: 'Large, complex tasks are harder for any developer \u2014 including Devin \u2014 to get right in one shot. Breaking tasks into smaller, well-defined pieces leads to better results and easier review.' },
              { type: 'heading', value: 'Task Decomposition Strategies' },
              { type: 'list', value: 'Approaches:', items: [
                'By layer: Frontend \u2192 API \u2192 Database',
                'By feature: Core logic \u2192 Edge cases \u2192 Tests',
                'By dependency: Build foundations first, then dependent features',
                'By priority: Critical path first, nice-to-haves second'
              ]},
              { type: 'comparison', value: 'Task Breakdown', good: 'Session 1: Create the database schema and migration for the user_preferences table with columns: user_id (FK), theme (enum), language (varchar), notifications_enabled (boolean).\n\nSession 2: Add CRUD API endpoints for user preferences in src/routes/preferences.ts. Follow the pattern in src/routes/users.ts.\n\nSession 3: Build the Settings UI page with form fields for each preference, using the same form patterns as the Profile page.', bad: 'Build a complete user preferences system with database, API, and frontend.', goodExplanation: 'Each session has a clear, focused scope with references to existing patterns', badExplanation: 'Too much scope for a single session \u2014 high risk of errors cascading across layers' },
              { type: 'callout', value: 'Devin can also run child sessions to parallelize independent tasks. For example, you can have one session building the API while another writes tests.', variant: 'tip' },
              { type: 'heading', value: 'Using Playbooks for Repeated Patterns' },
              { type: 'text', value: 'If you find yourself breaking down tasks the same way repeatedly, create a Devin playbook that captures the pattern. Playbooks are reusable task templates that standardize your workflows.' },
            ],
            exercises: [
              {
                id: 'ex-breakdown-1',
                type: 'prompt-writing',
                question: 'You need to add a notification system to your app (email + in-app notifications). Break this into 3 focused sessions for Devin.',
                hint: 'Think about the logical layers: data model, delivery mechanism, and user interface.',
                idealAnswer: 'Session 1: Create the notifications data model. Add a notifications table with columns: id, user_id, type (email/in-app), title, body, read (boolean), created_at. Create the migration and the Notification model in src/models/.\n\nSession 2: Build the notification service in src/services/notifications.ts. Implement: createNotification(), markAsRead(), getUserNotifications(userId, { unreadOnly }). For email type, integrate with the existing email service in src/services/email.ts.\n\nSession 3: Add a notification bell icon to the header (src/components/Header.tsx) showing unread count. Create a dropdown panel listing recent notifications. Clicking a notification marks it as read and navigates to the relevant page.'
              }
            ],
            tips: [
              'A good rule of thumb: if a task would take a senior developer more than 2-3 hours, consider breaking it down.',
              'Each sub-task should have a clear "done" condition.',
              'Order sub-tasks so each one builds on the previous.'
            ]
          }
        ]
      },
      {
        id: 'debugging-outputs',
        title: 'Debugging Devin Outputs',
        description: 'Learn to identify and fix issues in Devin\'s work efficiently.',
        icon: 'Bug',
        lessons: [
          {
            id: 'debugging-strategies',
            title: 'Effective Debugging Strategies',
            description: 'How to review, test, and fix Devin\'s output when things don\'t work as expected.',
            duration: '15 min',
            content: [
              { type: 'heading', value: 'Common Issues and How to Fix Them' },
              { type: 'text', value: 'Even experienced developers make mistakes. Here are common patterns in Devin\'s output and how to address them:' },
              { type: 'list', value: 'Typical Issues:', items: [
                'Missing imports or dependencies \u2192 Ask Devin to check and fix imports',
                'Wrong file location \u2192 Specify exact file paths in your prompt',
                'Incorrect assumptions about codebase \u2192 Provide more context or point to examples',
                'Partial implementation \u2192 List all requirements explicitly',
                'Style mismatches \u2192 Reference existing components as examples'
              ]},
              { type: 'heading', value: 'Using CI Feedback' },
              { type: 'text', value: 'Devin monitors CI (continuous integration) checks after creating a PR. If tests fail or lint errors occur, Devin will attempt to fix them automatically. You can also point Devin to specific CI failures.' },
              { type: 'comparison', value: 'Debug Feedback', good: 'The CI is failing with "TypeError: Cannot read property \'id\' of undefined" in src/utils/formatUser.ts:42. It looks like the user object can be null when the session expires. Please add a null check before accessing user.id.', bad: 'CI is failing, please fix it.', goodExplanation: 'Identifies the exact error, file, line, and likely cause', badExplanation: 'Devin already knows CI failed \u2014 this doesn\'t add useful information' },
              { type: 'heading', value: 'Reviewing Devin\'s Work' },
              { type: 'text', value: 'When reviewing a PR from Devin:' },
              { type: 'list', value: 'Review Checklist:', items: [
                'Check that all requirements from your original prompt are addressed',
                'Look for edge cases that might have been missed',
                'Verify the code follows your project\'s conventions',
                'Ensure tests cover the important scenarios',
                'Check for security concerns (exposed secrets, SQL injection, etc.)'
              ]},
              { type: 'callout', value: 'You can use Devin Review to automatically review PRs. This catches issues early and provides structured feedback.', variant: 'info' },
            ],
            exercises: [
              {
                id: 'ex-debug-1',
                type: 'prompt-writing',
                question: 'Devin created a PR but the pagination is returning duplicate items when users navigate between pages. Write a debugging prompt.',
                hint: 'Include: the symptom, where to look, and what the expected behavior should be.',
                idealAnswer: 'The pagination in GET /api/posts is returning duplicate items. When fetching page 2 (offset=20, limit=20), some items from page 1 appear again. I think the issue is in src/routes/posts.ts \u2014 the query might not have a stable sort order. Please add ORDER BY created_at DESC, id DESC to ensure consistent ordering, and add a test that verifies no duplicates across the first 3 pages of results.'
              },
              {
                id: 'ex-debug-2',
                type: 'multiple-choice',
                question: 'What is the most effective way to help Devin fix a CI failure?',
                options: [
                  'Just say "fix CI"',
                  'Copy the exact error message and stack trace, identify the file and line, and suggest a likely cause',
                  'Delete the PR and start a new session',
                  'Fix it yourself and push to the branch'
                ],
                correctOption: 1,
                explanation: 'Providing the exact error, location, and likely cause gives Devin the context it needs to make a targeted fix rather than guessing.'
              }
            ],
            tips: [
              'Don\'t be afraid to send Devin follow-up messages during a session to course-correct.',
              'Use PR comments for code-specific feedback \u2014 they point to the exact lines.',
              'If Devin keeps making the same mistake, add the instruction to a SKILL.md file in your repo.'
            ]
          }
        ]
      },
      {
        id: 'iterating-prompts',
        title: 'Iterating on Prompts',
        description: 'Refine your prompting skills and learn to iterate effectively.',
        icon: 'RefreshCw',
        lessons: [
          {
            id: 'prompt-iteration',
            title: 'Iterative Prompting',
            description: 'Learn the art of refining your instructions based on Devin\'s output.',
            duration: '10 min',
            content: [
              { type: 'heading', value: 'The Iteration Mindset' },
              { type: 'text', value: 'Getting the perfect result on the first try is rare. The key is to iterate quickly and efficiently. Each round of feedback should make the output significantly better.' },
              { type: 'heading', value: 'Effective Iteration Patterns' },
              { type: 'list', value: 'Iteration strategies:', items: [
                'Start broad, then narrow: Give a general task, then refine based on output',
                'Add constraints incrementally: Don\'t overload the initial prompt with every requirement',
                'Use examples: Show Devin what you want by pointing to existing code',
                'Be specific about what to change: "Change X to Y" is better than "improve this"',
                'Reference the diff: "In the PR, line 42 of api.ts should use..." is very clear'
              ]},
              { type: 'comparison', value: 'Iteration', good: 'The table component looks good, but please make these changes:\n1. Add sorting by clicking column headers (ascending/descending toggle)\n2. The date column should format dates as "Mar 15, 2024" instead of ISO format\n3. Add a loading skeleton while data is fetching, matching the pattern in src/components/UserList.tsx', bad: 'The table needs more features and better formatting.', goodExplanation: 'Three specific, actionable changes with clear requirements', badExplanation: 'Vague \u2014 Devin has to guess which features and what "better" means' },
              { type: 'heading', value: 'When to Start Fresh vs. Iterate' },
              { type: 'text', value: 'Sometimes iterating within the same session is most efficient. Other times, it\'s better to start a new session with better instructions.' },
              { type: 'list', value: 'Start a new session when:', items: [
                'The overall approach is fundamentally wrong',
                'You realized the requirements are very different from what you originally asked',
                'The session context has become too long and confused',
                'You want to try a completely different architecture'
              ]},
            ],
            exercises: [
              {
                id: 'ex-iterate-1',
                type: 'prompt-writing',
                question: 'Devin built a search feature but it\'s searching only by title. You also need it to search by description, tags, and author. Write an iteration prompt.',
                hint: 'Be specific about what fields to add and any relevance ranking preferences.',
                idealAnswer: 'Please update the search in src/services/search.ts to also search across these fields: description (partial match), tags (exact match on any tag), and author.name (partial match). Rank results with title matches first, then description, then author, then tags. Keep the existing debounce and pagination logic unchanged.'
              }
            ],
            tips: [
              'Numbered lists make iteration feedback clearer and easier to track.',
              'If Devin got 80% right, iterate in the same session rather than starting fresh.',
              'Save effective prompts as templates for similar future tasks.'
            ]
          }
        ]
      },
      {
        id: 'coding-projects',
        title: 'Coding Projects with Devin',
        description: 'Learn to use Devin for real coding projects end-to-end.',
        icon: 'Code',
        lessons: [
          {
            id: 'project-workflow',
            title: 'Project Workflow with Devin',
            description: 'End-to-end workflow for using Devin on real coding projects.',
            duration: '15 min',
            content: [
              { type: 'heading', value: 'Setting Up a Project' },
              { type: 'text', value: 'Before delegating coding tasks, set up your project for success with Devin:' },
              { type: 'list', value: 'Project Setup Checklist:', items: [
                'Configure the repository in Devin settings',
                'Set up environment config (initialize and maintenance commands)',
                'Add necessary secrets (API keys, tokens, database URLs)',
                'Create SKILL.md files with project-specific conventions',
                'Ensure CI/CD pipeline is configured',
                'Document key architecture decisions in the README'
              ]},
              { type: 'heading', value: 'Environment Configuration' },
              { type: 'text', value: 'The environment config tells Devin how to set up the development environment. It has two sections:' },
              { type: 'list', value: 'Config sections:', items: [
                'initialize: One-time setup commands (install tools, global deps)',
                'maintenance: Commands that run every session (npm install, pip install)',
                'knowledge: Reference info like lint commands, test commands, startup steps'
              ]},
              { type: 'code', value: '# Example environment config\ninitialize: |\n  curl -LsSf https://astral.sh/uv/install.sh | sh\nmaintenance: |\n  npm install\n  npm run prepare\nknowledge:\n  - name: lint\n    contents: npm run lint\n  - name: test\n    contents: npm test\n  - name: startup\n    contents: npm run dev' },
              { type: 'heading', value: 'Knowledge and Skills' },
              { type: 'text', value: 'Use Devin\'s knowledge system to store important context that persists across sessions. SKILL.md files in your repo provide project-specific instructions that Devin will follow.' },
              { type: 'callout', value: 'SKILL.md files are like onboarding documents for Devin. They should contain conventions, workflow tips, and important project context \u2014 not implementation details.', variant: 'info' },
            ],
            exercises: [
              {
                id: 'ex-project-1',
                type: 'prompt-writing',
                question: 'Write a SKILL.md file content for a Node.js/Express project that uses PostgreSQL and Jest for testing.',
                hint: 'Include: how to run the project, testing conventions, database setup, and coding standards.',
                idealAnswer: '# Project Skills\n\n## Running the Project\n- Start dev server: `npm run dev` (runs on port 3000)\n- Run tests: `npm test` (uses Jest)\n- Lint: `npm run lint` (ESLint + Prettier)\n\n## Database\n- PostgreSQL with Prisma ORM\n- Run migrations: `npx prisma migrate dev`\n- Seed data: `npm run seed`\n\n## Conventions\n- Use async/await, never callbacks\n- All API responses follow { data, error, meta } format\n- Routes go in src/routes/, services in src/services/\n- Every new endpoint needs integration tests\n- Use the existing error handling middleware \u2014 throw AppError instances'
              }
            ],
            tips: [
              'Keep SKILL.md files focused and up-to-date.',
              'Environment configs run automatically \u2014 make sure all commands are idempotent.',
              'Test your setup by starting a fresh Devin session and verifying it can build and test.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Track',
    description: 'Master advanced techniques for orchestrating complex projects and maximizing Devin\'s potential.',
    level: 'advanced',
    color: 'purple',
    modules: [
      {
        id: 'complex-orchestration',
        title: 'Complex Project Orchestration',
        description: 'Coordinate multiple Devin sessions and manage large-scale projects.',
        icon: 'GitBranch',
        lessons: [
          {
            id: 'parallel-sessions',
            title: 'Parallel Sessions & Child Sessions',
            description: 'Use multiple Devin sessions to parallelize work and move faster.',
            duration: '12 min',
            content: [
              { type: 'heading', value: 'Running Sessions in Parallel' },
              { type: 'text', value: 'For large projects, you can run multiple Devin sessions simultaneously. Each session works independently on its own branch, allowing you to parallelize work across different parts of the codebase.' },
              { type: 'list', value: 'Parallelization strategies:', items: [
                'Split by feature: Each session builds a different feature',
                'Split by layer: Frontend, backend, and infrastructure in separate sessions',
                'Split by concern: Implementation in one session, tests in another',
                'Use child sessions: A parent session can spawn child sessions for sub-tasks'
              ]},
              { type: 'heading', value: 'Child Sessions' },
              { type: 'text', value: 'Devin can create child sessions to delegate sub-tasks. This is powerful for batch operations or parallelizable work.' },
              { type: 'code', value: '// Example: Using child sessions for batch migrations\n// Parent session prompt:\n"Migrate these 5 API endpoints from Express to Fastify.\nCreate a child session for each endpoint:\n1. GET /api/users -> child session 1\n2. POST /api/users -> child session 2\n3. GET /api/posts -> child session 3\n4. POST /api/posts -> child session 4\n5. GET /api/comments -> child session 5\nEach session should follow the migration pattern in MIGRATION_GUIDE.md."' },
              { type: 'callout', value: 'When using parallel sessions, make sure the tasks are truly independent. If session B depends on the output of session A, run them sequentially.', variant: 'warning' },
              { type: 'heading', value: 'Scheduled Sessions' },
              { type: 'text', value: 'You can schedule recurring Devin sessions for maintenance tasks like dependency updates, security scans, or regular code quality checks.' },
            ],
            exercises: [
              {
                id: 'ex-parallel-1',
                type: 'prompt-writing',
                question: 'You need to add internationalization (i18n) to 10 pages of your app. Design a parallelization strategy using Devin sessions.',
                hint: 'Think about what can be done in parallel vs. what needs to be sequential.',
                idealAnswer: 'Session 1 (Sequential - do this first): Set up the i18n infrastructure. Install react-i18next, create the i18n config in src/lib/i18n.ts, set up the language detection and fallback logic, and create the translation file structure (src/locales/en/, src/locales/es/). Create a sample translation for the Home page as a reference pattern.\n\nSessions 2-6 (Parallel - after session 1 completes): Each session takes 2 pages and extracts all hardcoded strings into translation keys, following the pattern established in session 1.\n\nSession 7 (Sequential - after 2-6 complete): Add the language switcher component to the header, integrate all translations, and run the full test suite to verify nothing broke.'
              }
            ],
            tips: [
              'Child sessions inherit the parent\'s repository context.',
              'Use scheduled sessions for recurring maintenance tasks.',
              'Always merge parallel session branches one at a time, resolving conflicts sequentially.'
            ]
          }
        ]
      },
      {
        id: 'best-practices-autonomy',
        title: 'Best Practices for Autonomy',
        description: 'Configure Devin for maximum autonomy while maintaining quality.',
        icon: 'Shield',
        lessons: [
          {
            id: 'autonomy-practices',
            title: 'Maximizing Devin\'s Autonomy',
            description: 'Set up guardrails that let Devin work independently while ensuring quality.',
            duration: '12 min',
            content: [
              { type: 'heading', value: 'The Autonomy Spectrum' },
              { type: 'text', value: 'Devin can operate at different levels of autonomy depending on how you configure your project and how much context you provide upfront.' },
              { type: 'list', value: 'Increasing autonomy:', items: [
                'Level 1: Detailed step-by-step instructions (low autonomy, high predictability)',
                'Level 2: Clear requirements with referenced patterns (medium autonomy)',
                'Level 3: High-level goals with well-configured environment (high autonomy)',
                'Level 4: Automated triggers with playbooks and schedules (maximum autonomy)'
              ]},
              { type: 'heading', value: 'Prerequisites for High Autonomy' },
              { type: 'text', value: 'To let Devin work with minimal supervision, you need:' },
              { type: 'list', value: 'Autonomy checklist:', items: [
                'Comprehensive CI pipeline (lint, test, type-check, build)',
                'Well-documented codebase with clear conventions',
                'SKILL.md files capturing project-specific knowledge',
                'Environment config with all necessary setup steps',
                'Secrets properly configured in Devin settings',
                'Playbooks for common task patterns'
              ]},
              { type: 'heading', value: 'Quality Guardrails' },
              { type: 'text', value: 'Autonomy doesn\'t mean no oversight. Set up automated guardrails:' },
              { type: 'list', value: 'Guardrails:', items: [
                'CI checks that must pass before merging',
                'Devin Review for automated PR review',
                'Required reviewers on the repository',
                'Branch protection rules',
                'Test coverage thresholds'
              ]},
              { type: 'callout', value: 'The goal is to make Devin\'s happy path (everything works on the first try) as common as possible. Invest time in setup to save time on every future task.', variant: 'success' },
            ],
            exercises: [
              {
                id: 'ex-autonomy-1',
                type: 'multiple-choice',
                question: 'What is the MOST important prerequisite for giving Devin high autonomy?',
                options: [
                  'A fast internet connection',
                  'A comprehensive CI pipeline with lint, tests, and type-checking',
                  'Using the latest JavaScript framework',
                  'Having fewer than 100 files in the repo'
                ],
                correctOption: 1,
                explanation: 'A comprehensive CI pipeline acts as an automated quality gate. If Devin\'s code passes lint, tests, and type-checking, you can be much more confident in the output without manual review of every line.'
              }
            ],
            tips: [
              'Start with low autonomy and gradually increase as you build confidence.',
              'CI is your most important guardrail \u2014 invest in a thorough pipeline.',
              'Playbooks encode your best practices and reduce the need for manual instructions.'
            ]
          }
        ]
      },
      {
        id: 'prompt-engineering',
        title: 'Prompt Engineering Patterns',
        description: 'Advanced prompt techniques for complex scenarios.',
        icon: 'Wand2',
        lessons: [
          {
            id: 'advanced-patterns',
            title: 'Advanced Prompt Patterns',
            description: 'Master advanced techniques for getting the best results from Devin.',
            duration: '15 min',
            content: [
              { type: 'heading', value: 'Pattern 1: The Reference-Based Prompt' },
              { type: 'text', value: 'Point Devin to existing code as a reference for how to implement something new:' },
              { type: 'template', templateTitle: 'Reference-Based Pattern', value: 'Create a new [component/endpoint/service] for [purpose]. Follow the same pattern as [existing reference file]. Key differences from the reference: [list differences]. Make sure to [specific requirements].' },
              { type: 'heading', value: 'Pattern 2: The Constraint-First Prompt' },
              { type: 'text', value: 'Lead with constraints and non-requirements to prevent common mistakes:' },
              { type: 'template', templateTitle: 'Constraint-First Pattern', value: 'DO NOT: [list things to avoid]\nMUST: [list hard requirements]\nSHOULD: [list preferences]\n\nTask: [describe what needs to be done]\nContext: [relevant files and systems]' },
              { type: 'heading', value: 'Pattern 3: The Acceptance Criteria Prompt' },
              { type: 'text', value: 'Define "done" with explicit, testable acceptance criteria:' },
              { type: 'template', templateTitle: 'Acceptance Criteria Pattern', value: 'Implement [feature].\n\nAcceptance Criteria:\n- [ ] [Criterion 1]\n- [ ] [Criterion 2]\n- [ ] [Criterion 3]\n- [ ] Tests pass with >80% coverage on new code\n- [ ] No lint errors\n- [ ] PR description explains the implementation approach' },
              { type: 'heading', value: 'Pattern 4: The Migration Prompt' },
              { type: 'text', value: 'For refactoring and migration tasks, be explicit about before/after:' },
              { type: 'template', templateTitle: 'Migration Pattern', value: 'Migrate [component/system] from [old approach] to [new approach].\n\nBefore: [describe current state]\nAfter: [describe target state]\n\nFiles to change: [list files]\nFiles to NOT change: [list files to preserve]\n\nMigration steps:\n1. [Step 1]\n2. [Step 2]\n3. Run existing tests to verify nothing broke' },
            ],
            exercises: [
              {
                id: 'ex-patterns-1',
                type: 'prompt-writing',
                question: 'Using the Constraint-First pattern, write a prompt asking Devin to add authentication middleware to your Express API.',
                hint: 'Think about security constraints, existing patterns, and specific requirements.',
                idealAnswer: 'DO NOT:\n- Modify existing route handlers\n- Use a new auth library (we already use jsonwebtoken)\n- Store tokens in localStorage (use httpOnly cookies)\n\nMUST:\n- Use the existing JWT_SECRET from environment variables\n- Return 401 for invalid/expired tokens with { error: "Unauthorized" }\n- Add the decoded user to req.user for downstream handlers\n\nSHOULD:\n- Skip auth for routes in the PUBLIC_ROUTES array in src/config/routes.ts\n- Log auth failures to our existing logger (src/lib/logger.ts)\n\nTask: Create an auth middleware in src/middleware/auth.ts and apply it to the Express app in src/app.ts. Add tests covering: valid token, expired token, missing token, and public route bypass.'
              }
            ],
            tips: [
              'Combine patterns for complex tasks \u2014 e.g., Reference-Based + Acceptance Criteria.',
              'Save your best prompts as templates for future use.',
              'The Constraint-First pattern is especially useful when Devin keeps making the same mistakes.'
            ]
          }
        ]
      },
      {
        id: 'real-world-workflows',
        title: 'Real-World Workflows',
        description: 'Apply Devin to real-world scenarios like building apps, automations, and more.',
        icon: 'Rocket',
        lessons: [
          {
            id: 'workflow-examples',
            title: 'Real-World Devin Workflows',
            description: 'Learn from practical examples of how teams use Devin in production.',
            duration: '15 min',
            content: [
              { type: 'heading', value: 'Workflow 1: Building a Feature End-to-End' },
              { type: 'text', value: 'Here\'s how a team might use Devin to build a complete feature:' },
              { type: 'list', value: 'Steps:', items: [
                '1. Product manager writes a spec in a Linear ticket',
                '2. Devin is triggered from Linear (or manually) and reads the spec',
                '3. Devin plans the implementation and creates a todo list',
                '4. Devin implements the feature, writes tests, and creates a PR',
                '5. Devin Review runs automated review on the PR',
                '6. Developer reviews the PR and leaves comments',
                '7. Devin addresses feedback and updates the PR',
                '8. PR is merged after CI passes and reviews are approved'
              ]},
              { type: 'heading', value: 'Workflow 2: Automated Maintenance' },
              { type: 'text', value: 'Use scheduled sessions for ongoing maintenance:' },
              { type: 'list', value: 'Example automations:', items: [
                'Weekly dependency updates: "Check for outdated packages and update minor/patch versions. Run tests to verify compatibility."',
                'Daily security scan: "Run npm audit and fix any vulnerabilities that have a patch available."',
                'Monthly docs update: "Review all TODO comments in the codebase and create issues for any that are stale."'
              ]},
              { type: 'heading', value: 'Workflow 3: Codebase Migration' },
              { type: 'text', value: 'Large migrations are a perfect use case for Devin:' },
              { type: 'list', value: 'Migration strategy:', items: [
                '1. Create a playbook with the migration pattern and rules',
                '2. Start with one file as a proof-of-concept session',
                '3. Review and refine the approach',
                '4. Use batch child sessions to migrate remaining files in parallel',
                '5. Run comprehensive tests after all migrations are merged'
              ]},
              { type: 'heading', value: 'Workflow 4: Rapid Prototyping' },
              { type: 'text', value: 'Devin is excellent for quickly building prototypes and MVPs:' },
              { type: 'code', value: '// Example prototype prompt:\n"Build a simple dashboard that displays our key metrics.\nTech stack: React + Tailwind + Chart.js\nData source: Mock data for now (we\'ll add real API later)\n\nPage layout:\n- Top bar with app name and date range selector\n- 4 KPI cards (total users, active users, revenue, churn rate)\n- Line chart showing user growth over 12 months\n- Table of recent signups (name, email, date, plan)\n\nKeep it clean and minimal. Deploy to Vercel when done."' },
              { type: 'callout', value: 'Teams report that Devin is especially impactful for reducing context-switching costs. Instead of interrupting your flow to fix a small bug, delegate it to Devin and stay focused on your main task.', variant: 'tip' },
            ],
            exercises: [
              {
                id: 'ex-workflow-1',
                type: 'prompt-writing',
                question: 'Design a weekly scheduled session prompt for automated dependency updates that is safe and thorough.',
                hint: 'Think about: what to update, how to verify safety, what to do with breaking changes.',
                idealAnswer: 'Check for outdated npm packages using `npm outdated`. Update all packages with minor and patch version bumps (do NOT update major versions). After updating:\n1. Run the full test suite (`npm test`)\n2. Run the build (`npm run build`)\n3. Run lint (`npm run lint`)\n\nIf all checks pass, create a PR titled "chore: weekly dependency updates [date]" with a list of updated packages and their version changes.\n\nIf any tests or builds fail after an update, revert that specific package to its previous version and note it in the PR description as "Skipped: [package] (breaks [test/build])".\n\nDo NOT update: packages listed in the DEPENDENCY_FREEZE section of package.json comments.'
              },
              {
                id: 'ex-workflow-2',
                type: 'multiple-choice',
                question: 'What is the best approach for using Devin to migrate 50 files from JavaScript to TypeScript?',
                options: [
                  'One session that migrates all 50 files at once',
                  'Migrate one file as a proof-of-concept, refine the approach, then use batch sessions for the rest',
                  'Ask Devin to just rename .js files to .ts',
                  'Wait for a tool that does it automatically'
                ],
                correctOption: 1,
                explanation: 'Start with one file to establish the migration pattern, review and refine, then parallelize. This catches issues early before they\'re multiplied across 50 files.'
              }
            ],
            tips: [
              'Playbooks + scheduled sessions = powerful automation.',
              'Start with Devin on low-risk tasks to build trust, then gradually increase scope.',
              'Devin\'s biggest value is handling the tasks you don\'t want to context-switch for.'
            ]
          }
        ]
      }
    ]
  }
];

export function getLessonById(lessonId: string): { track: Track; module: Module; lesson: Lesson } | null {
  for (const track of tracks) {
    for (const mod of track.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.id === lessonId) {
          return { track, module: mod, lesson };
        }
      }
    }
  }
  return null;
}

export function getTrackById(trackId: string): Track | undefined {
  return tracks.find(t => t.id === trackId);
}

export function getAllLessons(): { track: Track; module: Module; lesson: Lesson }[] {
  const result: { track: Track; module: Module; lesson: Lesson }[] = [];
  for (const track of tracks) {
    for (const mod of track.modules) {
      for (const lesson of mod.lessons) {
        result.push({ track, module: mod, lesson });
      }
    }
  }
  return result;
}

export function getNextLesson(currentLessonId: string): { track: Track; module: Module; lesson: Lesson } | null {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.lesson.id === currentLessonId);
  if (idx === -1 || idx === all.length - 1) return null;
  return all[idx + 1];
}

export function getPrevLesson(currentLessonId: string): { track: Track; module: Module; lesson: Lesson } | null {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.lesson.id === currentLessonId);
  if (idx <= 0) return null;
  return all[idx - 1];
}
