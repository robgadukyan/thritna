const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

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
    const rawEntries = await redis.lrange('subscribers', 0, -1);
    const subscribers = rawEntries.map((entry) => (typeof entry === 'string' ? JSON.parse(entry) : entry));

    return res.status(200).json({ count: subscribers.length, subscribers });
  } catch (error) {
    console.error('List subscribers error', error);
    return res.status(500).json({ message: 'Unable to load subscribers right now.' });
  }
};
