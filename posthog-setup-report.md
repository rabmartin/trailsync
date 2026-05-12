<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TrailSync. The existing instrumentation was extended with 12 new events covering the walk recording funnel, route engagement, social interactions, auth flow, profile actions, and churn signals.

**Files modified:**
- `app/trailsync.jsx` — 12 new `posthog.capture()` calls added across auth, route, social, walk, and profile flows
- `.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` confirmed and updated

**Existing setup (already in place):**
- `instrumentation-client.ts` — PostHog client initialised with `capture_exceptions: true` and `defaults: "2026-01-30"`
- `posthog.identify()` called on email login, email signup, Google OAuth callback, and session restore

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User creates a new account via email/password | `app/trailsync.jsx` |
| `user_logged_in` | User signs in (email or Google OAuth) | `app/trailsync.jsx` |
| `google_login_attempted` | User taps "Sign in with Google" | `app/trailsync.jsx` |
| `password_reset_requested` | User requests a password reset email | `app/trailsync.jsx` |
| `username_saved` | User saves their chosen username during onboarding | `app/trailsync.jsx` |
| `walk_recording_started` | User taps "Start Recording" to begin GPS walk tracking | `app/trailsync.jsx` |
| `walk_recording_stopped` | User taps "Stop" during an active walk recording | `app/trailsync.jsx` |
| `walk_saved` | User saves a recorded walk (distance, elevation, peaks, duration) | `app/trailsync.jsx` |
| `walk_discarded` | User discards a walk without saving | `app/trailsync.jsx` |
| `peak_logged` | User marks a peak as completed | `app/trailsync.jsx` |
| `peak_unlogged` | User removes a peak completion | `app/trailsync.jsx` |
| `route_detail_viewed` | User opens a route detail panel | `app/trailsync.jsx` |
| `flyover_started` | User launches the 3D animated flyover for a route | `app/trailsync.jsx` |
| `route_navigation_started` | User taps Navigate to open a route on the map | `app/trailsync.jsx` |
| `post_created` | User publishes a post to the community feed | `app/trailsync.jsx` |
| `post_liked` | User likes a community post | `app/trailsync.jsx` |
| `comment_posted` | User posts a comment on a community post | `app/trailsync.jsx` |
| `post_reposted` | User reposts another user's post | `app/trailsync.jsx` |
| `user_followed` | User follows another user (from search or profile) | `app/trailsync.jsx` |
| `saved_spot_added` | User saves a map spot (camp, viewpoint, etc.) | `app/trailsync.jsx` |
| `saved_spot_deleted` | User deletes a saved map spot | `app/trailsync.jsx` |
| `avatar_updated` | User uploads a new profile photo | `app/trailsync.jsx` |
| `course_lesson_completed` | User completes a mountain skills course lesson | `app/trailsync.jsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://eu.posthog.com/project/176183/dashboard/671728
- **Walk recording funnel** (started → stopped → saved): https://eu.posthog.com/project/176183/insights/A9AjQnRm
- **Auth funnel** (Google login attempted → logged in): https://eu.posthog.com/project/176183/insights/bb2F37En
- **Route engagement trends** (views, flyovers, navigation): https://eu.posthog.com/project/176183/insights/8K92mBmY
- **Social engagement trends** (likes, comments, reposts, follows): https://eu.posthog.com/project/176183/insights/kXQHVBwt
- **Walk discard rate** (started → discarded): https://eu.posthog.com/project/176183/insights/V5WhxLje

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
