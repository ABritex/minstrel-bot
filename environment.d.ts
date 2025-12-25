declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "dev" | "prod";
            DISCORD_TOKEN: string;
            SONG_CHANNEL_ID: string;
            DATABASE_URL: string;
            WEBSITE_URL: string;
        }
    }
}

export { };