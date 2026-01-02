import { Event } from "../structure/event";
import { client } from "../bot";
import { PREFIX, SONG_CHANNEL_ID } from "../config";
import { isValidSongUrl } from "../utils/validator";
import { isRateLimited } from "../utils/rate-limiter";
import { saveSong } from "../drizzle/db";
import logger from "../logger";

export default new Event("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Handle prefix commands
    if (message.content.startsWith(PREFIX)) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        const command = client.getCommand(commandName);
        if (!command) return;

        // Check if command has prefix handler
        if (!command.prefixRun) {
            message.reply("This command only works as a slash command!");
            return;
        }

        try {
            await command.prefixRun({
                client,
                message,
                args,
                prefix: PREFIX,
            });
        } catch (error) {
            console.error(`Error executing prefix command ${commandName}:`, error);
            message.reply("An error occurred while executing the command!");
        }
        return;
    }

    // Handle song saving
    if (message.channel.id !== SONG_CHANNEL_ID) return;

    if (isRateLimited(message.author.id)) {
        await message.reply("You're sending too many messages. Please slow down.");
        return;
    }

    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const allLinks = message.content.match(urlRegex);

    if (!allLinks) return;

    const validLinks = allLinks
        .map(link => {
            const platform = isValidSongUrl(link);
            if (!platform) {
                logger.debug("Invalid song URL", { link });
                return null;
            }
            return { url: link, platform };
        })
        .filter((item): item is { url: string; platform: string } => {
            // Extra validation
            return item !== null &&
                item.url &&
                item.platform &&
                item.url !== 'undefined' &&
                item.platform !== 'undefined';
        });

    if (validLinks.length === 0) {
        await message.reply("Only music links are allowed (YouTube, Spotify, SoundCloud, Apple Music). Playlists are not supported.");
        return;
    }

    try {
        await Promise.all(validLinks.map(({ url, platform }) => {
            logger.debug("Saving song", { url, platform });
            return saveSong({
                serverId: message.guild.id,
                channelId: message.channel.id,
                messageId: message.id,
                userId: message.author.id,
                url,
                platform
            });
        }));

        await message.react("✅");
    } catch (error) {
        logger.error("Error saving songs", { error });
        await message.reply("An error occurred while saving the song(s).");
    }
});