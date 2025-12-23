import http from 'http';
import logger from './logger.js';

const PORT = process.env.PORT || process.env.HEALTH_PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

export function startHealthServer() {
    server.listen(PORT, () => {
        logger.info(`Health check server listening on port ${PORT}`);
    });
}

export function stopHealthServer() {
    server.close(() => {
        logger.info('Health check server stopped');
    });
}