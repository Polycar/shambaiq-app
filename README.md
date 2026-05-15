# ShambaIQ Frontend

SEO-first Next.js frontend for ShambaIQ — precision agriculture for every Kenyan farmer. **2,767+ auto-generated pages** from CSV data, zero manual content creation needed.

## Pages Generated

| Source | Pages | URL Pattern |
|--------|-------|-------------|
| kenya_county_soils.csv | 47 | `/soil/[county]` |
| crop_economics.csv | 25 | `/crops/[crop]` |
| Zone mapping | 10 | `/zones/[zone]` |
| dealers.csv | 47 | `/dealers/[county]` |
| County × Crop | ~1,175 | `/soil/[county]/[crop]` |
| wards.csv | ~1,450 | `/soil/[county]/ward/[ward]` |
| Static | 13 | `/`, `/soil`, `/crops`, `/zones`, `/dealers`, `/blog`, `/app`, `/yields`, `/doctor`, `/profile` |
| **Total** | **~2,767** | |

## Interactive Tools (wired to backend API)

- **`/app`** — Full recommendation engine (county/crop/fertilizer selector, lab overrides, budget calculator, EN/SW bilingual, WhatsApp sharing)
- **`/yields`** — Yield tracker (phone-based identification, season-over-season harvest logging)
- **`/doctor`** — Plant Doctor (camera/upload image diagnosis)
- **`/profile`** — User auth (phone-based login/register)

## Data Files Used (11 CSVs)

| File | Records | Purpose |
|------|---------|---------|
| kenya_county_soils.csv | 47 | County soil data (iSDAsoil) |
| crop_economics.csv | 25 | Crop requirements & economics |
| seeds.csv | 53 | Certified seed varieties |
| dealers.csv | 52 | Agrovet suppliers |
| wards.csv | 1,450 | Ward coordinates & population |
| subcounty_coordinates.csv | 20 | Sub-county coordinates |
| comparison_reasons.csv | 13 | Fertilizer switching reasons (EN/SW) |
| county_coordinates.csv | 47 | County centroids |
| crop_calendars.csv | 15 | Planting calendars |
| top_dressing.csv | 25 | Top dressing instructions |
| prices.csv | 14 | Fertilizer prices (subsidized/commercial) |

## Design System

- **Dark Green** `#1a3a1a` — Headers, nav, CTAs
- **Gold** `#C8860A` — Accents, buttons, highlights
- **Cream** `#F5F0E1` — Backgrounds
- **Icons**: Lucide React (dark green)
- **Fonts**: Playfair Display (display), DM Sans (body)

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Restore Google Fonts (on deployment)

In `src/app/layout.tsx`, add back the imports:

```tsx
import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

// Then on the <html> tag:
<html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
```

## Build Strategy

- **~160 pages** pre-rendered at build time (counties, crops, zones, dealers, top combos/wards)
- **~2,600 pages** generated on-demand via ISR (county×crop + ward pages, revalidated daily)
- Zero OOM risk — scales to any hosting environment

## Deploy to Vercel

```bash
vercel --prod
```

## Backend API

API: `https://shambaiq-backend-production.up.railway.app/docs`

Endpoints wired into the frontend:
- `POST /api/v1/recommend` — Full recommendation
- `GET /api/v1/counties` — County list
- `GET /api/v1/crops` — Crop list
- `GET /api/v1/soil/precision/{lat}/{lon}` — Ward-level iSDA/SoilGrids
- `GET /api/v1/analytics/yields/{farmer_id}` — Yield history
- `POST /api/v1/analytics/yields` — Log harvest
- `POST /api/v1/auth/register` — User registration
- `POST /api/v1/auth/login` — User login

## SEO Features

- Static Site Generation for all 2,700+ data pages
- Unique title and meta description per page
- FAQPage schema on county pages
- LocalBusiness schema on dealer pages
- BreadcrumbList schema on all pages
- Auto-generated sitemap.xml (2,700+ URLs)
- robots.txt
- Open Graph meta tags
