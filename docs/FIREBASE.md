# Firebase setup

The app uses Firestore for contact requests and Firebase Analytics for
consent-based, anonymous usage statistics. Form contents are never sent to
Analytics.

## Finish setup in Firebase Console

1. Open project `site-shouman` and create a Firestore database.
2. Publish the repository's `firestore.rules` in Firestore > Rules.
   Alternatively, after logging in to the Firebase CLI, run
   `firebase deploy --only firestore:rules`. This replaces the active Firestore
   rules, so review any existing rules before deploying.
3. In Firestore > TTL, enable the `deleteAfter` field for the default database.
   Contact requests expire after 180 days.
4. Register a reCAPTCHA v3 site in App Check for the production domain, set
   `NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY`, then enable App Check enforcement for
   Cloud Firestore. Do this only after the site key is deployed and verified.
   App Check is important because the public web app can submit new documents.
5. Copy the Firebase web app configuration from Project settings > General,
   including the `measurementId`, into `.env.local`. The provided values are
   already in the ignored local `.env.local`; add the measurement and
   reCAPTCHA keys when available.
6. Add the same `NEXT_PUBLIC_FIREBASE_*` and reCAPTCHA values to the deployment
   environment, then redeploy.
7. To enable game scores, enable Google as a sign-in provider under
   Authentication > Sign-in method and add the deployed domain to authorized
   domains. Configure the server-only `FIREBASE_PROJECT_ID`,
   `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` from a service account
   in the deployment's secret environment variables. Never expose these values
   with a `NEXT_PUBLIC_` prefix.
8. Set the Google Analytics event-data retention period in Analytics > Admin >
   Data Settings > Data Retention.

The web API key identifies the Firebase web app; it is not an admin credential.
Firestore rules deny client reads, updates, and deletes. Review and publish the
rules before accepting production submissions.

## What is saved

- `leads`: name, company, message, selected project type and plan, source page,
  consent flag, creation timestamp, and expiry timestamp.
- Firebase Analytics: page views, Arknoid start/end/high-score events
  (including score and play duration), and high-level Image Blend interactions.
  These require the visitor to opt in. Routes are recorded without query
  strings or fragments. No direct identifiers or form contents are included.
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
