import { startBot, client } from "./bot.js";
import { startHealthServer, stopHealthServer } from "./health.js";
import logger from "./logger.js";

async function bootstrap() {
    logger.info("Starting Minstrel Bot...");
    startHealthServer();
    await startBot();
}

async function shutdown() {
    logger.info("Shutting down gracefully...");
    stopHealthServer();
    client.destroy();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

bootstrap().catch((error) => {
    logger.error("Failed to start bot", { error: error.message });
    process.exit(1);
});
