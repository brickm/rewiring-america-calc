# Claude Code Instructions for Workshop

## Test-Driven Development Ethos

**CRITICAL RULES:**

1. **Tests First**: Write tests before implementation code
2. **No Commits Without Passing Tests**: You can ONLY `git commit` locally once ALL tests pass
3. **Never Push to Remote**: You can NEVER run `git push`. Only the user can authorize pushes to remote
4. **Test Coverage Required**: All API routes and core logic must have tests
5. **Run Tests Before Commits**: Always run `npm test` before committing

**Git Workflow You Must Follow:**
```bash
# ✅ ALLOWED (after tests pass)
npm test                    # Verify all tests pass
git add .
git commit -m "message"

# ❌ FORBIDDEN - Never do this
git push                    # ONLY USER can push to remote
git push origin main        # NEVER run this command
```

## Project Context
This project serves a dual purpose:

1. **Live Demo App** (Calculator): A home electrification impact calculator using Rewiring America APIs. This is the "deployed Hydrofoil" shown during the LXD webinar — a real web app built entirely with Claude Code. The calculator app, API routes, components, hooks, and tests should NOT be modified.

2. **Workshop Presentation** (HTML Slide Deck): A 20-slide presentation at `public/workshop-presentation.html` for a 75-minute webinar targeting instructional designers and L&D leaders. The original climate tech presentation is preserved at `public/climate-workshop-presentation.html`.

3. **Home Page**: Reframed as "Claude Code for Learning Designers" — links to both the presentation and the demo app.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Rewiring America API (REM + Health Impacts)
- Vercel deployment

## API Documentation
See `../api_documentation/` for complete API references:
- `rewiring-america-api-residential-electrification-model.md` - Energy savings API
- `rewiring-america-api-electrification-tools.md` - Health impacts API

## Key Design Principles
1. **Simplicity**: Workshop attendees have no coding background
2. **Focus**: Annual savings + health impacts only (not comprehensive)
3. **Teachable**: Clear code structure, avoid complex abstractions
4. **Time-constrained**: Features must be buildable in 25 minutes

## Features to Build

### Phase 1: Basic Calculator (Foundation - 15 min)
- Frontend form: address input + fuel type radio buttons
- Backend API route: `/api/savings`
- Display: Annual cost savings in dollars

### Phase 2: Health Impacts (Core - 25 min)
- New API route: `/api/health-impacts`
- County-level mortality reduction
- Air quality metrics (NOx, PM2.5)
- Simple data visualization

### Phase 3: Polish (Deploy - 20 min)
- Compare multiple heat pump scenarios
- Basic charts
- Git workflow demonstration
- Vercel deployment

## Code Style Guidelines
- Use functional components with hooks
- Keep components in single file (avoid over-architecting)
- Inline styles with Tailwind (no separate CSS files)
- Error handling: user-friendly messages
- Loading states: simple "Calculating..." text

## Environment Variables
```
REWIRING_AMERICA_API_KEY=Bearer_token_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 (or Vercel URL)
```

## API Endpoints to Create

### `/api/savings`
**Input**: address, heating_fuel
**Output**: annualSavings, estimateType
**Rewiring America Endpoint**: `GET /api/v1/rem/address`

### `/api/health-impacts`
**Input**: state_fips, county_fips (optional)
**Output**: mortality reduction, air quality metrics
**Rewiring America Endpoint**: `POST /api/v2/etools/health-impacts`

## Common Pitfalls to Avoid
- Don't call Rewiring America API from frontend (exposes API key)
- Don't use database (unnecessary complexity)
- Don't over-engineer state management (useState is fine)
- Don't add authentication (out of scope)
- Keep all code in app/ directory (no complex folder structure)

## Testing Checklist
- [ ] Form validates required fields
- [ ] API routes return proper error messages
- [ ] Loading states display during API calls
- [ ] Results format numbers properly (currency, decimals)
- [ ] Works with various addresses (Denver, San Francisco, New York)
- [ ] Environment variables load correctly
