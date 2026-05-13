# PartnerOps Data Safety Draft

Use this as a working draft for App Store Connect privacy details and Google Play Data safety. Final answers must match the actual submitted build and current store forms.

## Backend / Account Status

V1 has no PartnerOps account system and no custom backend.

## Collected By PartnerOps Server

None in V1.

## Stored Locally On Device

The user may enter:

- Partner profile information
- Important dates
- Preferences, dislikes, sizes, allergies/sensitivities, gift hints
- Support patterns
- Optional manually configured cycle support settings
- Debrief notes
- Reminders and saved ideas
- App settings

## Shared With Third Parties

No data is shared by PartnerOps in V1.

## Permissions

Requested:

- Local notifications
- Biometric/local authentication

Not requested:

- Contacts
- Camera
- Microphone
- Location
- HealthKit
- Google Health Connect
- Calendar read/write
- Photos/media library

## Sensitive Data Notes

Cycle-based support settings may be considered sensitive. In V1 this data is manually entered, stored locally, not sent to a backend, not used for advertising, and not used for medical claims or predictions.

## Security Practices

- Local-first storage
- App lock support
- Neutral/minimal/silent notifications
- Hidden notification previews setting
- Quick lock
- Encrypted sensitive fields where practical
- Delete-all-data control

## User Data Deletion

Users can delete local app data from Settings. If cloud backup or accounts are added later, a public account/data deletion process will be required.
