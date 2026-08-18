const { createClient } = require('redis');
const querystring = require('querystring');

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

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        if (!raw) {
          resolve({});
          return;
        }

        const contentType = req.headers['content-type'] || '';

        if (contentType.includes('application/json')) {
          resolve(JSON.parse(raw));
          return;
        }

        const parsed = querystring.parse(raw);
        const normalized = {};

        Object.entries(parsed).forEach(([key, value]) => {
          normalized[key] = Array.isArray(value) ? value[0] : value;
        });

        resolve(normalized);
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  try {
    const redis = await getRedis();
    if (!redis) {
      return res.status(503).json({ message: 'Signup storage is not configured. Set REDIS_URL in Vercel and redeploy.' });
    }

    const body = await parseBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const consent = String(body.marketing_consent || '').trim();

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (!consent || consent === 'false' || consent === 'off') {
      return res.status(400).json({ message: 'Consent is required to subscribe.' });
    }

    const alreadyExists = await redis.sIsMember('subscriber_emails', email);

    if (!alreadyExists) {
      await redis.sAdd('subscriber_emails', email);
      await redis.lPush('subscribers', JSON.stringify({
        email,
        createdAt: new Date().toISOString(),
        source: body.utm_source || 'direct',
        medium: body.utm_medium || '',
        campaign: body.utm_campaign || '',
      }));
    }

    return res.writeHead(303, { Location: '/thank-you.html' }).end();
  } catch (error) {
    console.error('Subscribe error', error);
    return res.status(500).json({ message: 'Unable to save your signup right now. Please try again.' });
  }
};
