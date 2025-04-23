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

// Get database URL directly from the .env file in packages/db
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in environment variables!');
  console.error('Available environment variables:', Object.keys(process.env).join(', '));
  
  // Try to read the .env file directly as a fallback
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/i);
    if (dbUrlMatch && dbUrlMatch[1]) {
      console.log('📄 Found DATABASE_URL in .env file, using it directly');
      const directDbUrl = dbUrlMatch[1].trim();
      
      // Initialize PostgreSQL connection pool with the direct URL
      const pool = new Pool({
        connectionString: directDbUrl,
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
    } else {
      throw new Error('DATABASE_URL not found in .env file');
    }
  } catch (error) {
    console.error('Failed to read DATABASE_URL from .env file:', error);
    throw new Error('Cannot initialize database without DATABASE_URL');
  }
} else {
  console.log('🔌 Connecting to Supabase database with URL from environment variables');
  
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
  
  // Test the connection
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('❌ Database connection test failed:', err.message);
    } else {
      console.log('✅ Database connection successful:', result.rows[0]);
    }
  });
}

// Export the database instance
export const db = dbInstance;

// Export repositories and services
export * from './repositories/team-repository';
export * from './repositories/organization-repository';
export * from './services/team-service';
export * from './services/organization-service';

// Export service and repository instances
export { teamService } from './services/team-service';
export { organizationService } from './services/organization-service';
export { teamRepository } from './repositories/team-repository';
export { organizationRepository } from './repositories/organization-repository';

// Re-export types from repositories and services
export type { CreateTeamParams, TeamWithMembership, TeamMemberParams } from './repositories/team-repository';
export type { CreateOrganizationParams, OrganizationWithMembership, OrganizationMemberParams } from './repositories/organization-repository';

// Export schema
export * from './schema/organizations';

// SQL is already exported above
