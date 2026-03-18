# 💼 Rozgar Sathi

> Sarkari Naukri One Stop Shop — Free government job portal for UPSC, BPSC, SSC, Railway, Banking aspirants.

**Developed by Er. Sangam Krishna**

## Features

- 📋 Sarkari vacancy listings with eligibility, fees, dates, apply links
- 💰 Fee structure for all categories (General/OBC/SC/ST/Female)
- 📄 Free resume builder with PDF download (watermarked)
- 📊 Application tracker
- 🔐 Google Sign-In (SSO with Samachar Sathi & Pariksha Sathi)
- 🌐 Hindi/English toggle
- 📱 Mobile friendly
- 💡 AdSense ready (multipage — AdSense compliant)

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Firebase Auth + Firestore (same project as Samachar-Sathi)
- jsPDF + html2canvas
- GitHub Pages deployment

## Setup

```bash
cd rozgar-sathi
npm install
npm run dev
```

## Deploy

Push to `main` branch — GitHub Actions auto-deploys to GitHub Pages.

Add Firebase secrets in GitHub repo Settings → Secrets:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## AdSense Setup

Replace `ca-pub-XXXXXXXXXXXXXXXX` in `index.html` and `AdBanner.tsx` with your publisher ID.

## Sathi Series

| App | Description |
|-----|-------------|
| [Samachar Sathi](https://snakeeye-sudo.github.io/Samachar-Sathi/) | Daily news analysis & MCQ |
| [Pariksha Sathi](https://snakeeye-sudo.github.io/pariksha-sathi/) | Study planner |
| Rozgar Sathi | Sarkari jobs one stop shop |

One Google login works across all three apps.

---
Made with ❤️ for UPSC/BPSC aspirants | Last Updated: March 2026
