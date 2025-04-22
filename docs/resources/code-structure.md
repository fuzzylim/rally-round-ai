# RallyRound Code Structure

This document provides a lightweight guide to help developers understand the RallyRound codebase structure and key components.

## Public Frontend Structure

```
apps/public-frontend/
├── app/                     # Next.js App Router
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles including gradient utilities
│   ├── api/                 # API routes
│   │   └── healthcheck/     # Health check endpoint
│   │       ├── route.ts     # Health check API implementation
│   │       └── route.test.ts # Health check API tests
│   ├── components/          # Shared components
│   │   └── auth/            # Authentication components
│   │       ├── AuthProvider.tsx # Auth context provider
│   │       └── AuthProvider.test.tsx # Auth provider tests
│   ├── dashboard/           # Dashboard pages and components
│   │   ├── page.tsx         # Main dashboard layout
│   │   ├── stats.tsx        # Dashboard statistics component
│   │   ├── upcoming-events.tsx  # Events display component
│   │   └── dashboard-nav.tsx    # Dashboard navigation
│   ├── login/               # Login-related components
│   │   ├── page.tsx         # Login page layout
│   │   └── login-form.tsx   # Login form component
│   └── signup/              # Signup-related components
│       ├── page.tsx         # Signup page layout
│       └── signup-form.tsx  # Signup form component
├── public/                  # Static assets
│   ├── heart-blue-pink.svg  # Gradient heart logo
│   └── mesh-gradient.svg    # Background gradient asset
└── next.config.js           # Next.js configuration
```

## Key Component Details

### App Structure

The application uses Next.js 15 App Router, which provides:
- Server Components for improved performance
- Nested routing with directory-based structure
- Layouts for shared UI across routes

### Component Patterns

#### Page Components
- Serve as the main layout containers for routes
- Handle server-side data fetching where needed
- Use Server Components by default

```tsx
// Example page component structure
export default function DashboardPage() {
  return (
    <main>
      <DashboardNav />
      <div className="container">
        <Suspense fallback={<Loading />}>
          {/* @ts-expect-error Async Server Component */}
          <DashboardStats />
        </Suspense>
        {/* Additional content */}
      </div>
    </main>
  );
}
```

#### Feature Components
- Implement specific functionality
- May use client or server components depending on needs
- Often contain multiple smaller sub-components

```tsx
// Example feature component
'use client';

function LoginForm() {
  // State and handlers
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (e) => {
    // Authentication logic
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form elements */}
    </form>
  );
}
```

### Styling Approach

The application uses Tailwind CSS with custom utility classes:

```css
/* Example of gradient utilities in globals.css */
@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500;
  }
}
```

### Authentication Flow

Authentication is handled via Supabase:

1. User submits credentials via login/signup form
2. Credentials passed to Supabase auth service
3. JWT token returned and stored in browser
4. Token used for subsequent API requests
5. Protected routes validate token before rendering

## Shared Packages

### UI Components (`packages/ui`)

Contains reusable UI elements used across applications:
- `Button`: Primary interactive element with variants
- `Card`: Container component with glassmorphism styling
- `Input`: Form input fields with validation support

### Authentication (`packages/auth`)

Provides auth utilities:
- `signInWithEmail`: Email/password authentication
- `signUpWithEmail`: New account registration
- `createSupabaseClient`: Client initialisation

### RBAC (`packages/rbac`)

Role-based access control:
- Permission definitions
- Role assignment
- Access validation logic
