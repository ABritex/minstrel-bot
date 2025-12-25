import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, Guild, Partials } from "discord.js";
import { CommandType } from "../typings/commands";
import { promisify } from "util";
import glob from "glob";
import { RegisterCommandsOptions } from "../typings/clients";
import { Event } from "./event";
import { DISCORD_TOKEN, GuildID } from "../config";
import logger from "../logger";
import { fileURLToPath } from "url";
import * as path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    aliases: Collection<string, string> = new Collection();

    constructor() {
        super({
            intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMessageReactions"],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction],
        });
    }

    async Start() {
        this.RegisterModules();
        await this.login(DISCORD_TOKEN);
    }

    async ImportFile(path: string) {
        return (await import(path))?.default;
    }

    async RegisterCommands({ Commands, GuildID }: RegisterCommandsOptions) {
        if (GuildID) {
            this.guilds.cache.get(GuildID)?.commands.set(Commands);
            console.log(`Registered ${Commands.length} commands in ${GuildID}`);
        } else {
            this.application?.commands.set(Commands);
            console.log(`Registered ${Commands.length} commands globally`);
        }
    }

    async RegisterModules() {
        const SlashCommands: ApplicationCommandDataResolvable[] = [];
        const CommandFiles = await globPromise(
            `${__dirname}/../commands/**/*{.ts,.js}`
        );

        CommandFiles.forEach(async (FilePath) => {
            const command: CommandType = await this.ImportFile(FilePath);
            if (!command.name) return;

            this.commands.set(command.name, command);
            SlashCommands.push(command);

            if (command.aliases && command.aliases.length > 0) {
                command.aliases.forEach((alias) => {
                    this.aliases.set(alias, command.name);
                });
            }
        });

        this.on("clientReady", () => {
            this.RegisterCommands({
                Commands: SlashCommands,
                GuildID: GuildID,
            });
            logger.info(`Bot logged in as ${this.user.tag}`);
        });

        const EventFiles = await globPromise(`${__dirname}/../events/**/*{.ts,.js}`);

        EventFiles.forEach(async (FilePath) => {
            const event: Event<keyof ClientEvents> = await this.ImportFile(FilePath);
            if (!event.event) return;
            console.log(`Loaded event ${event.event}`);
            this.on(event.event, event.run);
        });
    }

    getCommand(name: string): CommandType | undefined {
        return (
            this.commands.get(name) || this.commands.get(this.aliases.get(name) || "")
        );
    }
}