import { CommandInteractionOptionResolver } from "discord.js";
import { Event } from "../structure/event";
import { client } from "../bot";
import { ExtendedInteraction } from "../typings/commands";

export default new Event("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply().catch(() => { });
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.followUp({ content: "An error has occured" });

        try {
            await command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction,
            });
        } catch (error) {
            console.log(error);
            await interaction.followUp({ content: "An error has occured" });
        }
    }
});