import {
    PermissionResolvable,
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    GuildMember,
    Message,
} from "discord.js";
import { ExtendedClient } from "../structure/client";

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
}

interface SlashRunOptions {
    client: ExtendedClient;
    interaction: ExtendedInteraction;
    args: CommandInteractionOptionResolver;
}

interface PrefixRunOptions {
    client: ExtendedClient;
    message: Message;
    args: string[];
    prefix: string;
}

type SlashRunFunction = (options: SlashRunOptions) => any;
type PrefixRunFunction = (options: PrefixRunOptions) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    aliases?: string[];
    category?: string;
    run: SlashRunFunction;
    prefixRun?: PrefixRunFunction;
} & ChatInputApplicationCommandData;