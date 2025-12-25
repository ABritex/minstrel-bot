import { CommandType } from "../typings/commands";

export class Command {
    constructor(CommandOptions: CommandType) {
        Object.assign(this, CommandOptions);
    }
}