# Radial Controls

Direct-manipulation onboarding for a self-set preference profile.

Public demo: https://radial-controls.pages.dev/

## Surfaces

- `/` and `/demo-one.html` use three weighted radial controls for color, contribution shape, and interaction line. Each control has a 100-point budget.
- `/continuous.html` records eight choices as one uninterrupted path and derives a profile mark from that route.

Both surfaces expose exact values or choices alongside the visual mark and export structured text. Suggestions in the continuous flow come only from earlier choices; `Other` remains available at every step.

## Run

```powershell
npm start
```

Open `http://localhost:4173`.

## Verify

```powershell
npm run verify
npm run verify:continuous
```

The checks exercise the generated output, accessible control labels, and responsive layouts at desktop, tablet, and 375/320px mobile widths. They also save screenshots for visual inspection.

## Deploy

```powershell
npm run deploy
```

The command builds `dist` and deploys it to the `radial-controls` Cloudflare Pages project.

## Project boundary

- `Radial-controls` is the canonical preference-profile onboarding product, formerly labeled Onboarding V1.
- `Shape-onboarding` is the retired Onboarding V2 archive and redirects here.
- `Sorting-hat` is a separate routing-mark identity project.
- `radial-dial` is the reusable React marking-menu component, not an onboarding product.
