import 'dotenv/config';

const requiredEnvVars = ['DISCORD_TOKEN', 'SONG_CHANNEL_ID', 'NEON_DB', 'WEBSITE_URL'];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const SONG_CHANNEL_ID = process.env.SONG_CHANNEL_ID;
export const NEON_DB = process.env.NEON_DB;
export const WEBSITE_URL = process.env.WEBSITE_URL;