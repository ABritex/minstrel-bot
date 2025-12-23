import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/drizzle/schema.js',
    out: './src/drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.NEON_DB,
    },
});