import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    user: 'postgres.ebabdsgidtifctekhhns',
    password: 'ri0z2sgSXIvLahRX',
    host: 'aws-0-ap-southeast-2.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  },
});
