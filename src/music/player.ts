import { Player } from 'discord-player';
import { Client } from 'discord.js';
import { DefaultExtractors } from '@discord-player/extractor';

export let player: Player;

export async function initializePlayer(client: Client) {
    player = new Player(client);
    // Load default extractors
    await player.extractors.loadMulti(DefaultExtractors);
}