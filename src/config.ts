import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "prod"]).default("dev"),
    DISCORD_TOKEN: z.string(),
    SONG_CHANNEL_ID: z.string(),
    DATABASE_URL: z.string().url(),
    WEBSITE_URL: z.string().url(),
    GuildID: z.string().optional(),
    PREFIX: z.string().default("!"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

const env = parsed.data;

export const DISCORD_TOKEN = env.DISCORD_TOKEN;
export const SONG_CHANNEL_ID = env.SONG_CHANNEL_ID;
export const DATABASE_URL = env.DATABASE_URL;
export const WEBSITE_URL = env.WEBSITE_URL;
export const GuildID = env.GuildID;
export const PREFIX = env.PREFIX;