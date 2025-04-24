import { drizzle } from 'drizzle-orm/node-postgres';
import { sql as drizzleSql } from 'drizzle-orm';
import { Pool } from 'pg';
import * as profilesSchema from './schema/profiles';
import * as teamsSchema from './schema/teams';
import * as fs from 'fs';
import * as path from 'path';

// Export sql directly to ensure it's available
export const sql = drizzleSql;

// Load environment variables directly from the package's .env file
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require('dotenv');
    dotenv.config({ path: envPath });
    console.log('Loaded environment variables from packages/db/.env file');
    process.env.DOTENV_LOADED = 'true';
  } catch (e) {
    console.warn('Failed to load dotenv from packages/db/.env:', e);
  }
}

// Combine all schemas for export
export * from './schema/profiles';
export * from './schema/teams';

// Combine all schema objects
const schema = { 
  ...profilesSchema, 
  ...teamsSchema 
};

// Create database instance with real Supabase connection
let dbInstance;

// Construct database URL from available environment variables
let databaseUrl = process.env.DATABASE_URL;

// Function to construct a database URL from Vercel Postgres environment variables
function constructDatabaseUrlFromVercel() {
  // Check for Vercel's managed Postgres URL
  if (process.env.POSTGRES_URL) {
    console.log('🔍 Found POSTGRES_URL in environment variables, using it directly');
    return process.env.POSTGRES_URL;
  }
  
  // If individual components are available, construct the URL
  const host = process.env.POSTGRES_HOST;
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DATABASE;
  
  if (host && user && password && database) {
    console.log('🔧 Constructing DATABASE_URL from Vercel Postgres components');
    return `postgres://${user}:${password}@${host}/${database}`;
  }
  
  return null;
}

// Try to get or construct the database URL
if (!databaseUrl) {
  console.warn('⚠️ DATABASE_URL not found, looking for alternatives...');
  
  // Try to construct from Vercel Postgres environment variables
  const vercelDbUrl = constructDatabaseUrlFromVercel();
  if (vercelDbUrl) {
    databaseUrl = vercelDbUrl;
    console.log('✅ Constructed DATABASE_URL from Vercel Postgres variables');
  } else {
    console.error('❌ DATABASE_URL not found in environment variables!');
    console.error('Available environment variables:', Object.keys(process.env).join(', '));
    
    // Try to read the .env file directly as a fallback
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/i);
      if (dbUrlMatch && dbUrlMatch[1]) {
        console.log('📄 Found DATABASE_URL in .env file, using it directly');
        databaseUrl = dbUrlMatch[1].trim();
      } else {
        // As a last resort when in development, try using a local demo database
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Using development demo database configuration');
          databaseUrl = 'postgres://postgres:postgres@localhost:5432/postgres';
        } else {
          throw new Error('DATABASE_URL not found in .env file');
        }
      }
    } catch (error) {
      console.error('Failed to read DATABASE_URL from .env file:', error);
      
      // Create a mock database connection for build purposes
      if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
        console.warn('🏗️ Building in Vercel environment without database - using mock database');
        // We'll create a mock DB instance below
        databaseUrl = 'mock';
      } else {
        throw new Error('Cannot initialize database without DATABASE_URL');
      }
    }
  }
}

// Create database instance based on the URL
if (databaseUrl === 'mock') {
  console.log('🤓 Creating mock database for build process');
  
  // Create a dummy drizzle instance for build purposes
  const mockDb = {
    query: async () => [],
    select: () => ({ from: () => [] }),
    insert: () => ({ values: () => [], returning: () => [] }),
    update: () => ({ set: () => [], where: () => [], returning: () => [] }),
    delete: () => ({ where: () => [], returning: () => [] }),
  };
  
  // Use the mock db for the instance
  dbInstance = mockDb as any;
  
  console.log('✅ Mock database initialized for build process');
} else {
  console.log('🔌 Connecting to Supabase database with URL');
  
  try {
    // Initialize PostgreSQL connection pool
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false, // Required for Supabase connections
      },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });
    
    // Add error handler
    pool.on('error', (err) => {
      console.error('Database pool error:', err);
    });
    
    // Create DB instance
    dbInstance = drizzle(pool, { schema });
    
    // Test the connection (but not during build)
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      pool.query('SELECT NOW()', (err, result) => {
        if (err) {
          console.error('❌ Database connection test failed:', err.message);
        } else {
          console.log('✅ Database connection successful:', result.rows[0]);
        }
      });
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
      console.warn('🏗️ Building in Vercel environment - using mock database due to connection failure');
      // Create a mock instance for Vercel build as fallback
      const mockDb = {
        query: async () => [],
        select: () => ({ from: () => [] }),
        insert: () => ({ values: () => [], returning: () => [] }),
        update: () => ({ set: () => [], where: () => [], returning: () => [] }),
        delete: () => ({ where: () => [], returning: () => [] }),
      };
      dbInstance = mockDb as any;
    } else {
      throw error; // Re-throw in development environment
    }
  }
}

// Export the database instance
export const db = dbInstance;

// Export repositories and services
export * from './repositories/team-repository';
export * from './repositories/organization-repository';
export * from './services/team-service';
export * from './services/organization-service';
export * from './services/mock-service';

// Determine if we should use real or mock services
const useRealServices = databaseUrl !== 'mock';

// Import service instances (we need to do this conditionally)
import { teamService as realTeamService } from './services/team-service';
import { organizationService as realOrgService } from './services/organization-service';
import { MockOrganizationService } from './services/mock-service';

// Create mock service instances if needed
const mockOrgService = new MockOrganizationService();

// Export the appropriate service instances based on environment
export const teamService = useRealServices ? realTeamService : {} as any; // Mock team service if needed
export const organizationService = useRealServices ? realOrgService : mockOrgService;

// Export repository instances
export { teamRepository } from './repositories/team-repository';
export { organizationRepository } from './repositories/organization-repository';

// Re-export specific types for all exported services
export type { TeamServiceInterface, TeamService } from './services/team-service';
export type { OrganizationServiceInterface, OrganizationService } from './services/organization-service';

// Re-export types from repositories and services
export type { CreateTeamParams, TeamWithMembership, TeamMemberParams } from './repositories/team-repository';
export type { CreateOrganizationParams, OrganizationWithMembership, OrganizationMemberParams } from './repositories/organization-repository';

// Export schema
export * from './schema/organizations';

// SQL is already exported above
