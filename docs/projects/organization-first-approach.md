# Organization-First Approach Documentation

## Overview

This document outlines our organization-first approach for user management in the Rally Round application. This approach ensures that users join an organization before creating teams, providing better structure and access control.

## Key Concepts

### Organizations

Organizations are the top-level entity in our application. They represent clubs, schools, or other groups that manage multiple teams.

Key features:
- Each organization can have multiple teams
- Users must be members of an organization to create or join teams
- Organizations have members with different roles (owner, admin, member)

### Teams

Teams exist within organizations. They represent specific sports teams with their own members and activities.

Key features:
- Teams belong to exactly one organization
- Team creation requires organization membership
- Team members must be organization members

## Implementation Details

### Database Schema

The database schema reflects the organization-first approach:

```
organizations
├── id (PK)
├── name
├── description
├── logo_url
├── website
├── created_by_id (FK to users)
└── timestamps

organization_members
├── id (PK)
├── organization_id (FK to organizations)
├── user_id (FK to users)
├── role (enum: owner, admin, member)
└── timestamps

teams
├── id (PK)
├── name
├── description
├── sport
├── age_group
├── logo_url
├── organization_id (FK to organizations) <- Key relationship
├── created_by_id (FK to users)
└── timestamps
```

### User Flow

1. **User Registration**:
   - User creates an account
   - System checks if user belongs to any organization
   - If not, a default personal organization is created

2. **Team Creation**:
   - User selects an organization
   - User creates a team within that organization
   - User is automatically added as team owner

3. **Team Management**:
   - Team members must be organization members
   - Organization admins can manage all teams

## API Endpoints

### Organizations

- `GET /api/organizations`: Get all organizations the user is a member of
- `GET /api/organizations/user`: Get organizations for the current user
- `POST /api/organizations`: Create a new organization

### Teams

- `GET /api/teams`: Get all teams the user is a member of
- `GET /api/teams?organizationId=X`: Get teams for a specific organization
- `POST /api/teams`: Create a new team (requires organization ID)

## Frontend Implementation

The frontend implements the organization-first approach by:

1. Requiring organization selection before team creation
2. Filtering team lists by organization
3. Creating a default organization for new users

## Benefits

1. **Improved Access Control**: Clear hierarchy for permissions
2. **Better Organization**: Teams are logically grouped
3. **Simplified Management**: Organization admins can manage all teams
4. **Future-Proof**: Easier to implement advanced features like:
   - Organization-wide settings
   - Cross-team reporting
   - Billing at organization level

## Testing

We've implemented comprehensive tests for the organization-first approach:

1. **Unit Tests**: Test service and repository methods
2. **API Tests**: Test API endpoints
3. **Integration Tests**: Test end-to-end flows

## Future Improvements

1. **Organization Invitations**: Allow users to invite others to their organization
2. **Organization Settings**: Implement organization-wide settings
3. **Organization Roles**: Add more granular permissions for organization members
4. **Organization Analytics**: Add analytics for organizations
