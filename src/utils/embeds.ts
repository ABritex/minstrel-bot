import { EmbedUtil } from "./embed";
import { User, GuildMember, Guild } from "discord.js";

// Shared function to create profile embed
export function createProfileEmbed(user: User, member: GuildMember) {
    const roles = member.roles.cache
        .filter((role) => role.id !== member.guild.id)
        .map((role) => role.name)
        .join(", ") || "No roles";

    const embed = EmbedUtil.createInfoEmbed(
        `👤 ${user.username}'s Profile`,
        `**User Information**`
    );

    embed.addFields(
        { name: "🆔 User ID", value: user.id, inline: true },
        {
            name: "📅 Created",
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
            inline: true,
        },
        {
            name: "🎭 Nickname",
            value: member.nickname || "None",
            inline: true,
        },
        {
            name: "📥 Joined Server",
            value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`,
            inline: true,
        },
        { name: "🎨 Color", value: member.displayHexColor, inline: true },
        {
            name: "🔑 Key Permissions",
            value:
                member.permissions.toArray().slice(0, 5).join(", ") || "None",
            inline: true,
        },
        {
            name: "🏷️ Roles",
            value: roles.length > 1024 ? "Too many roles to display" : roles,
            inline: false,
        }
    );

    embed.setThumbnail(user.displayAvatarURL({ size: 256 }));

    return embed;
}

// Shared function to create server embed
export async function createServerEmbed(guild: Guild) {
    const owner = await guild.fetchOwner();
    const channels = guild.channels.cache;
    const roles = guild.roles.cache;
    const emojis = guild.emojis.cache;

    const embed = EmbedUtil.createInfoEmbed(
        `🏠 ${guild.name} Server Information`,
        `**Server Details**`
    );

    embed.addFields(
        { name: "🆔 Server ID", value: guild.id, inline: true },
        { name: "👑 Owner", value: owner.user.tag, inline: true },
        { name: "📅 Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
        { name: "🤖 Bots", value: `${guild.members.cache.filter(m => m.user.bot).size}`, inline: true },
        { name: "👤 Humans", value: `${guild.members.cache.filter(m => !m.user.bot).size}`, inline: true },
        { name: "📺 Channels", value: `${channels.size}`, inline: true },
        { name: "💬 Text Channels", value: `${channels.filter(c => c.type === 0).size}`, inline: true },
        { name: "🔊 Voice Channels", value: `${channels.filter(c => c.type === 2).size}`, inline: true },
        { name: "🏷️ Roles", value: `${roles.size}`, inline: true },
        { name: "😀 Emojis", value: `${emojis.size}`, inline: true },
        { name: "🚀 Boost Level", value: `Level ${guild.premiumTier}`, inline: true },
        { name: "⭐ Boost Count", value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
        { name: "🔒 Verification", value: guild.verificationLevel.toString(), inline: true },
        { name: "📝 Description", value: guild.description || "No description", inline: false }
    );

    if (guild.icon) {
        embed.setThumbnail(guild.iconURL({ size: 256 })!);
    }

    return embed;
}

// Shared function to create bot embed
export function createBotEmbed(client: any) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const embed = EmbedUtil.createInfoEmbed(
        "🤖 Minstrel Bot Information",
        "**Bot Statistics and Information**"
    );

    embed.addFields(
        { name: "📊 Commands", value: `${client.commands.size}`, inline: true },
        { name: "⏰ Uptime", value: uptimeString, inline: true },
        {
            name: "🏠 Servers",
            value: `${client.guilds.cache.size}`,
            inline: true,
        },
        { name: "👥 Users", value: `${client.users.cache.size}`, inline: true },
        {
            name: "💾 Memory",
            value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                2
            )} MB`,
            inline: true,
        },
        { name: "🖥️ Platform", value: process.platform, inline: true },
        { name: "📦 Node.js", value: process.version, inline: true },
        { name: "🔧 Discord.js", value: "v14.11.0", inline: true },
        { name: "⚡ Latency", value: `${client.ws.ping}ms`, inline: true }
    );

    embed.setThumbnail(client.user?.displayAvatarURL({ size: 256 })!);

    return embed;
}