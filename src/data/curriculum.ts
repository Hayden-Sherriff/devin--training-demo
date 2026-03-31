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
  type: 'prompt-writing' | 'multiple-choice' | 'comparison' | 'freeform' | 'scenario';
  question: string;
  hint?: string;
  idealAnswer?: string;
  options?: string[];
  correctOption?: number;
  explanation?: string;
  scenario?: string;
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
              { type: 'heading', value: 'Devin\'s Strengths' },
              { type: 'text', value: 'According to the official docs, here are the types of tasks where Devin excels:' },
              { type: 'list', value: 'Best use cases:', items: [
                'Tackling many tasks in parallel \u2014 Linear/Jira tickets, features, bug reports',
                'Code migrations and refactors \u2014 JS to TS, framework upgrades, removing feature flags',
                'Common engineering tasks \u2014 PR review, codebase Q&A, writing unit tests, docs',
                'Customer engineering \u2014 new integrations, API work, prototyping, internal tools'
              ]},
              { type: 'callout', value: 'Rule of thumb: if a task would take you three hours or less, Devin can most likely do it. For larger projects, break them into focused sessions.', variant: 'tip' },
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
              },
              {
                id: 'ex-what-is-devin-3',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Your team just launched a new e-commerce app but users are reporting that the checkout page crashes when they apply a discount code. You\'ve narrowed it down to the discount calculation logic but don\'t have time to fix it yourself.',
                hint: 'Include the symptom, where to look, what the expected behavior is, and mention testing.',
                idealAnswer: 'Fix the crash on the checkout page when users apply a discount code. The issue is in src/utils/discountCalculator.ts — the calculateDiscount() function throws when the discount percentage is 100% (division by zero). Expected behavior: 100% discount should set the total to $0.00 without crashing. Also handle edge cases: negative discount values, discount > 100%, and empty discount code. Add unit tests in src/utils/__tests__/discountCalculator.test.ts covering these edge cases.'
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
              },
              {
                id: 'ex-capabilities-2',
                type: 'prompt-writing',
                question: 'Write a prompt asking Devin to set up a CI/CD pipeline for a React project. Include what checks should run and what tools to use.',
                hint: 'Think about linting, testing, building, and deployment. Mention the CI platform and specific commands.',
                idealAnswer: 'Set up a GitHub Actions CI/CD pipeline in .github/workflows/ci.yml for our React project. The pipeline should:\n1. Trigger on push to main and on pull requests\n2. Run npm install, then npm run lint (ESLint), npm run typecheck (TypeScript), and npm test (Jest)\n3. Build the project with npm run build\n4. If on main branch and all checks pass, deploy to Vercel using the existing VERCEL_TOKEN secret\nUse Node.js 20 and cache npm dependencies for faster runs.'
              },
              {
                id: 'ex-capabilities-3',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'You inherited a legacy codebase with no documentation. The README is empty, there are no comments in the code, and new team members struggle to understand the project structure. You want Devin to help.',
                hint: 'Think about what kind of documentation would be most useful and what Devin should analyze to create it.',
                idealAnswer: 'Analyze this codebase and create comprehensive documentation:\n1. Generate a README.md with: project overview, tech stack, setup instructions (based on package.json scripts), and architecture overview\n2. Create a CONTRIBUTING.md with development workflow, coding conventions (infer from existing code patterns), and PR guidelines\n3. Add JSDoc comments to all exported functions in src/services/ and src/utils/\n4. Create an ARCHITECTURE.md documenting the folder structure, key modules, and data flow between components\nBase everything on the actual code — don\'t make assumptions.'
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
                'Devin IDE \u2014 browse and edit code directly in the browser',
                'Timeline \u2014 see a structured log of Devin\'s actions and decisions',
                'Shell/Editor/Browser tabs \u2014 inspect Devin\'s development environment',
                'Session List \u2014 manage multiple concurrent sessions',
                'Settings \u2014 configure repos, secrets, environment, and integrations'
              ]},
              { type: 'heading', value: 'Ask Mode vs Agent Mode' },
              { type: 'text', value: 'When you start a new session, you\'ll see two primary modes: Ask and Agent. Unless you already have a fully scoped plan, start with Ask to explore and plan, then move to Agent to execute.' },
              { type: 'list', value: 'Ask Mode:', items: [
                'Lightweight mode for exploring your codebase and planning tasks',
                'Uses advanced code search to produce detailed, well-cited answers',
                'Can scope and plan work before implementation',
                'Generates context-rich prompts you can send to Agent mode',
                'Can be triggered from the main page or from a DeepWiki page'
              ]},
              { type: 'list', value: 'Agent Mode:', items: [
                'Full autonomous mode \u2014 Devin writes code, runs commands, browses the web',
                'Use when you\'re ready to implement features, fix bugs, create PRs',
                'Select a repository and an agent (Default Devin, Fast Mode, or Dana for data)',
                'Can be started from Ask mode after planning, or directly from the main page'
              ]},
              { type: 'callout', value: 'Recommended workflow: Start with Ask to scope the problem \u2192 Build a Devin Prompt from your Ask session \u2192 Click "Send to Devin" to execute in Agent mode.', variant: 'tip' },
              { type: 'heading', value: 'Using @ Mentions' },
              { type: 'text', value: 'Use @ mentions to give Devin specific context. Type @ in the chat input to see available options:' },
              { type: 'list', value: '@ Mention Types:', items: [
                '@Repos \u2014 Reference a specific repository',
                '@Files \u2014 Reference a specific file in your codebase',
                '@Macros \u2014 Reference a Knowledge entry by its macro',
                '@Playbooks \u2014 Reference a reusable playbook template',
                '@Skills \u2014 Reference a SKILL.md file in your repo',
                '@Secrets \u2014 Reference a stored secret (API keys, credentials)',
                '@Sessions \u2014 Reference a previous Devin session for context'
              ]},
              { type: 'heading', value: 'Selecting a Repository & Agent' },
              { type: 'text', value: 'When starting an Agent session, select the repository you want Devin to work with. This ensures Devin has access to your code, uses the correct branch, and creates PRs to the right repo.' },
              { type: 'list', value: 'Available Agents:', items: [
                'Devin (default) \u2014 General-purpose AI software engineer for most tasks',
                'Fast Mode \u2014 Optimized for quick, well-scoped tasks',
                'Dana \u2014 Data analyst agent for querying databases and creating visualizations'
              ]},
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
              },
              {
                id: 'ex-interface-ask-agent',
                type: 'multiple-choice',
                question: 'You want to understand how the authentication system works before making changes. Which mode should you use?',
                options: [
                  'Agent Mode \u2014 have Devin start implementing immediately',
                  'Ask Mode \u2014 explore the codebase and understand the auth flow first',
                  'Start a child session',
                  'Read the code yourself without Devin'
                ],
                correctOption: 1,
                explanation: 'Ask Mode is designed for exploring and understanding your codebase. Use it to scope the problem, then send a well-informed prompt to Agent Mode for implementation.'
              },
              {
                id: 'ex-interface-mentions',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'You want Devin to fix a bug in your authentication module. You have a playbook called "bug-fix-flow" and the relevant file is src/auth/middleware.ts. You also want to reference a previous session where a similar bug was fixed. Write the prompt using @ mentions.',
                hint: 'Use @Playbooks, @Files, and @Sessions to give Devin rich context.',
                idealAnswer: 'Fix the session expiry bug in @Files src/auth/middleware.ts. Follow the @Playbooks bug-fix-flow playbook for our standard bug fix process. For reference, a similar session timeout bug was fixed in @Sessions [previous-session-id]. The issue is that expired tokens are not being rejected \u2014 the middleware should return 401 for tokens older than 24 hours. Add tests to cover: valid token, expired token, and malformed token.'
              },
              {
                id: 'ex-interface-2',
                type: 'prompt-writing',
                question: 'You just started a new Devin session for a React project. Write the initial setup message you would send, including context about the repo and what you want Devin to work on.',
                hint: 'Think about what Devin needs to know upfront: the repo, the tech stack, the specific task, and any conventions.',
                idealAnswer: 'This is a React 18 + TypeScript project using Tailwind CSS for styling. The repo is organized with components in src/components/, pages in src/pages/, and API utilities in src/lib/api.ts.\n\nTask: Add a user profile page at /profile that shows the currently logged-in user\'s information. Fetch user data from the GET /api/me endpoint (already implemented in the backend). Display: avatar, name, email, and join date. Follow the same page layout pattern used in src/pages/Dashboard.tsx. Add a loading skeleton while data fetches.'
              },
              {
                id: 'ex-interface-3',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'You\'re watching Devin work via the Desktop tab. You notice it\'s installing a different CSS framework (Bootstrap) instead of using Tailwind CSS, which your project uses. Devin is already 5 minutes into the session. You need to redirect it without starting over.',
                hint: 'Be specific about what to stop doing, what to use instead, and point to existing examples.',
                idealAnswer: 'Stop \u2014 please don\'t use Bootstrap. Our project uses Tailwind CSS. Please:\n1. Remove the Bootstrap dependency you just installed (npm uninstall bootstrap react-bootstrap)\n2. Redo the component styling using Tailwind utility classes\n3. Look at src/components/Card.tsx and src/components/Button.tsx for examples of our Tailwind styling patterns\n4. Use our custom color tokens defined in tailwind.config.js (e.g., primary-500, gray-100)'
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
              { type: 'heading', value: 'Good vs Bad Instructions (from Official Docs)' },
              { type: 'text', value: 'The official Devin documentation provides clear examples of effective vs ineffective instructions:' },
              { type: 'comparison', value: 'API Endpoint', good: 'Create a new REST API endpoint POST /api/v1/reports that generates a PDF report. Use the existing ReportService in src/services/reports.ts. Accept { startDate, endDate, format } in the request body. Validate with Zod. Return the PDF as a binary stream with Content-Type: application/pdf. Reference the existing GET /api/v1/invoices endpoint for the response pattern.', bad: 'Add a reports endpoint', goodExplanation: 'Specifies HTTP method, path, service to use, request/response format, validation, and reference pattern', badExplanation: 'Devin has no idea what kind of reports, what format, or what the endpoint should accept/return' },
              { type: 'comparison', value: 'Unit Tests', good: 'Write unit tests for the calculateShipping() function in src/utils/shipping.ts. Cover these cases: domestic standard (should be $5.99), domestic express ($12.99), international ($24.99), free shipping for orders over $100, and invalid country code (should throw). Use the existing test patterns in src/utils/__tests__/pricing.test.ts.', bad: 'Add tests for shipping', goodExplanation: 'Specifies the exact function, test cases with expected values, and points to an existing test file as a pattern', badExplanation: 'Which shipping code? What should be tested? What are the expected results?' },
              { type: 'comparison', value: 'Migration Task', good: 'Migrate the UserProfile component from class-based to functional React using hooks. File: src/components/UserProfile.tsx. Convert lifecycle methods: componentDidMount \u2192 useEffect, this.state \u2192 useState. Keep the same prop interface. The component should render identically \u2014 run the existing snapshot tests to verify.', bad: 'Convert the user profile to hooks', goodExplanation: 'Specifies the file, exact conversions needed, what to preserve, and how to verify', badExplanation: 'Which component? What specific conversions? How to verify it still works?' },
              { type: 'heading', value: 'Common Prompting Mistakes' },
              { type: 'list', value: 'Avoid these:', items: [
                'Being too vague ("make it better")',
                'Assuming Devin knows your preferences without stating them',
                'Giving multiple unrelated tasks in one prompt',
                'Not specifying which files or modules to work with',
                'Forgetting to mention testing requirements',
                'Not referencing existing code patterns for Devin to follow',
                'Skipping success criteria \u2014 what does "done" look like?'
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
              },
              {
                id: 'ex-prompting-3',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Your mobile app\'s API returns user data that includes sensitive fields (SSN, credit card numbers) in every response. You need Devin to add field-level filtering so the API only returns fields the client needs.',
                hint: 'Think about where the filtering should happen, what fields to allow/block, and how to make it configurable.',
                idealAnswer: 'Add response field filtering to our user API endpoints in src/routes/users.ts. Currently, the GET /api/users and GET /api/users/:id endpoints return all database fields including sensitive ones.\n\n1. Create a field filter middleware in src/middleware/fieldFilter.ts that accepts a whitelist of allowed fields per endpoint\n2. Remove these fields from ALL user responses: ssn, credit_card_number, bank_account\n3. Add a ?fields= query parameter to let clients request specific fields (e.g., ?fields=name,email,avatar)\n4. Default allowed fields: id, name, email, avatar, created_at, role\n5. Add tests to verify sensitive fields are never leaked, even if explicitly requested via ?fields='
              },
              {
                id: 'ex-prompting-4',
                type: 'prompt-writing',
                question: 'Rewrite this bad prompt into a great one: "Add error handling to the app"',
                hint: 'Think about: what kind of errors, where in the app, how errors should be displayed, and what the user experience should be.',
                idealAnswer: 'Add a global error boundary and error handling to our React app:\n1. Create an ErrorBoundary component in src/components/ErrorBoundary.tsx that catches React rendering errors and shows a friendly "Something went wrong" page with a "Reload" button\n2. Wrap the app\'s router in App.tsx with this ErrorBoundary\n3. Add error handling to all API calls in src/lib/api.ts: catch network errors, 401 (redirect to /login), 403 (show "Access Denied"), 404 (show "Not Found"), and 5xx (show "Server Error" with retry button)\n4. Create a toast notification system in src/components/Toast.tsx for non-critical errors\n5. Follow the existing UI patterns in src/components/Alert.tsx for styling'
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
                '1. Scope with Ask Mode \u2014 explore the codebase and plan the approach',
                '2. Build a Devin Prompt from your Ask session with rich context',
                '3. Send to Agent Mode to execute the plan',
                '4. Monitor progress and provide feedback early',
                '5. Review the PR when Devin creates it',
                '6. Leave comments on the PR for any changes needed',
                '7. Let Devin Review + Auto-Fix iterate on feedback automatically'
              ]},
              { type: 'heading', value: 'First-Time Prompt Ideas' },
              { type: 'text', value: 'Not sure where to start? The official Devin docs recommend these first tasks:' },
              { type: 'list', value: 'Great starter tasks:', items: [
                'Add a new API endpoint \u2014 reference an existing endpoint as a pattern',
                'Small frontend features \u2014 add a dropdown, form field, or UI component',
                'Write unit tests \u2014 target a specific file and set a coverage goal',
                'Migrate/refactor code \u2014 e.g., convert a JS file to TypeScript',
                'Create a quick PR \u2014 small, focused code changes'
              ]},
              { type: 'heading', value: 'Pre-Task Checklist (from Official Docs)' },
              { type: 'text', value: 'Before assigning a task, ask yourself:' },
              { type: 'list', value: 'Evaluate your task:', items: [
                'Can I describe clear success criteria? (tests passing, CI green, matching a pattern)',
                'Is there enough context? (relevant files, patterns, docs, examples)',
                'Would breaking this down help? (split large projects into focused sessions)',
                'Can Devin validate its own work? (test suites, lint checks, browser testing)'
              ]},
              { type: 'heading', value: 'Providing Feedback' },
              { type: 'text', value: 'You can guide Devin during a session by sending messages in the chat. You can also leave comments directly on the pull request \u2014 Devin will read and act on them.' },
              { type: 'callout', value: 'Devin works best with specific, actionable feedback. Instead of "this doesn\'t look right," try "the button color should be blue-500 instead of blue-700, and add 8px of padding."', variant: 'tip' },
              { type: 'heading', value: 'Setting Up Your Repo' },
              { type: 'text', value: 'Setting up Devin\'s environment correctly will significantly improve performance. Think of it as setting up Devin\'s laptop on its first day of work.' },
              { type: 'list', value: 'Repo Setup Steps (from Devin\'s Machine settings):', items: [
                'Git Pull \u2014 command to pull latest changes at session start',
                'Configure Secrets \u2014 API keys, tokens, environment variables',
                'Install Dependencies \u2014 one-time setup commands',
                'Maintain Dependencies \u2014 commands that run each session (npm install, etc.)',
                'Set up Lint \u2014 lint/syntax check commands Devin runs before committing',
                'Set up Tests \u2014 test commands Devin runs before committing',
                'Run Local App \u2014 how to start the app locally for testing',
                'Additional Notes \u2014 any extra instructions for Devin'
              ]},
              { type: 'callout', value: 'Imagine if every time you started a task, your laptop and part of your memory were wiped \u2014 that\'s what happens to Devin with an incorrect or incomplete setup!', variant: 'warning' },
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
                id: 'ex-assigning-scope',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'You want to add a new API endpoint to your project. Before starting, you want to use Ask mode to scope the work, then send it to Agent mode. Write what you would type in Ask mode first.',
                hint: 'In Ask mode, ask exploratory questions about existing patterns. Then describe how you would transition to Agent mode.',
                idealAnswer: 'Ask Mode: "How are API endpoints structured in this project? Show me an example of an existing endpoint with its route, controller, validation, and tests. Also, what authentication middleware is used and how is it applied?"\n\nAfter reviewing the answer, I would click "Build a Devin Prompt" and add: "Create a new GET /api/reports endpoint following the same pattern as the /api/users endpoint you showed me. Include request validation with Zod, auth middleware, and tests. Return paginated results with cursor-based pagination."'
              },
              {
                id: 'ex-assigning-2',
                type: 'prompt-writing',
                question: 'You notice Devin used the wrong CSS framework in its implementation. Write a feedback message to correct this.',
                hint: 'Be specific about what was used vs. what should be used, and point to examples.',
                idealAnswer: 'Please use Tailwind CSS classes instead of inline styles. Our project uses Tailwind throughout \u2014 see src/components/Button.tsx for an example of our styling conventions. Replace the inline style={{ padding: "8px 16px" }} with className="px-4 py-2" and similarly for all other inline styles in the new components.'
              },
              {
                id: 'ex-assigning-3',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Your product manager just assigned you a Jira ticket: "As a user, I want to receive email notifications when someone comments on my post." Your backend already has an email service and a comments API. You want to delegate this to Devin.',
                hint: 'Include the full context: what exists already, where the code lives, what the notification should contain, and edge cases.',
                idealAnswer: 'Implement email notifications for post comments.\n\nContext: When a user comments on a post (POST /api/posts/:id/comments in src/routes/comments.ts), send an email notification to the post author.\n\nRequirements:\n1. Use the existing email service in src/services/email.ts (sendEmail function)\n2. Email template: Subject "[PostTitle] - New comment from [CommenterName]", body should include the comment text and a link to the post\n3. Don\'t send notification if the commenter is the post author\n4. Don\'t send if the post author has notifications disabled (check user.preferences.emailNotifications in the User model)\n5. Send asynchronously \u2014 don\'t block the comment API response\n6. Add tests covering: notification sent, self-comment skipped, notifications disabled, email service failure handled gracefully'
              },
              {
                id: 'ex-assigning-4',
                type: 'prompt-writing',
                question: 'Write a prompt for Devin to review your PR before a human reviewer sees it. What should Devin check for?',
                hint: 'Think about code quality, security, performance, and consistency with project conventions.',
                idealAnswer: 'Review PR #42 on our repo. Check for:\n1. Security issues: exposed secrets, SQL injection, XSS vulnerabilities, missing auth checks\n2. Performance: N+1 queries, missing database indexes, unnecessary re-renders in React components\n3. Code quality: unused imports, duplicate code, functions over 50 lines, missing error handling\n4. Convention compliance: does it follow the patterns in our existing codebase? Check naming conventions, file organization, and TypeScript types (no \'any\' types)\n5. Test coverage: are all new functions tested? Are edge cases covered?\n6. Leave specific comments on any issues found, with suggestions for fixes.'
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
              { type: 'heading', value: 'Interactive Planning (from Official Docs)' },
              { type: 'text', value: 'For complex tasks, use Devin\'s Interactive Planning feature. This creates a structured workflow where Devin proposes a plan and waits for your approval before executing.' },
              { type: 'list', value: 'Planning phases:', items: [
                'Initial Assessment \u2014 Devin analyzes the task, identifies affected files, and suggests an approach',
                'Detailed Plan \u2014 Devin creates a step-by-step implementation plan with specific files and changes',
                'Approval Gate \u2014 You review the plan, suggest modifications, or approve it',
                'Execution \u2014 Devin follows the approved plan, checking off each step'
              ]},
              { type: 'callout', value: 'To use Interactive Planning, add "Please create a plan and wait for my approval before implementing" to your prompt. This is especially valuable for complex tasks where the approach matters.', variant: 'tip' },
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
              },
              {
                id: 'ex-breakdown-2',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Your company wants to add a full-text search feature across products, blog posts, and user profiles. This is too complex for a single session. Write the prompt for the FIRST session only \u2014 the foundational setup.',
                hint: 'Focus on infrastructure first. What search technology to use, how to index data, and a simple proof-of-concept.',
                idealAnswer: 'Set up the search infrastructure for our application.\n\n1. Install and configure Elasticsearch (or use the existing Docker setup in docker-compose.yml \u2014 add an Elasticsearch service)\n2. Create a search service in src/services/search.ts with:\n   - initializeIndex(indexName, mapping) function\n   - indexDocument(indexName, id, doc) function\n   - search(indexName, query, options) function\n3. Create an index mapping for products as a proof-of-concept with fields: name (text), description (text), category (keyword), price (float)\n4. Add a one-time migration script in scripts/reindex-products.ts that reads all products from the database and indexes them in Elasticsearch\n5. Add a basic GET /api/search?q=query endpoint in src/routes/search.ts that searches the products index\n6. Tests: verify indexing a document and searching for it returns results'
              },
              {
                id: 'ex-breakdown-3',
                type: 'prompt-writing',
                question: 'Your team wants to migrate from REST to GraphQL. Write session prompts for the first 2 of 4 planned sessions.',
                hint: 'Think about what needs to come first: schema setup and one working query, before migrating all endpoints.',
                idealAnswer: 'Session 1 \u2014 GraphQL Foundation:\nSet up Apollo Server in our Express app. Add apollo-server-express to package.json. Create the GraphQL entry point in src/graphql/index.ts. Define the User type and a basic Query { me: User } that returns the authenticated user. Mount the GraphQL endpoint at /graphql. Add the Apollo Playground for development. Keep all existing REST endpoints working \u2014 this is additive, not a replacement yet. Test the /graphql endpoint with a simple query.\n\nSession 2 \u2014 Core Queries:\nMigrate the 3 most-used REST endpoints to GraphQL resolvers:\n1. GET /api/users \u2192 Query { users(limit, offset): [User] }\n2. GET /api/posts \u2192 Query { posts(limit, cursor): PostConnection }\n3. GET /api/posts/:id \u2192 Query { post(id): Post }\nPut resolvers in src/graphql/resolvers/ and type definitions in src/graphql/typeDefs/. Reuse existing service layer functions from src/services/ \u2014 don\'t duplicate database logic.'
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
              { type: 'heading', value: 'Using Devin Search for Investigation' },
              { type: 'text', value: 'Before debugging, use Devin Search (Ask mode) to understand the codebase context. Devin Search provides rapid, well-cited answers about how things work, making it easier to identify root causes.' },
              { type: 'callout', value: 'Try asking in Ask mode: "How does the authentication middleware work?" or "What files are involved in the payment flow?" Devin Search will give you a detailed, cited answer you can use to write better debugging prompts.', variant: 'tip' },
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
              { type: 'heading', value: 'Devin Review & Auto-Fix' },
              { type: 'text', value: 'Devin Review automatically reviews PRs created by both humans and Devin. It catches issues early and can even auto-fix problems:' },
              { type: 'list', value: 'Devin Review features:', items: [
                'Automated code review on every PR',
                'Auto-Fix mode \u2014 Devin can automatically fix issues it finds in its own PRs',
                'Structured feedback with specific file and line references',
                'Configurable rules and review criteria'
              ]},
              { type: 'callout', value: 'Enable Devin Review on your repo to catch issues before human reviewers see the PR. With Auto-Fix enabled, Devin will automatically address its own review comments.', variant: 'info' },
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
              },
              {
                id: 'ex-debug-3',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Devin created a PR that adds a new API endpoint. The endpoint works in manual testing, but the automated tests are failing with "ECONNREFUSED" errors. You suspect the test setup isn\'t starting the test server properly.',
                hint: 'Include the error, where tests are configured, what you think the root cause is, and what to check.',
                idealAnswer: 'The new tests in src/routes/__tests__/preferences.test.ts are failing with "ECONNREFUSED 127.0.0.1:3000". The endpoint works fine when tested manually.\n\nI think the issue is that the test file is not using our test setup correctly. Please:\n1. Check src/test/setup.ts \u2014 we use a beforeAll() that starts a test server on a random port\n2. Make sure the new test file imports and uses the test setup helper from src/test/helpers.ts (see src/routes/__tests__/users.test.ts for the correct pattern)\n3. The test should use the testClient helper instead of hardcoded localhost:3000\n4. Run the test suite to verify all tests pass: npm test -- --testPathPattern=preferences'
              },
              {
                id: 'ex-debug-4',
                type: 'prompt-writing',
                question: 'Devin\'s implementation has a subtle bug: the search results page shows stale data after the user updates a record. Write a debugging prompt that helps Devin fix the caching issue.',
                hint: 'Identify the symptom, the likely cause (caching), and what the fix should be.',
                idealAnswer: 'There\'s a stale data bug on the search results page (src/pages/SearchResults.tsx). When a user edits a record and goes back to search results, the old data still shows until a hard refresh.\n\nLikely cause: The search results are cached by React Query in src/hooks/useSearch.ts with a staleTime of Infinity. After mutations in src/hooks/useRecords.ts, the search cache isn\'t being invalidated.\n\nFix: In the updateRecord mutation\'s onSuccess callback in src/hooks/useRecords.ts, add queryClient.invalidateQueries({ queryKey: [\'search\'] }) to bust the search cache. Also reduce staleTime from Infinity to 30000 (30 seconds) as a safety net. Add a test that verifies search results update after a record mutation.'
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
              { type: 'heading', value: 'Using Session Analysis for Learning' },
              { type: 'text', value: 'After each session, Devin can analyze what went well and what could be improved. Use this to refine your prompting style over time.' },
              { type: 'list', value: 'Post-session learning:', items: [
                'Review the session timeline to understand Devin\'s thought process',
                'Note where Devin needed extra guidance \u2014 next time, include that context upfront',
                'Save effective prompts as Knowledge entries or playbooks for reuse',
                'Use "Improve Playbook" to have Devin refine playbooks based on session results'
              ]},
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
              },
              {
                id: 'ex-iterate-2',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Devin built a data table component. It works, but: (1) the column widths are uneven, (2) there\'s no loading state, (3) clicking a row should navigate to the detail page but it doesn\'t, and (4) the empty state just shows a blank area. You want to iterate without starting over.',
                hint: 'Number each change clearly and reference existing components for consistency.',
                idealAnswer: 'The DataTable component in src/components/DataTable.tsx needs these 4 improvements:\n\n1. Column widths: Set explicit widths \u2014 Name (30%), Email (25%), Role (15%), Status (15%), Actions (15%). Use the same table layout pattern as src/components/UserTable.tsx\n2. Loading state: Add a skeleton loader while data is fetching. Use 5 rows of animated placeholder bars matching the column widths. See src/components/Skeleton.tsx for our skeleton component.\n3. Row click: Make each row clickable \u2014 clicking should navigate to /records/{id} using react-router\'s useNavigate(). Add cursor-pointer and hover:bg-gray-50 styles.\n4. Empty state: When data is empty, show our EmptyState component from src/components/EmptyState.tsx with message "No records found" and a "Create Record" CTA button.'
              },
              {
                id: 'ex-iterate-3',
                type: 'prompt-writing',
                question: 'Devin created a login form but forgot to add: password visibility toggle, "remember me" checkbox, and a "forgot password" link. Write a concise iteration prompt with all three changes.',
                hint: 'Reference specific components and explain where each element should go in the form.',
                idealAnswer: 'Please add these 3 items to the login form in src/pages/Login.tsx:\n\n1. Password visibility toggle: Add an eye icon button (use the Eye/EyeOff icons from lucide-react) inside the password input field. Clicking it should toggle between type="password" and type="text".\n2. "Remember me" checkbox: Add below the password field using our existing Checkbox component from src/components/ui/Checkbox.tsx. When checked, store the auth token in localStorage instead of sessionStorage.\n3. "Forgot password?" link: Add below the remember-me checkbox, right-aligned. Link to /forgot-password. Style with text-sm text-blue-600 hover:underline.'
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
              { type: 'heading', value: 'Environment Configuration (Machine Settings)' },
              { type: 'text', value: 'The environment config tells Devin how to set up the development environment. Think of it as Devin\'s laptop setup. The official docs break it into these sections:' },
              { type: 'list', value: 'Machine Settings (from Settings > Machine):', items: [
                'Git Pull \u2014 how to get latest code (runs at session start)',
                'Install Dependencies \u2014 one-time setup commands (initialize)',
                'Maintain Dependencies \u2014 recurring commands each session (maintenance)',
                'Lint \u2014 commands to check code quality before committing',
                'Tests \u2014 commands to run tests before creating PRs',
                'Run Local App \u2014 how to start the dev server for testing',
                'Additional Notes \u2014 any extra context or instructions'
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
              },
              {
                id: 'ex-project-2',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'You just joined a new company and need to set up a Next.js project from scratch for your team. You want Devin to bootstrap the entire project with your team\'s preferred tools and conventions.',
                hint: 'Be specific about the tech stack, folder structure, linting rules, and initial pages.',
                idealAnswer: 'Create a new Next.js 14 project with the App Router. Set up the following:\n\nTech stack: TypeScript, Tailwind CSS, Prisma (PostgreSQL), NextAuth.js for auth, Zod for validation\n\nFolder structure:\n- app/ (Next.js App Router pages)\n- components/ui/ (reusable UI components)\n- lib/ (utilities, database client, auth config)\n- services/ (business logic)\n- types/ (shared TypeScript types)\n\nInitial setup:\n1. Configure ESLint with @typescript-eslint and Prettier\n2. Add a Dockerfile and docker-compose.yml with PostgreSQL\n3. Set up Prisma with an initial User model (id, email, name, role, createdAt)\n4. Create a basic layout with header, sidebar, and main content area\n5. Add a landing page, login page, and dashboard page\n6. Configure CI with GitHub Actions (lint, typecheck, build)\n7. Add a README with setup instructions'
              },
              {
                id: 'ex-project-3',
                type: 'prompt-writing',
                question: 'Write an environment configuration (initialize + maintenance sections) for a Python FastAPI project that uses Poetry and PostgreSQL.',
                hint: 'Think about what tools need to be installed once vs. what runs every session.',
                idealAnswer: 'initialize: |\n  curl -sSL https://install.python-poetry.org | python3 -\n  sudo apt-get update && sudo apt-get install -y postgresql-client\n\nmaintenance: |\n  poetry install\n  poetry run alembic upgrade head\n\nknowledge:\n  - name: lint\n    contents: poetry run ruff check . && poetry run mypy src/\n  - name: test\n    contents: poetry run pytest -v\n  - name: startup\n    contents: poetry run uvicorn src.main:app --reload --port 8000'
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
              { type: 'heading', value: 'Managed Devins (from Official Docs)' },
              { type: 'text', value: 'Managed Devins allow a coordinator Devin to create and manage child sessions, monitor their progress, and aggregate results. This is the most powerful parallelization pattern.' },
              { type: 'list', value: 'Managed Devin capabilities:', items: [
                'Coordinator creates child sessions with specific tasks and playbooks',
                'Monitor progress of all child sessions from the parent',
                'Aggregate results and merge changes systematically',
                'Use batch operations for repetitive tasks across many files/repos'
              ]},
              { type: 'code', value: '// Example: Using child sessions for batch migrations\n// Parent session prompt:\n"Migrate these 5 API endpoints from Express to Fastify.\nCreate a child session for each endpoint:\n1. GET /api/users -> child session 1\n2. POST /api/users -> child session 2\n3. GET /api/posts -> child session 3\n4. POST /api/posts -> child session 4\n5. GET /api/comments -> child session 5\nEach session should follow the migration pattern in MIGRATION_GUIDE.md."' },
              { type: 'callout', value: 'When using parallel sessions, make sure the tasks are truly independent. If session B depends on the output of session A, run them sequentially.', variant: 'warning' },
              { type: 'heading', value: 'Scheduled Sessions' },
              { type: 'text', value: 'You can schedule recurring Devin sessions for maintenance tasks. Set these up in the Devin webapp under Settings > Schedules:' },
              { type: 'list', value: 'Scheduled session use cases:', items: [
                'Weekly dependency updates and security patches',
                'Daily or weekly code quality scans',
                'Automated test coverage reports',
                'Regular documentation updates from code changes',
                'Stale branch cleanup and repository maintenance'
              ]},
            ],
            exercises: [
              {
                id: 'ex-parallel-1',
                type: 'prompt-writing',
                question: 'You need to add internationalization (i18n) to 10 pages of your app. Design a parallelization strategy using Devin sessions.',
                hint: 'Think about what can be done in parallel vs. what needs to be sequential.',
                idealAnswer: 'Session 1 (Sequential - do this first): Set up the i18n infrastructure. Install react-i18next, create the i18n config in src/lib/i18n.ts, set up the language detection and fallback logic, and create the translation file structure (src/locales/en/, src/locales/es/). Create a sample translation for the Home page as a reference pattern.\n\nSessions 2-6 (Parallel - after session 1 completes): Each session takes 2 pages and extracts all hardcoded strings into translation keys, following the pattern established in session 1.\n\nSession 7 (Sequential - after 2-6 complete): Add the language switcher component to the header, integrate all translations, and run the full test suite to verify nothing broke.'
              },
              {
                id: 'ex-parallel-2',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Your startup needs to launch in 2 days. You have 4 critical features left to build: (1) Stripe payment integration, (2) email verification flow, (3) admin dashboard, and (4) user onboarding tour. You want to parallelize as much as possible.',
                hint: 'Think about dependencies between features. Which features can be built independently? Which ones depend on each other?',
                idealAnswer: 'Here\'s my parallelization plan for 4 features:\n\nWave 1 (run simultaneously):\n\nSession A \u2014 Stripe Payment:\nIntegrate Stripe Checkout in src/services/payment.ts. Add POST /api/checkout/session to create a Checkout session, and POST /api/webhooks/stripe to handle payment.succeeded events. Use the existing STRIPE_SECRET_KEY secret. Add a pricing page at /pricing with 3 plan tiers. Store subscription status in the users table (add a plan column).\n\nSession B \u2014 Email Verification:\nAdd email verification flow. On signup, send a verification email with a unique token (store in email_verifications table). Add GET /api/verify-email?token=xxx endpoint. Block unverified users from accessing protected routes. Use the existing email service in src/services/email.ts.\n\nSession C \u2014 Admin Dashboard:\nCreate an admin dashboard at /admin (guard with role === "admin" check). Show: total users, revenue chart (mock data for now), recent signups table, and active subscriptions count. Follow existing page patterns in src/pages/.\n\nWave 2 (after Wave 1 merges):\n\nSession D \u2014 Onboarding Tour:\nAdd a guided onboarding tour using react-joyride for new users. Steps: welcome modal, highlight sidebar nav, show how to create first project, point to settings. Store completion status in user.preferences.onboardingCompleted. Only show for users who signed up in the last 24 hours.'
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
              { type: 'heading', value: 'Knowledge Management (from Official Docs)' },
              { type: 'text', value: 'Devin\'s Knowledge system stores important context that persists across sessions. Effective knowledge management is key to autonomy.' },
              { type: 'list', value: 'Knowledge features:', items: [
                'Trigger Description \u2014 tells Devin when to use this knowledge (e.g., "when working on auth")',
                'Macro \u2014 a short @-mentionable alias (e.g., @auth-guide) for quick reference',
                'Content \u2014 the actual knowledge, instructions, or context',
                'Pinned Knowledge \u2014 always loaded at session start, no trigger needed',
                'Organization-wide \u2014 shared across all repos and team members'
              ]},
              { type: 'callout', value: 'Knowledge entries with good trigger descriptions fire automatically when relevant. Pinned knowledge is always active. Use macros (@my-macro) for on-demand access.', variant: 'tip' },
              { type: 'heading', value: 'Playbooks for Repeatable Workflows' },
              { type: 'text', value: 'Playbooks are reusable task templates that standardize how Devin handles common tasks. They\'re like runbooks for your AI engineer.' },
              { type: 'list', value: 'Playbook best practices:', items: [
                'Create playbooks for tasks you delegate frequently (new endpoints, bug fixes, migrations)',
                'Use "Improve Playbook" after sessions to refine based on what worked',
                'Reference playbooks with @Playbooks in your prompts',
                'Share playbooks across your team for consistent results',
                'Include acceptance criteria and quality checks in the playbook'
              ]},
              { type: 'heading', value: 'Prerequisites for High Autonomy' },
              { type: 'text', value: 'To let Devin work with minimal supervision, you need:' },
              { type: 'list', value: 'Autonomy checklist:', items: [
                'Comprehensive CI pipeline (lint, test, type-check, build)',
                'Well-documented codebase with clear conventions',
                'SKILL.md files capturing project-specific knowledge',
                'Environment config with all necessary setup steps',
                'Secrets properly configured in Devin settings',
                'Playbooks for common task patterns',
                'Knowledge entries for project conventions and gotchas',
                'Devin Review enabled for automated PR review'
              ]},
              { type: 'heading', value: 'Quality Guardrails' },
              { type: 'text', value: 'Autonomy doesn\'t mean no oversight. Set up automated guardrails:' },
              { type: 'list', value: 'Guardrails:', items: [
                'CI checks that must pass before merging',
                'Devin Review for automated PR review with Auto-Fix',
                'Required reviewers on the repository',
                'Branch protection rules',
                'Test coverage thresholds',
                'Knowledge entries that enforce project conventions'
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
              },
              {
                id: 'ex-autonomy-knowledge',
                type: 'prompt-writing',
                question: 'Write a Knowledge entry for Devin that covers your project\'s authentication conventions. Include a trigger description and macro name.',
                hint: 'Think about: when should this knowledge fire automatically, what conventions should Devin follow, and what the macro should be called.',
                idealAnswer: 'Trigger: When working on authentication, login, signup, session management, or JWT tokens\nMacro: @auth-conventions\n\nContent:\n- All auth logic lives in src/auth/ directory\n- Use jsonwebtoken library for JWT \u2014 never use other JWT libraries\n- Access tokens expire after 15 minutes, refresh tokens after 7 days\n- Store tokens in httpOnly cookies, never localStorage\n- Auth middleware is in src/auth/middleware.ts \u2014 apply to all protected routes\n- Password hashing uses bcrypt with 12 salt rounds\n- Rate limit login attempts to 5 per minute per IP\n- All auth endpoints need integration tests in src/auth/__tests__/'
              },
              {
                id: 'ex-autonomy-integration',
                type: 'multiple-choice',
                question: 'Which integration allows you to start Devin sessions directly from your project management tool?',
                options: [
                  'GitHub Actions',
                  'Slack, Linear, or Jira integrations',
                  'Docker',
                  'VS Code extension'
                ],
                correctOption: 1,
                explanation: 'Devin integrates natively with Slack, Linear, and Jira. You can assign tickets to Devin, start sessions from Slack messages, or auto-trigger sessions when tickets are created.'
              },
              {
                id: 'ex-autonomy-2',
                type: 'prompt-writing',
                question: 'Write a Devin playbook for the recurring task of "adding a new API endpoint" in your Express/TypeScript project. The playbook should be reusable for any endpoint.',
                hint: 'Think about the standard steps: route file, controller, validation, tests, documentation. Use placeholders for specifics.',
                idealAnswer: 'Playbook: Add New API Endpoint\n\n1. Create the route file at src/routes/[resource].ts following the pattern in src/routes/users.ts\n2. Add request validation using Zod schemas in src/validators/[resource].ts\n3. Create the service layer in src/services/[resource].ts for business logic\n4. Add the route to the Express app in src/app.ts\n5. Write integration tests in src/routes/__tests__/[resource].test.ts covering: success case, validation errors (400), not found (404), and unauthorized (401)\n6. Add the endpoint to the API documentation in docs/api.md\n7. Run npm test and npm run lint before creating the PR\n\nConventions:\n- Use async/await error handling with the asyncHandler wrapper\n- Return responses in { data, meta } format\n- Use HTTP status codes consistently: 200 (get), 201 (create), 204 (delete)'
              },
              {
                id: 'ex-autonomy-3',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'You want to set up Devin to automatically handle incoming bug reports from Linear. When a bug is assigned to Devin, it should investigate the issue, attempt a fix, and create a PR. Write the playbook/instructions for how Devin should handle these.',
                hint: 'Think about the investigation steps, safety guardrails, and when Devin should ask for help vs. proceed autonomously.',
                idealAnswer: 'When a bug report is assigned:\n\n1. Read the bug description and identify: the symptom, affected page/endpoint, and reproduction steps\n2. Search the codebase for the relevant files mentioned in the report\n3. Try to reproduce the issue by running the relevant tests or starting the dev server\n4. Investigate the root cause \u2014 check recent commits, related code, and error logs\n5. Implement a fix following existing code patterns\n6. Add or update tests to cover the bug scenario (the test should fail without the fix)\n7. Run the full test suite to ensure no regressions\n8. Create a PR with: description of root cause, what was changed, and how it was tested\n\nGuardrails:\n- DO NOT modify database schemas without asking\n- DO NOT change public API contracts without asking\n- If the bug involves auth/security, flag it for human review before merging\n- If you can\'t reproduce after 10 minutes, comment on the Linear ticket asking for more info'
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
              },
              {
                id: 'ex-patterns-2',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Your team has a React component library with 30+ components. You need to add Storybook stories for 5 components that don\'t have them yet. Use the Reference-Based pattern to make this efficient.',
                hint: 'Point to an existing story as the reference pattern and specify exactly which components need stories.',
                idealAnswer: 'Add Storybook stories for these 5 components that are missing them:\n1. src/components/Badge.tsx\n2. src/components/Tooltip.tsx\n3. src/components/Modal.tsx\n4. src/components/Tabs.tsx\n5. src/components/Avatar.tsx\n\nReference pattern: Follow the exact structure of src/components/Button.stories.tsx, which demonstrates our conventions:\n- Default export with component metadata and argTypes\n- Individual named exports for each variant (Default, Primary, Disabled, etc.)\n- Use the decorators array for layout wrapping\n- Add JSDoc descriptions for each story\n\nFor each component:\n- Create a story file at src/components/[ComponentName].stories.tsx\n- Include stories for all visual variants and interactive states\n- Add controls for all configurable props\n- Include a "Playground" story with all controls enabled'
              },
              {
                id: 'ex-patterns-3',
                type: 'prompt-writing',
                question: 'Using the Acceptance Criteria pattern, write a prompt for adding a file upload feature to a web app.',
                hint: 'Define clear, testable acceptance criteria that leave no room for ambiguity.',
                idealAnswer: 'Implement file upload for user avatars in the profile settings page.\n\nAcceptance Criteria:\n- [ ] Upload button in src/pages/Settings.tsx accepts .jpg, .png, and .webp files only\n- [ ] Maximum file size is 5MB \u2014 show error toast for larger files\n- [ ] Image is previewed in a 128x128 circle before confirming upload\n- [ ] Upload to S3 via POST /api/upload endpoint in src/routes/upload.ts using the existing AWS SDK config in src/lib/aws.ts\n- [ ] Uploaded URL is saved to user.avatarUrl via PATCH /api/users/me\n- [ ] Old avatar is deleted from S3 when a new one is uploaded\n- [ ] Loading spinner shown during upload, button disabled\n- [ ] Tests: file too large, wrong format, successful upload, S3 error handling\n- [ ] No lint errors\n- [ ] PR description explains the implementation approach'
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
              { type: 'heading', value: 'Workflow 2: Integrations & Automation (from Official Docs)' },
              { type: 'text', value: 'Devin integrates natively with your existing tools. Use these integrations to create automated workflows:' },
              { type: 'list', value: 'Native integrations:', items: [
                'GitHub/GitLab \u2014 PR creation, code review, issue tracking',
                'Slack \u2014 Start sessions and get updates directly in Slack channels',
                'Linear \u2014 Auto-assign tickets to Devin, track progress in Linear',
                'Jira \u2014 Connect Jira tickets to Devin sessions',
                'MCP Servers \u2014 Connect external tools via the Model Context Protocol'
              ]},
              { type: 'heading', value: 'MCP Marketplace' },
              { type: 'text', value: 'The MCP (Model Context Protocol) Marketplace lets you extend Devin\'s capabilities with third-party tools and custom integrations:' },
              { type: 'list', value: 'MCP examples:', items: [
                'Database access \u2014 Query production data safely',
                'Monitoring tools \u2014 Check error rates, logs, and metrics',
                'Design tools \u2014 Reference Figma designs during implementation',
                'Custom APIs \u2014 Connect your internal tools and services',
                'Documentation \u2014 Access Confluence, Notion, or other knowledge bases'
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
                id: 'ex-workflow-mcp',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Your team uses Slack for communication, Linear for project management, and GitHub for code. You want to set up an automated workflow where bug reports in Linear automatically get assigned to Devin, and Devin posts updates in a Slack channel. Describe how you would configure this.',
                hint: 'Think about which integrations to enable and what the workflow looks like end-to-end.',
                idealAnswer: 'Integration Setup:\n1. Enable the Linear integration in Devin Settings > Integrations. Configure it to auto-assign tickets with the "devin" label to Devin.\n2. Enable the Slack integration and connect the #devin-updates channel for notifications.\n3. Enable GitHub integration for the target repo.\n\nWorkflow:\n- When a bug ticket is created in Linear with the "devin" label, Devin automatically starts a session\n- Devin reads the ticket description, investigates the bug using Ask mode first\n- Devin implements the fix in Agent mode and creates a PR\n- Devin posts a summary in #devin-updates with the PR link and what was fixed\n- Devin Review runs on the PR and Auto-Fix addresses any review comments\n- Team reviews and merges the PR, Linear ticket auto-closes'
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
              },
              {
                id: 'ex-workflow-3',
                type: 'scenario',
                question: 'Write the prompt you would give to Devin for this scenario.',
                scenario: 'Your SaaS app needs a complete onboarding flow for new users: welcome email, profile setup wizard, initial data import, and a guided product tour. Design the prompt for the profile setup wizard session.',
                hint: 'Focus on one piece of the flow. Define the wizard steps, data to collect, validation, and where it fits in the existing app.',
                idealAnswer: 'Build a multi-step profile setup wizard for new users.\n\nLocation: Create at src/pages/Onboarding.tsx, redirect to /onboarding after first login (check user.isOnboarded flag)\n\nWizard steps:\n1. "About You" \u2014 name, job title, company name, timezone (dropdown). All required.\n2. "Your Team" \u2014 invite team members via email (comma-separated). Optional, with "Skip" button.\n3. "Preferences" \u2014 theme (light/dark), default dashboard view (list/grid), email notification frequency (daily/weekly/never)\n4. "All Set!" \u2014 summary of choices with "Start Using App" button\n\nRequirements:\n- Use a step indicator at the top showing progress (Step 1 of 4)\n- "Back" and "Next" navigation buttons (no "Back" on step 1, "Finish" on step 4)\n- Persist draft progress to localStorage in case the user closes the tab\n- On finish, POST to /api/users/onboard with all collected data and set user.isOnboarded = true\n- Form validation using Zod schemas in src/validators/onboarding.ts\n- Use existing form components from src/components/ui/ (Input, Select, Button)\n- Add tests for each step\'s validation and the full submission flow'
              },
              {
                id: 'ex-workflow-4',
                type: 'prompt-writing',
                question: 'Write a prompt for Devin to build a complete REST API for a blog platform. Include all the endpoints, data models, and requirements.',
                hint: 'Think about CRUD operations, relationships between models, authentication, and pagination.',
                idealAnswer: 'Build a REST API for a blog platform in our Express/TypeScript project.\n\nData models (add Prisma migrations):\n- Post: id, title, slug (unique, auto-generated from title), body (markdown), excerpt (first 200 chars of body), authorId (FK to User), status (draft/published), publishedAt, createdAt, updatedAt\n- Category: id, name, slug\n- PostCategory: postId, categoryId (many-to-many)\n- Comment: id, postId, authorId, body, createdAt\n\nEndpoints (in src/routes/):\n- GET /api/posts \u2014 list published posts, paginated (cursor-based, 20/page), filterable by ?category=slug\n- GET /api/posts/:slug \u2014 single post with author and comments\n- POST /api/posts \u2014 create post (auth required, author = req.user)\n- PATCH /api/posts/:id \u2014 update post (auth, must be author)\n- DELETE /api/posts/:id \u2014 soft delete (auth, must be author)\n- POST /api/posts/:id/comments \u2014 add comment (auth required)\n- GET /api/categories \u2014 list all categories\n\nConventions: follow existing patterns in src/routes/users.ts. Use asyncHandler wrapper. Return { data, meta } format. Add validation with Zod. Tests for each endpoint.'
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
