export const command = {
    name: 'ping',
    description: 'Replies with Pong!',
    execute: async (message, args) => {
        await message.reply('Pong!');
    }
};