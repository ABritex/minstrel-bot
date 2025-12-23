import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = new Map();

export function loadCommands() {
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'handler.js');

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        import(filePath).then(module => {
            const cmd = module.command;
            if (cmd && cmd.name) {
                commands.set(cmd.name, cmd);
                logger.info(`Loaded command: ${cmd.name}`);
            }
        }).catch(error => {
            logger.error(`Failed to load command ${file}`, { error: error.message });
        });
    }
}

export function getCommand(name) {
    return commands.get(name);
}

export function getAllCommands() {
    return Array.from(commands.values());
}