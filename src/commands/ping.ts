import { Command } from '../structure/command';

export default new Command({
    name: 'ping',
    description: 'Replies with Pong!',
    aliases: ['p'],
    category: 'info',
    run: async ({ interaction }) => {
        await interaction.followUp('Pong! 🏓');
    },
    prefixRun: async ({ message }) => {
        await message.reply('Pong! 🏓');
    },
});