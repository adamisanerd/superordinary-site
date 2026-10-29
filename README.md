# superordinarymusic.com static site

A responsive, framework-free HTML/CSS/JS website based on the approved superordinary mockup.

## Run locally

Open `index.html` directly in a browser, or run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

Copy all files to any static web server, S3-compatible static host, Nginx, Apache, or an OpenShift container serving static files.

## Before publishing

- Replace the placeholder email `hello@superordinarymusic.com` with a real contact address.
- Add real streaming links once releases are available. The site intentionally doesn't invent links.
- Review the EP tracklist: this uses the **original three-track EP**, with the newer songs treated as works in progress.
- Replace or adjust artwork and portraits in `assets/` as needed. The artist image is AI-generated, not a verified exact likeness.
- Confirm you have the rights to publish all imagery.

## Files

- `index.html`: semantic site structure and copy
- `styles.css`: responsive styling
- `script.js`: mobile navigation and copyright year
- `assets/`: locally bundled, compressed WebP images

No npm install, external fonts, analytics, or third-party scripts are required.

## Play counter (GoatCounter)

The music player counts one play each time a song starts. To turn it on:

1. Sign up free at https://www.goatcounter.com and pick a code (for example `superordinary`).
2. Open `script.js` and set `GOATCOUNTER_CODE` at the top to that code: `const GOATCOUNTER_CODE='superordinary';`
3. Upload the site. Plays show in your GoatCounter dashboard under paths like `play/something-worth-dying-for`, alongside regular page visits.
