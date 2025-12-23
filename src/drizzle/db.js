import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { songs } from './schema.js';
import logger from '../logger.js';

const sql = neon(process.env.NEON_DB);
export const db = drizzle(sql);

export async function saveSong(song) {
    logger.info("Saving song", { song });

    try {
        // Check for duplicates
        const existing = await db.select().from(songs).where(eq(songs.url, song.url));
        if (existing.length > 0) {
            logger.warn("Duplicate song URL, skipping", { url: song.url });
            return;
        }

        const result = await db.insert(songs).values(song).returning();
        logger.info("Song saved successfully", { result });
    } catch (error) {
        logger.error("Error saving song", { error: error.message, song });
    }
}
