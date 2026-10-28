# Firebase setup

The app uses Firestore for contact requests and Firebase Analytics for
consent-based, anonymous usage statistics. Form contents are never sent to
Analytics.

## Finish setup in Firebase Console

1. Open project `portfolioshouman`, enable the Cloud Firestore API and Google
   Analytics, and create a Firestore database if one does not already exist.
2. Publish the repository's `firestore.rules` in Firestore > Rules.
   The Firebase CLI default project is `portfolioshouman`; after logging in,
   run `firebase deploy --only firestore:rules --project portfolioshouman`.
   This replaces the active Firestore rules, so review any existing rules
   before deploying.
3. Each lead document receives a `deleteAfter` timestamp 180 days in the
   future. Automatic deletion is not currently active: the `portfolioshouman`
   project is on Spark, and Google Cloud rejected TTL policy creation because
   billing is disabled. To enable automatic expiration later, authorize a
   billing-plan change and create a `deleteAfter` TTL policy for `leads`,
   `pilot_leads`, `tarot_leads`, and `daemon_runs`. Until then, these records
   require manual deletion and may remain past their target date. The Costi
   panel includes a manual cleanup action for expired `pilot_leads`; other
   collections must be cleaned up from the Firebase Console.
4. Register a reCAPTCHA v3 site in App Check for the production domain, set
   `NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY`, then enable App Check enforcement for
   Cloud Firestore. Do this only after the site key is deployed and verified.
   App Check is important because the public web app can submit new documents.
5. The web app configuration for `portfolioshouman`, including
   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`, is set in the ignored local
   `.env.local`. Add the reCAPTCHA key when available.
6. Add the same `NEXT_PUBLIC_FIREBASE_*` and reCAPTCHA values to the deployment
   environment, then redeploy.
7. To enable game scores, enable Google as a sign-in provider under
   Authentication > Sign-in method and add the deployed domain to authorized
   domains. Configure the server-only `FIREBASE_PROJECT_ID`,
   `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` from a service account
   in the deployment's secret environment variables. Never expose these values
   with a `NEXT_PUBLIC_` prefix.
8. The Costi lead panel signs in with the Firebase Authentication
   email/password account `contato@focuspulse.site`. Its UID is restricted in
   Firestore rules; no Admin SDK credentials are needed for the panel. Keep its
   password private and do not create additional Costi admin accounts without
   updating the rules.
9. Set the Google Analytics event-data retention period in Analytics > Admin >
   Data Settings > Data Retention.

The web API key identifies the Firebase web app; it is not an admin credential.
Firestore rules allow only the configured Costi account to read, update lead
status, and delete pilot leads. Review and publish the rules before accepting
production submissions.

## What is saved

- `leads`: name, company, message, selected project type and plan, source page,
  consent flag, creation timestamp, and expiry timestamp.
- `pilot_leads`: leads from `/templates/seguro-pilotos` (name, WhatsApp,
  flight modality, desired insured capital, consent, status, timestamps,
  180-day `deleteAfter` target). Public visitors can only create; the company
  account can read, update status, and delete from `/admin/pilotos`. Use
  **Limpar expirados** in that panel to permanently remove leads whose
  `deleteAfter` date has passed. This manual action works on Spark; it does not
  run on a schedule.
- Firebase Analytics: page views, Arknoid start/end/high-score events
  (including score and play duration), high-level Image Blend interactions,
  and Costi pilot-hotsite funnel events (CTA/WhatsApp clicks, form start,
  validation outcome, selected modality/capital, FAQ opens, submission, and
  save failures). These require the visitor to opt in. Routes are recorded
  without query strings or fragments. No direct identifiers or form contents
  are included; leads themselves are stored separately in `pilot_leads`.
  Costi event names use the `pilot_` prefix; event parameters include placement,
  validation field, modality, selected capital, and FAQ index. Register
  event-scoped custom dimensions/metrics in Google Analytics to report on those
  parameters. Analytics events are reported in Firebase/Google Analytics, not
  stored as Firestore documents.
- `leaderboard`: Memory Matrix and Voxel Vaders scores explicitly submitted by
  signed-in players, including Firebase Auth UID, Google display name, game ID,
  game-specific score details, score, verification status, and timestamp. Admin
  SDK writes are performed by the server action after Firebase ID-token
  verification. The score values are reported by the browser and are not
  authoritative or cheat-proof; authoritative rankings require server-side game
  simulation or replay verification.

Manage contact records in the Firebase Console. The client app cannot read
these records. Configure event data retention in Google Analytics > Admin >
Data Settings > Data Retention.
