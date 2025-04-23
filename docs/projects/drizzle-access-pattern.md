# Drizzle Access Pattern Documentation

## Overview

This document outlines the implementation of a best practice Drizzle access pattern for our NextJS 15 application. The pattern follows a repository-service architecture to ensure clean separation of concerns, type safety, and maintainability.

## Architecture

Our implementation follows a layered architecture:

1. **Schema Layer**: Defines database tables and relationships using Drizzle ORM
2. **Repository Layer**: Handles direct database access and queries
3. **Service Layer**: Implements business logic and validation
4. **API Layer**: Exposes endpoints for the frontend to consume

### Directory Structure

```
packages/db/
├── src/
│   ├── schema/              # Database schema definitions
│   │   ├── teams.ts
│   │   ├── organizations.ts
│   │   └── ...
│   ├── repositories/        # Repository layer
│   │   ├── team-repository.ts
│   │   ├── organization-repository.ts
│   │   └── ...
│   ├── services/            # Service layer
│   │   ├── team-service.ts
│   │   ├── organization-service.ts
│   │   └── ...
│   ├── __tests__/           # Unit tests
│   │   ├── repositories/
│   │   ├── services/
│   │   └── ...
│   └── index.ts             # Package entry point
```

## Implementation Details

### Schema Layer

The schema layer uses Drizzle ORM to define database tables and relationships. Each schema file corresponds to a specific domain entity (e.g., teams, organizations).

Example:
```typescript
// schema/organizations.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  website: text('website'),
  createdById: uuid('created_by_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Repository Layer

The repository layer encapsulates all database access logic. Each repository is responsible for a specific domain entity and provides methods for CRUD operations.

Example:
```typescript
// repositories/organization-repository.ts
import { db } from '../db';
import { organizations, organizationMembers } from '../schema/organizations';
import { eq } from 'drizzle-orm';

export const organizationRepository = {
  async createOrganization(data: CreateOrganizationInput) {
    const [organization] = await db.insert(organizations).values(data).returning();
    return organization;
  },
  
  async getUserOrganizations(userId: string) {
    // Implementation details
  }
};
```

### Service Layer

The service layer implements business logic and validation. It uses repositories to access data and provides a clean API for the application.

Example:
```typescript
// services/organization-service.ts
import { organizationRepository } from '../repositories/organization-repository';

export const organizationService = {
  async createOrganization(data: CreateOrganizationInput) {
    // Validation and business logic
    const organization = await organizationRepository.createOrganization(data);
    const membership = await organizationRepository.addOrganizationMember({
      organizationId: organization.id,
      userId: data.createdById,
      role: 'owner',
    });
    
    return { organization, membership };
  }
};
```

### API Layer

The API layer exposes endpoints for the frontend to consume. It uses the service layer to implement business logic.

Example:
```typescript
// apps/public-frontend/app/api/organizations/route.ts
import { NextResponse } from 'next/server';
import { organizationService } from '@rallyround/db';

export async function POST(request: Request) {
  // Authentication and validation
  const { name, description } = await request.json();
  const result = await organizationService.createOrganization({
    name,
    description,
    createdById: userId,
  });
  
  return NextResponse.json(result.organization);
}
```

## Organization-First Approach

Our implementation follows an organization-first approach, where:

1. Users must be part of an organization before creating teams
2. Teams belong to organizations
3. A default organization is created for users who don't have one

This approach ensures proper access control and organization of teams.

## Testing

We've implemented comprehensive unit tests for:

1. **Repository Layer**: Tests database access logic
2. **Service Layer**: Tests business logic and validation
3. **API Layer**: Tests API endpoints

Example test:
```typescript
// __tests__/services/organization-service.test.ts
describe('Organization Service', () => {
  describe('createOrganization', () => {
    it('should create an organization and add the creator as a member', async () => {
      // Test implementation
    });
  });
});
```

## Best Practices

1. **Type Safety**: Use TypeScript interfaces for all inputs and outputs
2. **Error Handling**: Implement proper error handling at all layers
3. **Validation**: Validate inputs at the service layer
4. **Testing**: Write comprehensive tests for all layers
5. **Documentation**: Document all public APIs and methods

## Future Improvements

1. **Pagination**: Implement pagination for large result sets
2. **Caching**: Add caching for frequently accessed data
3. **Logging**: Implement structured logging
4. **Metrics**: Add performance metrics
5. **Rate Limiting**: Implement rate limiting for API endpoints
