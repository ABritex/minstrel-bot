import { ExtendedClient } from "./structure/client";

export const client = new ExtendedClient();

export async function startBot() {
    await client.Start();
}
