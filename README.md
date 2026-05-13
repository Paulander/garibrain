# PartnerOps

PartnerOps is a private relationship memory and planning app for men in committed relationships. It stores important dates, preferences, support windows, gift ideas, and debrief notes locally, then turns them into calendar-bound reminders and practical next steps.

The MVP is intentionally local-first. It has no backend, no partner account, no location/contact/camera/microphone permissions, and no deceptive stealth or fake calculator mode. Privacy is handled through app lock, neutral notifications, quick lock, encrypted sensitive fields, local export, and delete-all-data.

## Stack

- Expo SDK 55 / React Native 0.83 / React 19.2
- TypeScript
- Expo Router
- Expo SQLite
- Expo SecureStore
- Expo Notifications
- Expo Local Authentication
- Vitest for domain tests

## Setup

```bash
npm install
npm run ios
```

For Android:

```bash
npm run android
```

Run checks:

```bash
npm run typecheck
npm test
```

Preview web locally:

```bash
npm run web -- --localhost --port 8082
```

Generate local icon/splash assets from SVG sources:

```bash
npm run generate-assets
```

## Release Prep

Draft release docs live in `docs/`:

- `docs/publish-checklist.md`
- `docs/privacy-policy.md`
- `docs/support.md`
- `docs/store-listing.md`
- `docs/data-safety.md`
- `docs/imagegen-assets.md`

EAS profiles are configured in `eas.json`. The production build command is:

```bash
npm run eas:build:all
```

## Product Boundaries

PartnerOps is a private memory and planning tool. It is not therapy, medical advice, legal advice, or a health diagnosis tool. Cycle-based reminders are manual estimates for support planning only and may be inaccurate.

The app must not implement fake app disguises, hidden launchers, surveillance, location tracking, message/contact/social scraping, cycle-based sexual predictions, manipulative scripts, or partner-blaming workflows.

## Current MVP Surfaces

- Onboarding: tone, privacy level, partner profile, important dates, starter preferences, support opt-in
- Today: date-aware advice cards, support window cards, gift planning prompts, debrief follow-ups
- Calendar: important dates, support windows, lead reminder summaries
- Memory: preference capture with categories, sentiment, importance, and sensitive toggle
- Panic: local rule-based gift/date/message/trip/apology suggestions
- Settings: tone, privacy, notifications, export, delete all local data, legal copy

## Tests

The test suite covers recurrence, cycle windows, advice generation, notification privacy, and panic helper rules.
