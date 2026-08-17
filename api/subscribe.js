const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const defaultStorePath = '/tmp/thrinta-subscribers.json';

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

function getStorePath() {
  return process.env.SUBSCRIBERS_FILE || defaultStorePath;
}

function readSubscribers() {
  const storePath = getStorePath();
  const directory = path.dirname(storePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, '[]', 'utf8');
  }

  try {
    const raw = fs.readFileSync(storePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    fs.writeFileSync(storePath, '[]', 'utf8');
    return [];
  }
}

function writeSubscribers(subscribers) {
  const storePath = getStorePath();
  const directory = path.dirname(storePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(storePath, JSON.stringify(subscribers, null, 2), 'utf8');
}

function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const subscribers = readSubscribers();
    return res.status(200).json({ count: subscribers.length, subscribers });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  try {
    const body = await parseBody(req);
    const email = String(body.email || '').trim();
    const consent = String(body.marketing_consent || '').trim();

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (!consent || consent === 'false' || consent === 'off') {
      return res.status(400).json({ message: 'Consent is required to subscribe.' });
    }

    const subscribers = readSubscribers();
    const alreadyExists = subscribers.some((entry) => entry.email.toLowerCase() === email.toLowerCase());

    if (!alreadyExists) {
      subscribers.unshift({
        email,
        consent: true,
        createdAt: new Date().toISOString(),
        source: body.utm_source || 'direct',
        medium: body.utm_medium || '',
        campaign: body.utm_campaign || '',
      });
      writeSubscribers(subscribers);
    }

    return res.writeHead(303, { Location: '/thank-you.html' }).end();
  } catch (error) {
    console.error('Subscribe error', error);
    return res.status(500).json({ message: 'Unable to save your signup right now. Please try again.' });
  }
};
