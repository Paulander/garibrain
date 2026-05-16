# PartnerOps Publish Checklist

This checklist separates what is already prepared in the repo from what requires owner accounts, store access, payment, or final judgment.

## Done In Repo

- Expo SDK 55 app configured.
- Node runtime pinned with `.nvmrc`.
- EAS build profiles added in `eas.json`.
- App icon, adaptive icon, splash icon, and favicon generated.
- Dark theme metadata configured.
- iOS bundle ID set to `com.partnerops.app`.
- Android package set to `com.partnerops.app`.
- Version `0.1.0`, iOS build `1`, Android versionCode `1`.
- Local-first privacy posture documented.
- Draft privacy policy, support page, store listing, and data safety notes added.
- Guided prompt coach and tip library added to the app.
- SEO page drafts and Google Ads campaign draft added.
- Tests and typecheck pass.

## Owner Tasks Before Internal Testing

- Create or confirm Apple Developer Program membership.
- Create or confirm Google Play Developer account.
- Create or log into an Expo account.
- Run `npx eas login`.
- Run `npx eas build:configure` if the project is not linked to Expo yet.
- Decide whether `com.partnerops.app` is the final bundle/package ID. Change it before first public submission if not.
- Create public URLs for:
  - Privacy policy
  - Support/contact
  - Optional marketing/home page
- Replace placeholder support/contact text with final email/URLs.
- Publish the SEO pages from `docs/seo-webpages.md` on the final marketing domain.
- Prepare ad images/video/screenshot assets from `docs/google-ads-campaign.md`.

## Build Commands

Install EAS CLI if needed:

```bash
npm install -g eas-cli
```

Preview builds:

```bash
npm run eas:build:android:preview
npm run eas:build:ios:preview
```

Production builds:

```bash
npm run eas:build:all
```

Submit:

```bash
npm run eas:submit:android
npm run eas:submit:ios
```

## Apple App Store Connect Tasks

- Create app record.
- Set bundle ID.
- Add privacy policy URL.
- Add support URL.
- Complete app privacy details.
- Complete age rating.
- Upload screenshots.
- Add subtitle, description, keywords, category, and review notes.
- Add TestFlight build.
- Test on iPhone.
- Submit for App Review.

Review notes should mention:

```text
PartnerOps is a local-first private memory and planning app. It does not include partner accounts, backend sync, HealthKit, location tracking, contacts import, message scraping, or deceptive camouflage. Cycle-based support settings are manually configured estimates for support planning only and are not medical advice.
```

## Google Play Console Tasks

- Create app.
- Complete store listing.
- Complete content rating.
- Complete Data safety section using `docs/data-safety.md`.
- Add privacy policy URL.
- Add support/contact.
- Upload Android App Bundle.
- Configure internal testing.
- If required for the account type, run closed testing with the required tester count and duration before production access.
- Submit for review.

## Manual QA Required

- Fresh install onboarding.
- Add partner.
- Add date.
- Add preference and dislike.
- Use Memory Prompt Coach to add sizes, gift landmines, and support cues.
- Add support pattern.
- Add cycle support settings.
- Confirm Cycle Support notes frame recurring symptoms as support cues, not diagnosis.
- Confirm Today advice updates.
- Confirm Panic Helper uses preferences, excludes dislikes, and shows tip cards.
- Confirm debrief follow-up appears.
- Confirm app lock works on real iOS/Android.
- Confirm notification permission flow and privacy text.
- Confirm delete-all-data clears local data.
- Confirm no contacts/camera/location/health/calendar permissions are requested.

## Remaining Product Decisions

- Keep deterministic shield icon or replace with imagegen-generated icon.
- Final app/support domain.
- Final support email.
- Final pricing: free/internal only for MVP, or future subscription.
- Final screenshots.
- Final Google Ads daily test budget and install target.
