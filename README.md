# ASCII Canvas 🎨

Turn any photo into ASCII canvas art. Upload a photo, customise the text and background, then download a poster-ready image.

**Live:** https://ascii-canvas-254.pages.dev

## Features

- Upload a photo from phone or desktop
- 4 detail levels: Low (80×80) to Ultra (240×240)
- 4 character ramps: Simple, Dense, Blocks, Binary, plus custom
- Customisable text colour, background colour, gradients, rainbow
- Brightness, contrast and invert controls
- 8 presets: Classic Terminal, Gallery Print, Neon, Rainbow Poster, Blueprint, etc.
- Before/after toggle to compare with original
- Export: PNG (1080×1080), TXT, copy-to-clipboard
- **100% client-side** — your photo never leaves your browser
- Responsive mobile-first design

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- HTML Canvas API (all rendering is canvas-native)
- Cloudflare Pages (hosting)

## Development

```bash
npm install
npm run dev     # local dev server
npm run build   # production build
npm run preview # preview production build
```

## Deployment

The site deploys to Cloudflare Pages. Push to `main` to trigger an auto-deploy:

```bash
npm run build
wrangler pages deploy dist --project-name=ascii-canvas
```

## Future

- [ ] Printify integration for canvas/poster prints
- [ ] D1 database for artwork metadata
- [ ] R2 storage for uploaded originals and exports
- [ ] Shareable gallery URLs
- [ ] Web Worker for heavy ASCII generation on Ultra mode
- [ ] More output sizes (e.g. A4 poster, square canvas, social media)
