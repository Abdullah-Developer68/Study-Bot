# StudyBot (Work in progress)

StudyBot is a monorepo for an AI-assisted academic productivity platform. It combines document ingestion, structured writing workflows, template-driven generation, AI content analysis, and export tooling in a single system.

The repository is organized as a Turborepo workspace with a Next.js web application, an Expo mobile application, and shared packages for Supabase, utilities, assets, types, and API client code.

## Key Capabilities

- AI-assisted question answering and assignment drafting
- Document upload and parsing for common file formats
- Content refinement and iteration workflows
- AI content analysis with sentence-level highlighting and scoring
- Reusable templates for standardized assignment formats
- Export to PDF and Word document formats
- Code block rendering and syntax highlighting
- Chat assistant for guided responses, quiz generation, and flash cards
- Persistence for completed assignments and saved templates
- Authentication and backend data management through Supabase

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- TipTap
- CodeMirror and Highlight.js for code rendering
- Redux Toolkit for client state where needed

### Mobile
- Expo
- React Native
- Expo Router

### Backend and Platform
- Supabase for authentication, database, storage, and edge functions
- Turborepo for monorepo orchestration
- AI SDK, Vercel AI Gateway, and OpenRouter provider for model integration
- Google Gemini 2.5 Pro and Gemini 2.5 Flash for advanced and fast generation workflows
- Socket.io for real-time communication patterns where required
- PostHog for product analytics

### Shared Packages
- `@studybot/supabase` for Supabase SDK helpers and edge-function related logic
- `@studybot/api-client` for shared API client utilities
- `@studybot/utils` for document parsing and shared helpers
- `@studybot/types` for common TypeScript definitions
- `@studybot/assets` for shared media and icons
- `@repo/typescript-config` for shared TypeScript configuration

## Repository Structure

```text
StudyBot-TurboRepo/
├── apps/
│   ├── web/            # Next.js web application
│   └── mobile/         # Expo mobile application
├── packages/
│   ├── api-client/     # Shared API client utilities
│   ├── assets/         # Shared images, icons, and media
│   ├── supabase/       # Supabase SDK, edge functions, migrations, snippets
│   ├── types/          # Shared TypeScript definitions
│   ├── typescript-config/ # Shared TS config presets
│   └── utils/          # Shared helper functions and document parsing
├── supabase/           # Supabase project assets at the repository root
├── turbo.json          # Turborepo pipeline configuration
└── package.json        # Workspace root scripts and configuration
```

## Architecture Overview

StudyBot uses a monorepo architecture so the web app, mobile app, and shared backend logic can evolve together without duplicating implementation details.

### Application Layer
- `apps/web` contains the primary user experience built with Next.js.
- `apps/mobile` provides the companion mobile experience with Expo.

### Shared Logic Layer
- `packages/utils` centralizes parsing, file handling, and cross-platform helpers.
- `packages/api-client` standardizes request and client behavior.
- `packages/types` keeps shared domain types aligned across all clients.
- `packages/assets` provides common visual assets.

### Backend Layer
- `packages/supabase` contains the Supabase integration surface, including SDK helpers, edge functions, and migrations.
- Supabase handles authentication, persistence, storage, and real-time capabilities.

### AI Layer
- The web application integrates with AI providers through the AI SDK.
- Gemini models are used for generation and more complex reasoning tasks.
- OpenRouter support allows model routing and provider flexibility.

### Document Workflow
1. A user submits a question or uploads a file.
2. Shared utilities parse the document and extract usable content.
3. The AI layer generates or refines the response.
4. The editor presents the result with formatting, code highlighting, and analysis feedback.
5. The final output can be saved, reused as a template, or exported.

## Getting Started

### Prerequisites
- Node.js 20 or newer is recommended
- npm 11+
- A Supabase project
- API keys for the selected AI providers

### Install Dependencies

From the repository root:

```bash
npm install
```

### Run the Web App

```bash
npm run dev:web
```

### Build the Monorepo

```bash
npm run build
```

### Type Check the Workspace

```bash
npm run typecheck
```

### Run the Mobile App

```bash
cd apps/mobile
npm start
```

## Supabase Development

The Supabase package contains local functions and migration support.

Examples:

```bash
cd packages/supabase
npm run functions:serve:text
npm run functions:serve:pdf
npm run functions:serve:word
```

Deploy commands are also defined in `packages/supabase/package.json` for the supported functions.

## Environment Variables

The exact environment variable set depends on the deployment target and enabled features, but the project typically requires configuration for:

- Supabase URL and anon/service keys
- AI provider API keys
- Analytics keys for PostHog
- Payment provider credentials for Stripe and any local payment gateway integrations
- Any storage or document-processing service secrets

Keep sensitive values out of source control and define them in environment files or your hosting provider's secret manager.

## Deployment Notes

This project is designed to work well with a split deployment model:

- Web application deployment on Vercel or another Next.js-compatible host
- Supabase for backend services, auth, storage, and edge functions
- Mobile distribution through Expo build and release workflows
- Optional self-hosted or budget-conscious infrastructure on DigitalOcean if required

If you self-host infrastructure, keep the backend services and environment configuration aligned across all clients.

## Product Scope

The intended product experience includes:

- Assignment generation and refinement
- AI-assisted analysis and writing support
- Template-based workflows
- Exportable final documents
- Saved assignment history
- A chat-based assistant for guided generation and study support
- Analytics-driven feature tracking through PostHog
- Payment support for Stripe and local payment providers such as JazzCash and Easypaisa
