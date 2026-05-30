# Seton Vet Clinic SOP APP

A GitHub Pages-ready, browser-based SOP builder for Seton Veterinary Clinic.

## What it does

- Create and edit SOPs from a responsive dashboard.
- Add SOP details, purpose, safety notes, tools/PPE, full field sections, procedure steps, and photos.
- Add unlimited full field sections.
- Add unlimited lines inside each full field section.
- Upload photos into the SOP. Images are compressed in-browser and saved inside the SOP data.
- Autosave the current SOP in the browser.
- Save SOP drafts into a local browser library.
- Submit SOPs for review or mark them as published.
- Export / save editable `.json` SOP backup files to a local hard drive.
- Import SOP `.json` backup files.
- Download a standalone printable HTML SOP.
- Print or save as PDF using the browser print dialog.
- Works on desktop, tablet, and phone.
- Can be installed as a simple PWA from a supported browser.

## Important storage note

This version is a fully functional front-end app. SOPs are saved locally in the user's browser using `localStorage`. For multi-user clinic-wide syncing, shared logins, permissions, approvals, or cloud backups, a backend/database can be added later.

For safety, staff should regularly use **Download SOP File** or **Save to Local Hard Drive** to create backup files.

## How to test locally

Option 1: Open `index.html` directly in a browser.

Option 2: Run a local server from this folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How to upload to GitHub Pages

1. Create a new GitHub repository.
2. Upload every file and folder in this package.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/root` folder.
6. Save and wait for GitHub Pages to publish the site.

## Files

```text
index.html              Main app shell
styles.css              Seton-branded responsive styling
app.js                  SOP builder functionality
manifest.webmanifest    PWA metadata
sw.js                   Offline cache/service worker
assets/                 Logo and app icons
```

## Branding

The package uses the corrected Seton Veterinary Clinic logo asset with the local-business badge/pin element removed while preserving the rest of the logo.
