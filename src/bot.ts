import { ExtendedClient } from "./structure/client";
import { initializePlayer } from './music/player';
export const client = new ExtendedClient();

export async function startBot() {
    await initializePlayer(client);
    await client.Start();
}
