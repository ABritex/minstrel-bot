import { Client, GatewayIntentBits } from "discord.js";
import { saveSong } from "./drizzle/db.js";
import { DISCORD_TOKEN, SONG_CHANNEL_ID } from "./config.js";
import { isValidSongUrl } from "./utils/validator.js";
import { isRateLimited } from "./utils/rateLimiter.js";
import { loadCommands, getCommand } from "./commands/handler.js";
import logger from "./logger.js";

const PREFIX = '!';

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


export async function startBot() {
    loadCommands();

    client.once("ready", () => {
        logger.info(`Bot logged in as ${client.user.tag}`);
    });

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (!message.guild) return;

        // Handle commands
        if (message.content.startsWith(PREFIX)) {
            const args = message.content.slice(PREFIX.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = getCommand(commandName);
            if (command) {
                try {
                    await command.execute(message, args);
                } catch (error) {
                    logger.error(`Error executing command ${commandName}`, { error: error.message });
                    await message.reply('There was an error executing that command.');
                }
            }
            return;
        }

        if (message.channel.id !== SONG_CHANNEL_ID) return;

        if (isRateLimited(message.author.id)) {
            await message.reply("You're sending too many messages. Please slow down.");
            return;
        }

        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const allLinks = message.content.match(urlRegex);
        if (!allLinks) return;

        const validLinks = allLinks.map(link => {
            const platform = isValidSongUrl(link);
            return platform ? { url: link, platform } : null;
        }).filter(Boolean);

        if (validLinks.length === 0) {
            await message.reply("Only music links are allowed (YouTube, Spotify, SoundCloud, Apple Music). Playlists are not supported.");
            return;
        }

        await Promise.all(validLinks.map(({ url, platform }) => saveSong({
            serverId: message.guild.id,
            channelId: message.channel.id,
            messageId: message.id,
            userId: message.author.id,
            url,
            platform
        })));

        await message.react("✅");
    });

    await client.login(DISCORD_TOKEN);
}
