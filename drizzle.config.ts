import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './app/db/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});