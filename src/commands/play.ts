import { Command } from '../structure/command';
import { isValidSongUrl } from '../utils/validator';
import { db } from '../drizzle/db';
import { songs } from '../drizzle/schema';
import { desc, and, ne } from 'drizzle-orm';
import { player } from '../music/player';

export default new Command({
    name: 'play',
    description: 'Plays the latest saved song in your voice channel',
    category: 'music',
    run: async ({ interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.followUp('You must be in a voice channel to play music.');
        }

        const [latestSong] = await db
            .select()
            .from(songs)
            .where(
                and(
                    ne(songs.url, 'undefined'),
                    ne(songs.url, 'null')
                )
            )
            .orderBy(desc(songs.id))
            .limit(1);

        if (!latestSong) {
            return interaction.followUp('No valid songs saved yet.');
        }

        let url = latestSong.url;

        if (!url || url === 'undefined' || url === 'null' || !isValidSongUrl(url)) {
            return interaction.followUp('The latest song has an invalid URL.');
        }

        try {
            const parsedUrl = new URL(url);
            url = parsedUrl.origin + parsedUrl.pathname;
        } catch { }

        try {
            const { track } = await player.play(interaction.member.voice.channel, url, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.guild?.members.me,
                        requestedBy: interaction.user
                    }
                }
            });

            await interaction.followUp(`Now playing: **${track.title}** by ${track.author}`);
        } catch (error) {
            console.error('Error playing song:', error);
            await interaction.followUp('Failed to play the song. The URL might be invalid or restricted.');
        }
    },
    prefixRun: async ({ message }) => {
        if (!message.member.voice.channel) {
            return message.reply('You must be in a voice channel to play music.');
        }

        const [latestSong] = await db
            .select()
            .from(songs)
            .where(
                and(
                    ne(songs.url, 'undefined'),
                    ne(songs.url, 'null')
                )
            )
            .orderBy(desc(songs.id))
            .limit(1);

        if (!latestSong) {
            return message.reply('No valid songs saved yet.');
        }

        let url = latestSong.url;

        if (!url || url === 'undefined' || url === 'null' || !isValidSongUrl(url)) {
            return message.reply('The latest song has an invalid URL.');
        }

        try {
            const parsedUrl = new URL(url);
            url = parsedUrl.origin + parsedUrl.pathname;
        } catch { }

        try {
            const { track } = await player.play(message.member.voice.channel, url, {
                nodeOptions: {
                    metadata: {
                        channel: message.channel,
                        client: message.guild?.members.me,
                        requestedBy: message.author
                    }
                }
            });

            await message.reply(`Now playing: **${track.title}** by ${track.author}`);
        } catch (error) {
            console.error('Error playing song:', error);
            await message.reply('Failed to play the song. The URL might be invalid or restricted.');
        }
    },
});