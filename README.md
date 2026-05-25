# Radial Controls

Public demo: https://radial-controls.pages.dev/

This repo is only for the Radial Controls design grammar. It explores the direct-manipulation controls themselves: weighted radial allocation, color/shape/line semantics, budget balancing, and the generated semantic mark.

It is not the onboarding product and it is not the Sorting Hat routing identity. It is the design lab for the control language those products can borrow from.

## Run

```powershell
npm start
```

Then open `http://localhost:4173`.

Root and `http://localhost:4173/demo-one.html` both load the control grammar prototype.

## Verify

```powershell
npm run verify
```

This checks that the radial control surface loads, exposes the semantic mark readout, and avoids desktop horizontal overflow.

## Deploy

```powershell
npm run deploy
```

This project deploys only to the Cloudflare Pages project `radial-controls`, which serves `https://radial-controls.pages.dev/`.

## Project Boundary

- `Shape-onboarding`: profile intake and hidden-shape onboarding.
- `Sorting-hat`: cohort routing mark identity surfaces.
- `Radial-controls`: reusable control grammar and design experiments.
