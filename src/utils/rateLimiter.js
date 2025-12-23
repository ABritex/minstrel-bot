const userRequests = new Map();

const RATE_LIMIT = 5; // requests
const TIME_WINDOW = 60 * 1000; // 1 minute

export function isRateLimited(userId) {
    const now = Date.now();
    const userData = userRequests.get(userId) || { count: 0, resetTime: now + TIME_WINDOW };

    if (now > userData.resetTime) {
        userData.count = 1;
        userData.resetTime = now + TIME_WINDOW;
    } else {
        userData.count++;
    }

    userRequests.set(userId, userData);

    return userData.count > RATE_LIMIT;
}