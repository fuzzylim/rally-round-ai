# Teams Management

## Overview

The Teams Management module allows users to create, join, and manage teams within the RallyRound platform. Teams serve as the primary organizational unit for sports clubs, schools, and other organizations to coordinate activities, manage members, and track events.

## Key Features

### Team Creation and Management
- Create teams with details like name, sport, age group, and logo
- Edit team details
- View team information and activity
- Leave teams (for members)

### Member Management
- Invite new members via email
- Assign and update member roles (owner, admin, coach, manager, member)
- Remove members from teams
- View team membership list

### Role-Based Permissions
- **Owner**: Full control over team, can assign roles, cannot be removed
- **Admin**: Can manage members, send invitations, update team details
- **Coach/Manager**: Special roles for team staff
- **Member**: Basic access to team information and activities

### Team Activity Tracking
- Automatic logging of important team events
- Activity timeline showing member joins, role changes, and other events
- Historical record of team changes

## Technical Implementation

### Database Schema

The Teams Management module uses the following database tables:

#### teams
- `id`: UUID primary key
- `name`: Team name
- `description`: Optional team description
- `sport`: Sport type
- `ageGroup`: Age group classification
- `logoUrl`: Optional URL to team logo
- `createdById`: User ID of team creator
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update
- `metadata`: JSON field for additional data

#### team_members
- `id`: UUID primary key
- `teamId`: Reference to team
- `userId`: Reference to user
- `role`: Enum (owner, admin, coach, manager, member)
- `joinedAt`: Timestamp of when user joined
- `isActive`: Boolean indicating active status

#### team_invitations
- `id`: UUID primary key
- `teamId`: Reference to team
- `email`: Email address of invitee
- `role`: Assigned role upon acceptance
- `token`: Unique invitation token
- `invitedById`: User ID of inviter
- `invitedAt`: Timestamp of invitation
- `expiresAt`: Expiration timestamp
- `acceptedAt`: Timestamp of acceptance (if accepted)
- `status`: Enum (pending, accepted, declined, expired)
- `message`: Optional personal message

#### team_activities
- `id`: UUID primary key
- `teamId`: Reference to team
- `userId`: User who performed action (optional)
- `activityType`: Type of activity
- `description`: Human-readable description
- `metadata`: Additional data about the activity
- `createdAt`: Timestamp of activity

### API Endpoints

#### Teams
- `POST /api/teams`: Create a new team
- `GET /api/teams`: List teams the user is a member of
- `GET /api/teams/:id`: Get team details
- `PATCH /api/teams/:id`: Update team details
- `DELETE /api/teams/:id`: Delete a team (owner only)

#### Team Members
- `DELETE /api/teams/:id/members`: Leave a team
- `GET /api/teams/:id/members`: List team members
- `PATCH /api/teams/:id/members/:userId`: Update member role
- `DELETE /api/teams/:id/members/:userId`: Remove a member

#### Invitations
- `POST /api/teams/invitations`: Send team invitation
- `GET /api/teams/invitations`: List pending invitations
- `GET /api/teams/invitations/:token`: Get invitation details
- `POST /api/teams/invitations/:token`: Accept/decline invitation

## User Flows

### Creating a Team
1. User navigates to Teams page
2. User clicks "Create Team" button
3. User fills out team details (name, sport, age group, etc.)
4. System creates team and assigns user as owner
5. User is redirected to team page

### Inviting Members
1. Team admin/owner navigates to team page
2. Admin clicks "Invite Member" section
3. Admin enters email address, selects role, and adds optional message
4. System sends invitation
5. Invitee receives email with link to accept invitation
6. Upon acceptance, invitee is added to team with assigned role

### Managing Members
1. Team admin/owner navigates to team page
2. Admin views member list
3. Admin can change member roles or remove members
4. System updates member status and logs activity

## Integration Points

- **Authentication System**: Uses Supabase auth for user identification
- **Email Notifications**: For invitation delivery
- **Analytics**: Tracks team creation and member activities
- **Financial Management**: Teams can be linked to budgets and fundraising campaigns
- **Events Module**: Teams can organize and participate in events

## Future Enhancements

- Team chat functionality
- Team calendar integration
- Performance tracking for team members
- Team statistics and reporting
- Multi-team management for organizations
- Team templates for quick setup

## Testing

Comprehensive testing for the Teams Management module includes:

- Unit tests for database schema and relations
- API endpoint testing for all CRUD operations
- Integration tests for user flows
- Permission and role-based access testing
- Edge cases like invitation expiration handling

## Documentation

Additional documentation is available in:
- [API Reference](/docs/api/teams.md)
- [Database Schema](/docs/resources/database-schema.md)
- [User Guide](/docs/resources/user-guide.md)
