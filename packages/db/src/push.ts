import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Create the connection using non-pooling connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const db = drizzle(pool);

  // Push the schema
  try {
    console.log('Pushing schema changes...');
    // Drop existing RLS policies if they exist
    await db.execute(/* sql */ `
      DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
      DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
      DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    `);

    // Create or update the profiles table
    await db.execute(/* sql */ `
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id),
        updated_at TIMESTAMPTZ,
        full_name TEXT,
        avatar_url TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Enable RLS
    await db.execute(/* sql */ `
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policies
    await db.execute(/* sql */ `
      CREATE POLICY "Enable insert for authenticated users"
        ON profiles
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = id);

      CREATE POLICY "Users can update own profile"
        ON profiles
        FOR UPDATE
        TO public
        USING (auth.uid() = id);

      CREATE POLICY "Users can view own profile"
        ON profiles
        FOR SELECT
        TO public
        USING (auth.uid() = id);
    `);
    
    // Test query to verify the table exists
    const result = await db.execute(/* sql */ `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
      );
    `);
    console.log('Table exists:', result.rows[0].exists);
    console.log('Schema changes applied successfully!');
  } catch (error) {
    console.error('Error applying schema changes:', error);
    process.exit(1);
  }

  await pool.end();
}

main().catch(console.error);
