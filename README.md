# Thrinta Kickstarter Pre‑Launch Landing Page

This package is a responsive static landing page designed to collect email signups before the Thrinta Kickstarter campaign launches.

## Files

- `index.html` — main pre-launch landing page
- `styles.css` — all responsive styling and visual card/box mockups
- `script.js` — reveal effects, year, and UTM source capture
- `thank-you.html` — signup confirmation page
- `privacy.html` — editable starter privacy notice
- `robots.txt` and `sitemap.xml` — basic SEO files

## Email signup setup

The forms submit to the Vercel function at `/api/subscribe`. It saves entries in the Redis database connected through Vercel and redirects successful submissions to `thank-you.html`.

In the Vercel project for `thrinta.com`, ensure these environment variables are available for **Production**, then redeploy:

- `REDIS_URL` — automatically supplied when the Vercel Redis database is connected to this project
- `ADMIN_TOKEN` — a long, unique secret you choose for viewing subscribers

Do not place either value in `index.html`, `script.js`, or GitHub.

## Viewing subscribers

After setting `ADMIN_TOKEN`, open this URL in a private browser window, replacing the placeholder with that exact value:

`https://www.thrinta.com/api/subscribers?token=YOUR_ADMIN_TOKEN`

The endpoint returns JSON with the subscriber count and email records. A `401 Unauthorized` response means the supplied token does not exactly match Vercel's `ADMIN_TOKEN`; a `500` response means the Redis database cannot be reached.

## Before going live

1. Replace the bracketed legal information in `privacy.html`.
2. Confirm that `hello@thrinta.com` is the contact address you want to publish.
3. Confirm `REDIS_URL` and `ADMIN_TOKEN` are set in Vercel and redeploy.
4. Add a social-sharing image later by adding an `og:image` meta tag to `index.html`.
5. Add analytics only after choosing your platform and implementing any cookie/consent requirements that apply.
6. Test one signup on desktop and mobile and verify it arrives in your list.
7. Test the unsubscribe mechanism in the email provider you choose.

## Recommended pre-launch list fields

Keep the first conversion step minimal: email + consent. The page also captures UTM source parameters automatically. Avoid asking for name, country, phone, or survey questions on the first signup form unless you have a clear reason; every extra field can increase friction.

## Suggested campaign URLs

Use campaign-tagged links when promoting the page, for example:

- Instagram: `https://thrinta.com/?utm_source=instagram&utm_medium=social&utm_campaign=prelaunch`
- TikTok: `https://thrinta.com/?utm_source=tiktok&utm_medium=social&utm_campaign=prelaunch`
- Facebook: `https://thrinta.com/?utm_source=facebook&utm_medium=social&utm_campaign=prelaunch`
- QR / physical event: `https://thrinta.com/?utm_source=qr&utm_medium=offline&utm_campaign=prelaunch`

Those values are stored with the form submission so you can compare where signups came from.

## Content intentionally left flexible

The page does not claim a final player count, age rating, playtime, retail/Kickstarter price, reward structure, shipping promise, or guaranteed edition availability. Add those only after the campaign details are locked.
