# Synthetic-Bull Trading Dashboard (Frontend)

This is the trading dashboard UI built with React + Vite. It can run in two modes:

- Demo mode (mock data only, no backend required)
  https://synthetic-bull-trading-exchange.vercel.app/trading-charts
- Live mode (connected to a backend REST + WebSocket service)

## Requirements

- Node.js 18+ (20+ recommended)
- npm 9+

## Local Demo (Mock Data)

1) Create a `.env` file in this folder:

```env
VITE_USE_MOCKS=true
```

2) Install and run:

```bash
npm install
npm run dev
```

3) Open:

- http://localhost:5173/trading-charts

## Connect to a Backend (Live Data)

Vite reads environment variables at build time. Set these and rebuild:

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=https://your-backend-domain
VITE_WS_BASE_URL=wss://your-backend-domain
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Notes:

- `VITE_API_BASE_URL` should have no trailing slash.
- Use `ws://` for local dev and `wss://` for HTTPS deployments.
- `VITE_GOOGLE_CLIENT_ID` is optional but required for Google sign-in.

## Production Build

```bash
npm run build
```

The output is in `dist/`.

## Static Deployment (Demo or Live)

Upload the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, S3, etc.).

Important routing notes:

- The trading dashboard entry is `dashboard.html`.
- The app routes to `/trading-charts`.
- Configure your host to rewrite all routes to `dashboard.html`.

Example rewrite rule (conceptual):

```
/*  /dashboard.html  200
```

If your host lets you select a default entry, choose `dashboard.html`.


## Environment Reference

See `.env.example` for a template.
