# RallyRound Resources

This section provides knowledge bases and helpful information for understanding and working with the RallyRound platform.

## Development Resources

### Code Organisation

```
RallyRound/
├── apps/                     # Applications
│   ├── public-frontend/      # User-facing application
│   └── admin-frontend/       # Admin interface
├── packages/                 # Shared libraries
│   ├── auth/                 # Authentication utilities
│   ├── rbac/                 # Role-based access control
│   └── ui/                   # Shared UI components
└── docs/                     # Documentation (PARA structure)
```

### Development Environment

1. **Prerequisites**:
   - Node.js 18+
   - pnpm
   - Supabase CLI (optional)

2. **Setup**:
   ```bash
   # Clone repository
   git clone [repository-url]
   
   # Install dependencies
   pnpm install
   
   # Set up environment variables
   cp apps/public-frontend/.env.example apps/public-frontend/.env.local
   
   # Start development server
   pnpm dev --filter public-frontend
   ```

### Key Design Guidelines

#### UI Design Principles
- **Dark mode default**: Slate-900/950 backgrounds for better readability
- **Brand gradient**: Blue to purple to pink gradient for key brand elements
- **Accessibility**: WCAG AA compliance (4.5:1 contrast minimum)
- **Glassmorphism**: Subtle backdrop blur on cards and headers
- **Typography**: Clean, readable fonts with proper hierarchy

#### Code Style Guidelines
- Use TypeScript for type safety
- Follow Next.js 15 conventions for routing and data fetching
- Keep components modular and reusable
- Document complex functions with JSDoc comments

## External Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/) (Web Content Accessibility Guidelines)

### Design Inspirations
- Modern glassmorphism interfaces
- Health and wellbeing applications
- Community and social platforms
- Sports team management systems

### Relevant Research
- User engagement in health platforms
- Physical vs. digital interaction studies
- Community building frameworks
