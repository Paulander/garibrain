# PartnerOps Imagegen Asset Workflow

The app currently ships with deterministic vector-derived assets so builds are not blocked by subjective icon review. Imagegen can still be used to create richer alternatives.

## Current Active Assets

- `assets/icon.png`
- `assets/adaptive-icon.png`
- `assets/splash-icon.png`
- `assets/favicon.png`

These are generated from:

- `assets/icon-source.svg`
- `assets/splash-source.svg`

Regenerate:

```bash
npm run generate-assets
```

## Imagegen Direction

Use imagegen for variants, not for the whole UI. The UI should remain code-native and deterministic.

### Icon Prompt

```text
Use case: logo-brand
Asset type: mobile app icon exploration
Primary request: Create a premium mobile app icon for PartnerOps, a private relationship ops log. Dark ink background, sage shield emblem, subtle open notebook/checkmark symbol, ivory highlights, no text.
Style: refined private-ops dashboard, modern iOS app icon, tactile but simple, strong silhouette at small sizes.
Avoid: hearts, fake calculator imagery, military cliches, cartoon style, partner surveillance motifs, text, tiny unreadable details.
Palette: #0B0F10 ink, #7BA07A sage, #F2EFE7 ivory, subtle #2C3A2E contour lines.
Composition: centered shield/log mark with generous padding and high contrast.
```

### Splash Prompt

```text
Use case: logo-brand
Asset type: mobile app splash screen
Primary request: Create a dark premium splash image for PartnerOps with a centered sage shield/open-log emblem on a charcoal black background.
Style: restrained private ops log, subtle topographic contour texture, ivory glow accents, calm and premium.
Avoid: text, people, hearts, fake calculator imagery, surveillance imagery, tactical military cliches, busy background.
Palette: #0B0F10 ink, #7BA07A sage, #F2EFE7 ivory, #2C3A2E contour lines.
Composition: centered icon, plenty of negative space, works on iOS and Android launch screens.
```

## Swap-In Steps

1. Generate variants.
2. Pick one icon and one splash.
3. Save source files under `assets/imagegen/`.
4. Export final PNGs to:
   - `assets/icon.png`
   - `assets/adaptive-icon.png`
   - `assets/splash-icon.png`
   - `assets/favicon.png`
5. Run:

```bash
npm run typecheck
npm test
npm run web -- --localhost --port 8082
```
