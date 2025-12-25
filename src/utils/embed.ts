import { EmbedBuilder, ColorResolvable } from "discord.js";

export class EmbedUtil {
    static createEmbed(
        title: string,
        description: string,
        color: ColorResolvable = "#5865F2",
        fields?: { name: string; value: string; inline?: boolean }[]
    ): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: "Minstrel Bot" });

        if (fields) {
            embed.addFields(fields);
        }

        return embed;
    }

    static createSuccessEmbed(title: string, description: string): EmbedBuilder {
        return this.createEmbed(title, description, "#57F287");
    }

    static createErrorEmbed(title: string, description: string): EmbedBuilder {
        return this.createEmbed(title, description, "#ED4245");
    }

    static createInfoEmbed(title: string, description: string): EmbedBuilder {
        return this.createEmbed(title, description, "#5865F2");
    }
}