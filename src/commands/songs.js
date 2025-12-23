import { db } from '../drizzle/db.js';
import { songs } from '../drizzle/schema.js';
import { desc } from 'drizzle-orm';
import { WEBSITE_URL } from '../config.js';

export const command = {
    name: 'songs',
    description: 'Shows the website link and lists recent saved songs',
    execute: async (message, args) => {
        try {
            const recentSongs = await db.select().from(songs).orderBy(desc(songs.id)).limit(10);

            let response = `Check out our song collection: ${WEBSITE_URL}\n\n**Recent Songs:**\n`;

            if (recentSongs.length === 0) {
                response += 'No songs saved yet.';
            } else {
                recentSongs.forEach((song, index) => {
                    response += `${index + 1}. ${song.url} (${song.platform})\n`;
                });
            }

            await message.reply(response);
        } catch (error) {
            console.error('Error fetching songs:', error);
            await message.reply('Sorry, there was an error retrieving the songs.');
        }
    }
};