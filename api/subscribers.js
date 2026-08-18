const { createClient } = require('redis');

let redisClient;
let redisConnection;

async function getRedis() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (error) => console.error('Redis client error', error));
    redisConnection = redisClient.connect();
  }

  await redisConnection;
  return redisClient;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const providedToken = req.query.token || req.headers['x-admin-token'];
  const expectedToken = process.env.ADMIN_TOKEN;

  if (!expectedToken || providedToken !== expectedToken) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const redis = await getRedis();
    if (!redis) {
      return res.status(503).json({ message: 'Subscriber storage is not configured. Set REDIS_URL in Vercel and redeploy.' });
    }

    const rawEntries = await redis.lRange('subscribers', 0, -1);
    const subscribers = rawEntries.map((entry) => (typeof entry === 'string' ? JSON.parse(entry) : entry));

    return res.status(200).json({ count: subscribers.length, subscribers });
  } catch (error) {
    console.error('List subscribers error', error);
    return res.status(500).json({ message: 'Unable to load subscribers right now.' });
  }
};
