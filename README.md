# RallyRound

A streamlined platform that helps Aussie social clubs organise meet-ups and manage finances with minimal screen time, built with Turborepo and Next.js 15.

## Overview

RallyRound helps Aussie social clubs spend less time online and more time together:
- **Quick Event Setup**: Set up meet-ups in under 2 minutes so you can get back to real life
- **No-Fuss Finances**: Sort the money stuff without spreadsheet headaches
- **Member Connections**: Maintain your crew with minimal admin hassle
- **Simplified Admin**: Get organised fast with intuitive tools
- **Real-Life Connections**: Focus on face-to-face time, not screen time

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth & Database**: Supabase with Drizzle ORM
- **Access Control**: Role-based permissions using a Zanzibar-style rules module
- **Build System**: Turborepo
- **Styling**: Tailwind CSS + shadcn/ui with custom dark theme
- **Deployment**: Ready for Vercel Monorepo
- **Package Manager**: pnpm

## Project Structure

- `apps/`
  - `public-frontend/`: User-facing website for quick access
  - `admin-frontend/`: Streamlined admin dashboard
- `packages/`
  - `ui/`: Performance-optimised UI components
  - `auth/`: Supabase authentication utilities
  - `rbac/`: Role-based access control logic
- `docs/`
  - Organised using PARA method (Projects, Areas, Resources, Archives)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase account

### Environment Setup

Create a `.env` file in both `apps/public-frontend` and `apps/admin-frontend` with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
# For public frontend (runs on port 3000)
pnpm dev --filter public-frontend

# For admin frontend (runs on port 3001)
pnpm dev --filter admin-frontend
```

## Database Schema

RallyRound uses Supabase with Drizzle ORM as its database backend. The schema includes:

- **users**: User accounts with fast authentication
- **profiles**: Streamlined user profile information
- **user_roles**: Efficient role assignments
- **clubs**: Local social clubs and community groups
- **events**: Quick-to-set-up meet-ups and activities
- **finances**: No-fuss financial tracking and budgeting
- **spaces**: Shared resources management
- **members**: Simplified membership tracking

Our database is optimised for quick interactions to minimise time spent in the app.

## Development

### Adding a Shared Package

```bash
cd packages
mkdir new-package
cd new-package
# Initialize package
```

### Adding a Feature to an App

1. Create components in the appropriate app directory
2. Update routes in the app folder
3. Add any necessary API endpoints

### Commit & PR Workflow

All commits should use semantic commit messages:
```
feat(events): add quick-setup form for meet-ups
fix(api): correct user endpoint response
docs(club): update README with new offline-first focus
```

Before pushing, always run:
```bash
pnpm run build
pnpm run test
```

## Deployment

The project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the necessary environment variables
3. Deploy each app individually from the monorepo

## License

This project is proprietary and confidential.
