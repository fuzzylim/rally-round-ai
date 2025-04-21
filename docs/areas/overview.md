# RallyRound Core Areas

This section outlines the core components and ongoing responsibilities of the RallyRound platform.

## Frontend Architecture

### Public Frontend (`/apps/public-frontend`)
- **Purpose**: User-facing application for community members
- **Tech Stack**: Next.js 15, React 18, Tailwind CSS
- **Key Components**:
  - Authentication (login/signup)
  - Dashboard
  - Fundraising modules
  - Teams management
  - Competition tracking

### Admin Frontend (`/apps/admin-frontend`)
- **Purpose**: Administrative interface for platform management
- **Tech Stack**: Next.js 15, React 18, Tailwind CSS
- **Key Components**:
  - User management
  - Content moderation
  - Analytics dashboard
  - Settings configuration

## Backend Services

### Authentication (`/packages/auth`)
- **Purpose**: Manage user identity and session state
- **Implementation**: Supabase Auth
- **Key Features**:
  - JWT-based authentication
  - Role-based access control
  - Session management

### RBAC (`/packages/rbac`)
- **Purpose**: Role-Based Access Control system
- **Implementation**: Custom rules with Supabase integration
- **Key Features**:
  - Permission definitions
  - Role assignments
  - Access validation

### UI Component Library (`/packages/ui`)
- **Purpose**: Shared UI components across applications
- **Implementation**: React components with Tailwind CSS
- **Design Principles**:
  - Dark mode with WCAG AA compliance
  - Consistent gradient branding
  - Responsive design
  - Glassmorphism effects

## Infrastructure

### Deployment
- **Platform**: Vercel
- **CI/CD**: Automated from GitHub
- **Environments**: Development, Staging, Production

### Database
- **Platform**: Supabase (PostgreSQL)
- **Key Features**:
  - Real-time subscriptions
  - Row-level security
  - Automated backups

## Ongoing Responsibilities

### Accessibility
- Maintain WCAG AA compliance
- Regular accessibility audits
- Keyboard navigation support

### Performance
- Regular performance monitoring
- Optimisation of critical rendering paths
- Bundle size management

### Security
- Regular security audits
- Dependency updates
- Authentication flow reviews
