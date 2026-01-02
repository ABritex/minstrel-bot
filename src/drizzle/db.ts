import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { songs, NewSong } from './schema';
import logger from '../logger';
import { DATABASE_URL } from '../config';

const sql = neon(DATABASE_URL);
export const db = drizzle(sql);

export async function saveSong(song: NewSong): Promise<void> {
    logger.info("Saving song", { song });

    // Validate URL before saving
    if (!song.url || song.url === 'undefined' || song.url === 'null') {
        logger.warn("Invalid song URL, not saving", { song });
        return;
    }

    try {
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
