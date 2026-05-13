# PartnerOps Design Plan

Reference direction: dark private ops log, sage shield mark, compact dashboard cards, ivory text, amber/red status states, line icons, subtle topographic texture.

## Implemented in this pass

- Dark ink app shell with centered phone-width web layout.
- Shared theme tokens for ink, charcoal, surface, ivory, sage, amber, red, muted, and border colors.
- Rebuilt shared components: screen, panel, section title, chips, buttons, fields, brand mark, metrics, and row items.
- Restyled tab navigation to match the reference: line icons, dark tab bar, sage active state.
- Redesigned Today with snapshot metrics, current briefing, support cards, advice cards, and quick capture.
- Redesigned Panic with red panic panel, quick action cards, checklist, and elevated generated ideas.
- Updated Calendar, Memory, Settings, onboarding, Support Calendar, and Debrief screens to share the same visual language.
- Added a local SVG brand mark source for later icon and splash asset production.
- Added generated Expo app icon, Android adaptive icon, splash icon, and web favicon from project SVG sources.
- Wired Expo app metadata for dark mode, splash, icon, adaptive icon, favicon, and web theme color.
- Added Inter font loading through Expo font support.
- Settings now reads the saved local partner profile instead of showing a fixed placeholder profile.
- Added EAS build profiles and publish-prep docs for store listings, privacy policy, support, data safety, imagegen assets, and launch checklist.

## Remaining manual/product decisions

- Decide whether to keep the deterministic shield icon or replace it with generated art from imagegen.
- Decide whether web should remain a phone-width preview or become a true responsive PWA layout.
- Replace placeholder profile/settings copy with production copy and support/privacy URLs.
- Do device QA for biometrics, notifications, secure storage, and SQLite on actual iOS/Android.
- Run imagegen variants only if the deterministic icon is not strong enough after review.

## Asset prompts to run later

App icon:

```text
Create a premium mobile app icon for PartnerOps, a private relationship ops log. Dark ink background, sage shield emblem, subtle open notebook/checkmark symbol, ivory highlights, no text, no hearts, no cartoon style, no fake calculator imagery. Clean iOS icon composition, high contrast, simple geometry, slightly tactile material finish.
```

Splash:

```text
Create a dark premium splash image for PartnerOps. Centered sage shield/open-log emblem on a charcoal black background with subtle topographic contour texture, ivory glow accents, restrained private-ops feel, no text, no people, no hearts, no tactical military cliches.
```
