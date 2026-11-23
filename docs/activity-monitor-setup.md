# Live Activity Monitor setup

The dashboard now includes a live activity drawer and a server-side event API. The UI polls every five seconds. Events are shared across devices through Supabase; they are not fabricated or inferred from the dashboard.

## 1. Create the private event table
1. Create a free Supabase project.
2. Open SQL Editor.
3. Run `supabase/activity_events.sql` from this repository.

## 2. Add Vercel environment variables
Add these to the Vercel project for Preview and Production, then redeploy:
- `SUPABASE_URL`: project URL, for example `https://<project-ref>.supabase.co`.
- `SUPABASE_SERVICE_ROLE_KEY`: the server-only service-role key. Never expose it with a `NEXT_PUBLIC_` prefix and never commit it.
- `ACTIVITY_INGEST_SECRET`: a random secret of at least 32 characters. Keep it outside the browser and repository.

The existing Google sign-in session is required to read activity in the dashboard. It requests basic profile/email only and is not Gmail mailbox access.

## 3. Send real assistant workflow events
Any trusted server-side worker or automation can record an event by calling:

```http
POST https://YOUR-APP/api/activity
Authorization: Bearer YOUR_ACTIVITY_INGEST_SECRET
Content-Type: application/json
```

Example body:

```json
{
  "actor": "assistant",
  "category": "opportunity_research",
  "title": "بررسی شرایط پرداخت یک پلتفرم",
  "detail": "روش پرداخت، حداقل برداشت و محدودیت کشور در منبع رسمی بررسی شد.",
  "status": "completed",
  "requires_user_action": true,
  "action_label": "بررسی و ثبت‌نام",
  "action_url": "https://example.com/signup",
  "metadata": {"source": "trusted-worker"}
}
```

Allowed status values: `running`, `completed`, `needs_action`, `failed`. Allowed actors: `assistant`, `user`, `system`. Only HTTPS action links are accepted. The ingest secret is a server-to-server credential: do not put it in browser JavaScript, mobile app bundles, or public source code.

## Current integration boundary
The monitor and protected API are implemented, but the existing ChatGPT conversation and Vercel deployment do not automatically stream their internal actions into this app. A trusted automation/worker must explicitly call the event API at each real workflow step. Until Supabase and the ingest secret are configured, the UI clearly reports that live storage is not configured.
