# Secondhand Intelligence Dashboard — Build Instructions

## What to Build
A dummy read-only dashboard for a fictional mid-market fashion brand selling in California. Three tabs with hardcoded realistic data. Pentatonic branded.

## Tech Stack
- React (Vite)
- Tailwind CSS
- Recharts for charts
- All data hardcoded as a JSON object at the top of the file
- No auth, no backend
- Deployable to Vercel

## Tabs

### Tab 1: Overview
- Top KPIs row: Units in secondary market, Resale GMV, Average price retention %, Reuse rate vs SB 707 target (50%)
- 8-month trend chart (line chart showing monthly listings, GMV, avg price)
- Category-level price retention breakdown (table or bar chart: Dresses, Outerwear, Tops, Denim, Accessories)

### Tab 2: Platforms
- Where the brand's products appear: Depop, eBay, Poshmark, ThredUp, Vestiaire Collective, The RealReal, Grailed, Mercari, StockX
- Volume by platform (bar chart)
- Average resale price by platform (bar chart or table)
- Highlight which channels command premium pricing

### Tab 3: Compliance
- SB 707 checklist with status indicators:
  - PRO Registration → met (green)
  - Collection Program → in progress (yellow)
  - Reuse Rate Reporting → in progress (yellow)
  - Annual Audit → required (red)
  - Fee Payment → advisory (grey)
- Reuse rate progress bar vs 50% target (currently at e.g. 34%)
- Fee exposure table: show financial upside of compliance vs non-compliance
  - Columns: Compliance Level, Estimated Fee, Savings vs Non-Compliance

### Persistent Element
- AI insight bar at bottom of each tab
- Shows one key action-oriented observation per tab
- Example: "💡 Poshmark listings grew 23% MoM — consider prioritising authentication partnerships on this platform"

## Design System — PENTATONIC (CRITICAL)
Follow these rules EXACTLY:

### Fonts
- "Atkinson Hyperlegible Next" (weight 300 for body/headings, weight 100 for analytic numbers)
- "Atkinson Hyperlegible Mono" (weight 200, UPPERCASE only, for labels/pills/badges/standout numbers)
- Load from Google Fonts

### Colors
- Black: #171717 (primary dark)
- White: #FFFFFF
- Grey Light: #FAFAFA (card backgrounds)
- Grey Medium: #A9A9A9 (secondary text)
- Mint: #00FBA9 (primary accent, positive indicators, CTA buttons)
- Coral: #FF4C00 (negative/alert)
- Blue: #3941EB (supporting accent, positive indicators on light bg)
- Secondary Green: #5BC48B (data viz)
- Secondary Red: #FFB788 (data viz)
- Secondary Blue: #9EA8FF (data viz)

### Layout Rules
- DEFAULT to light theme (#FFFFFF or #FAFAFA backgrounds, #171717 text)
- Reserve dark (#171717) for ONE prominent section only (e.g., the header)
- NO rounded corners on cards/containers (sharp corners only)
- Rounded corners ONLY on buttons (pill shape, radius-full 9999px)
- 8px grid spacing
- Left-aligned, asymmetric layouts (NOT centered-everything)
- NO emojis in the UI (use text or icons)
- NO gradient backgrounds
- NO decorative shadows
- Generous whitespace

### Forbidden
- Purple gradients
- Inter/Roboto/Arial fonts
- Rounded card corners
- Emojis
- Gradient backgrounds
- Bounce animations

### Logo
Use: https://pub-ab109a8a73bd4a89a0df2c903e8e86e7.r2.dev/pentatonic-logo.svg

## Dummy Data
Create realistic data for a fictional brand called "AURA" (mid-market fashion, based in LA).
- ~4,200 listings across 9 platforms
- Resale GMV: ~$890K
- Average price retention: 41%
- Reuse rate: 34% (vs 50% SB 707 target)
- Top platform by volume: Poshmark
- Top platform by avg price: Vestiaire Collective
- 8 months of trend data showing gradual growth

Put ALL data in a single `data.ts` or `data.json` file at the top level for easy editing.

## Deliverable
- Working React app
- `npm run build` produces static files
- Ready for `vercel deploy`
