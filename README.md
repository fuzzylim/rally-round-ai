# RallyRound

A modern digital business platform for sports clubs, schools, and community groups built with Turborepo and Next.js 15.

## Overview

RallyRound helps organizations with:
- **Community Fundraising**: Raise funds for equipment, travel, or facilities
- **Sports Competitions**: Organize tournaments, meets, and other sporting events
- **Team Management**: Create and manage teams for various activities
- **Member Coordination**: Keep track of members and their participation
- **Community Building**: Bring people together around shared interests

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth & Database**: Supabase
- **Access Control**: Role-based permissions using a Zanzibar-style rules module
- **Build System**: Turborepo
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Ready for Vercel Monorepo

## Project Structure

- `apps/`
  - `public-frontend/`: Public-facing website
  - `admin-frontend/`: Internal admin dashboard
- `packages/`
  - `ui/`: Shared UI components
  - `auth/`: Supabase authentication utilities
  - `rbac/`: Role-based access control logic

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

RallyRound uses Supabase as its database backend. The schema includes:

- **users**: User accounts
- **profiles**: Additional user profile information
- **user_roles**: User role assignments
- **organizations**: Community organizations
- **teams**: Teams within organizations
- **fundraisers**: Fundraising campaigns
- **competitions**: Sporting events and tournaments
- **members**: Organization and team members

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

## Deployment

The project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the necessary environment variables
3. Deploy each app individually from the monorepo

## License

This project is proprietary and confidential.
