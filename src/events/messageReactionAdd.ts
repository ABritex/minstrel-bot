import { Event } from "../structure/event";
import { client } from "../bot";
import { db } from "../drizzle/db";
import { songs } from "../drizzle/schema";
import { desc, count } from "drizzle-orm";
import { EmbedUtil } from "../utils/embed";
import { getSongTitle } from "../utils/songTitle";
import { WEBSITE_URL } from "../config";

export default new Event("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;

    if (reaction.emoji.name === '⏪' || reaction.emoji.name === '⏭️') {
        const message = reaction.message;
        if (message.author.id !== client.user.id) return;

        if (message.embeds.length > 0 && message.embeds[0].title === 'Song Collection') {
            const description = message.embeds[0].description || '';
            const pageMatch = description.match(/Page (\d+) of (\d+)/);
            if (pageMatch) {
                const currentPage = parseInt(pageMatch[1]);
                const totalPages = parseInt(pageMatch[2]);
                let newPage = currentPage;

                if (reaction.emoji.name === '⏪') {
                    newPage = Math.max(1, currentPage - 1);
                } else if (reaction.emoji.name === '⏭️') {
                    newPage = Math.min(totalPages, currentPage + 1);
                }

                if (newPage !== currentPage) {
                    const limit = 10;
                    const offset = (newPage - 1) * limit;

                    const [recentSongs, totalCount] = await Promise.all([
                        db.select().from(songs).orderBy(desc(songs.id)).limit(limit).offset(offset),
                        db.select({ count: count() }).from(songs)
                    ]);

                    const totalSongs = totalCount[0].count;

                    const embed = EmbedUtil.createInfoEmbed(
                        'Song Collection',
                        `Page ${newPage} of ${totalPages}\nCheck out our song collection: ${WEBSITE_URL}`
                    );

                    const songList = recentSongs.length === 0
                        ? 'No songs on this page.'
                        : (await Promise.all(recentSongs.map(async (song, index) => {
                            const title = await getSongTitle(song.url, song.platform);
                            return `${offset + index + 1}. [${title}](${song.url})`;
                        }))).join('\n');

                    embed.addFields({
                        name: 'Songs',
                        value: songList,
                        inline: false
                    });

                    if (totalPages > 1) {
                        embed.setFooter({ text: 'Use reactions to navigate ⏪ ⏭️' });
                    }

                    await message.edit({ embeds: [embed] });
                }
            }

            await reaction.users.remove(user.id);
        }
    }
});