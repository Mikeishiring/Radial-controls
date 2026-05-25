# Onboarding V1

Public demo: https://radial-controls.pages.dev/

This repo is the Onboarding V1 prototype: the radial-controls version of onboarding. It explores direct-manipulation weighted radial allocation, color/shape/line semantics, budget balancing, and the generated semantic mark.

It is not Sorting Hat and it is not the reusable `radial-dial` component library. It is the earlier onboarding direction before the hidden-shape Onboarding V2 flow.

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

This project deploys only to the Cloudflare Pages project `radial-controls`, which serves the Onboarding V1 prototype at `https://radial-controls.pages.dev/`.

## Project Boundary

- `Radial-controls`: Onboarding V1, the radial-controls onboarding prototype. GitHub: `Mikeishiring/Radial-controls`. Cloudflare Pages: `radial-controls` / `https://radial-controls.pages.dev/`.
- `Shape-onboarding`: Onboarding V2, the current hidden-shape onboarding flow. GitHub: `Mikeishiring/Shape-onboarding`. Cloudflare Pages: `shape-onboarding` / `https://shape-onboarding.pages.dev/`.
- `Sorting-hat`: separate routing-mark identity project, not an onboarding version. GitHub: `Mikeishiring/Sorting-hat`. Cloudflare Pages: `sorting-hat` / `https://sorting-hat-ak1.pages.dev/`.

Related origin note: `radial-dial` is a reusable React marking-menu/radial-dials component, not one of the three deployed products above.
