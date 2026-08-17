# Thrinta Kickstarter Pre‑Launch Landing Page

This package is a responsive static landing page designed to collect email signups before the Thrinta Kickstarter campaign launches.

## Files

- `index.html` — main pre-launch landing page
- `styles.css` — all responsive styling and visual card/box mockups
- `script.js` — reveal effects, year, and UTM source capture
- `thank-you.html` — signup confirmation page
- `privacy.html` — editable starter privacy notice
- `robots.txt` and `sitemap.xml` — basic SEO files

## Fastest way to make email collection work

### Option A — Netlify Forms (already wired in)

The forms are already marked with `data-netlify="true"`. Deploy this folder to Netlify and Netlify will detect the forms. Signups will appear in the site's Forms area. Configure Netlify form notifications or export/sync submissions to your email platform.

If your existing `thrinta.com` site is not on Netlify, you can still use the page design but should choose Option B or C.

### Option B — Connect your email platform directly

Replace each form's `action` and field names with the embed/action values supplied by your email provider (for example Mailchimp, Brevo, Kit, Klaviyo, MailerLite, etc.). Keep the visible HTML/CSS unchanged.

### Option C — Your own `/api/subscribe` endpoint

Change both form actions from `/thank-you.html` to your own subscription endpoint and return/redirect to `thank-you.html` after a successful signup. This is best if the website already has a backend.

## Before going live

1. Replace the bracketed legal information in `privacy.html`.
2. Confirm that `hello@thrinta.com` is the contact address you want to publish.
3. Connect the forms to the email-list destination you actually use.
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
