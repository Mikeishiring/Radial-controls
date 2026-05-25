# Onboarding V1

Public demo: https://radial-controls.pages.dev/

This repo is the canonical onboarding product: the radial-controls onboarding flow formerly labeled Onboarding V1. It explores direct-manipulation weighted radial allocation, continuous shape drawing, color/shape/line semantics, budget balancing, and the generated semantic mark.

It is not Sorting Hat and it is not the reusable `radial-dial` component library. The hidden-shape Onboarding V2 flow has been retired in favor of this direction.

## Run

```powershell
npm start
```

Then open `http://localhost:4173`.

Root and `http://localhost:4173/demo-one.html` both load the Onboarding V1 radial-controls prototype. `http://localhost:4173/continuous.html` is an Onboarding V1 continuous radial-controls variant, not Onboarding V2.

## Verify

```powershell
npm run verify
npm run verify:continuous
```

These checks confirm that the Onboarding V1 radial-control surface loads, the continuous V1 variant renders on desktop and mobile, the semantic readouts exist, and both surfaces avoid horizontal overflow.

## Deploy

```powershell
npm run deploy
```

This project deploys only to the Cloudflare Pages project `radial-controls`, which serves the canonical onboarding flow at `https://radial-controls.pages.dev/`.

## Project Boundary

- `Radial-controls`: canonical onboarding product, formerly Onboarding V1. GitHub: `Mikeishiring/Radial-controls`. Cloudflare Pages: `radial-controls` / `https://radial-controls.pages.dev/`.
- `Shape-onboarding`: retired Onboarding V2 archive. GitHub: `Mikeishiring/Shape-onboarding`. Cloudflare Pages: `shape-onboarding` / `https://shape-onboarding.pages.dev/`, redirected to this product.
- `Sorting-hat`: separate routing-mark identity project, not an onboarding version. GitHub: `Mikeishiring/Sorting-hat`. Cloudflare Pages: `sorting-hat` / `https://sorting-hat-ak1.pages.dev/`.

Related origin note: `radial-dial` is a reusable React marking-menu/radial-dials component, not one of the three deployed products above.
