# Onboarding V1

Public demo: https://radial-controls.pages.dev/

This repo is the Onboarding V1 prototype: the radial-controls version of onboarding. It explores direct-manipulation weighted radial allocation, color/shape/line semantics, budget balancing, and the generated semantic mark.

It is not Sorting Hat. It is the earlier onboarding direction before the hidden-shape Onboarding V2 flow.

## Run

```powershell
npm start
```

Then open `http://localhost:4173`.

Root and `http://localhost:4173/demo-one.html` both load the Onboarding V1 radial-controls prototype.

## Verify

```powershell
npm run verify
```

This checks that the Onboarding V1 radial-control surface loads, exposes the semantic mark readout, and avoids desktop horizontal overflow.

## Deploy

```powershell
npm run deploy
```

This project deploys only to the Cloudflare Pages project `radial-controls`, which serves the Onboarding V1 prototype at `https://radial-controls.pages.dev/`.

## Project Boundary

- `Radial-controls`: Onboarding V1, the radial-controls onboarding prototype.
- `Shape-onboarding`: Onboarding V2, the current hidden-shape onboarding flow.
- `Sorting-hat`: a separate routing-mark identity project, not an onboarding version.
