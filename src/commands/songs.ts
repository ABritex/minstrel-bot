import { Command } from '../structure/command';
import { db } from '../drizzle/db';
import { songs, Song } from '../drizzle/schema';
import { desc, count } from 'drizzle-orm';
import { WEBSITE_URL } from '../config';
import { EmbedUtil } from '../utils/embed';
import { getSongTitle } from '../utils/songTitle';
import { ApplicationCommandOptionType } from 'discord.js';

export default new Command({
    name: 'songs',
    description: 'Shows the website link and lists saved songs with pagination',
    category: 'info',
    options: [
        {
            name: 'page',
            description: 'Page number to view',
            type: ApplicationCommandOptionType.Integer,
            required: false,
            min_value: 1
        }
    ],
    run: async ({ interaction, args }) => {
        try {
            const page = args.getInteger('page') || 1;
            const limit = 10;
            const offset = (page - 1) * limit;

            const [recentSongs, totalCount] = await Promise.all([
                db.select().from(songs).orderBy(desc(songs.id)).limit(limit).offset(offset),
                db.select({ count: count() }).from(songs)
            ]);

            const totalSongs = totalCount[0].count;
            const totalPages = Math.ceil(totalSongs / limit);

            const embed = EmbedUtil.createInfoEmbed(
                'Song Collection',
                `Page ${page} of ${totalPages}\nCheck out our song collection: ${WEBSITE_URL}`
            );

            const songList = recentSongs.length === 0
                ? 'No songs on this page.'
                : (await Promise.all(recentSongs.map(async (song, index) => {
                    const title = await getSongTitle(song.url, song.platform);
                    return `${offset + index + 1}. [${title}](${song.url})`;
                }))).join('\n');

            embed.addFields({
                name: 'Recent Songs',
                value: songList,
                inline: false
            });

            if (totalPages > 1) {
                embed.setFooter({ text: 'Use /songs page:2 or reactions ⏪ ⏭️ for navigation' });
            }

            const reply = await interaction.followUp({ embeds: [embed] });

            if (totalPages > 1) {
                await reply.react('⏪');
                await reply.react('⏭️');
            }
        } catch (error) {
            await interaction.followUp('Sorry, there was an error retrieving the songs.');
        }
    },
    prefixRun: async ({ message, args }) => {
        try {
            const page = parseInt(args[0]) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;

            const [recentSongs, totalCount] = await Promise.all([
                db.select().from(songs).orderBy(desc(songs.id)).limit(limit).offset(offset),
                db.select({ count: count() }).from(songs)
            ]);

            const totalSongs = totalCount[0].count;
            const totalPages = Math.ceil(totalSongs / limit);

            const embed = EmbedUtil.createInfoEmbed(
                'Song Collection',
                `Page ${page} of ${totalPages}\nCheck out our song collection: ${WEBSITE_URL}`
            );

            const songList = recentSongs.length === 0
                ? 'No songs on this page.'
                : (await Promise.all(recentSongs.map(async (song, index) => {
                    const title = await getSongTitle(song.url, song.platform);
                    return `${offset + index + 1}. [${title}](${song.url})`;
                }))).join('\n');

            embed.addFields({
                name: 'Recent Songs',
                value: songList,
                inline: false
            });

            if (totalPages > 1) {
                embed.setFooter({ text: 'Use !songs 2 or reactions ⏪ ⏭️ for navigation' });
            }

            const reply = await message.reply({ embeds: [embed] });

            if (totalPages > 1) {
                await reply.react('⏪');
                await reply.react('⏭️');
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            await message.reply('Sorry, there was an error retrieving the songs.');
        }
    },
});