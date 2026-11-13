import {
  AdminPushSubscription,
  recordAdminAlert,
  recordAdminAlertAsync,
  readDb,
  readDbAsync,
  updateDb,
  updateDbAsync,
  AdminAlertEvent,
} from "./db";

// VAPID Cryptographic Keypair for Web Push Notifications
const DEFAULT_VAPID_SUBJECT = "mailto:info@nannymaisoncare.lu";

export function getVapidPublicKey(): string {
  return (
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    process.env.VAPID_PUBLIC_KEY ||
    ""
  ).trim();
}

export function getVapidPrivateKey(): string {
  return (process.env.VAPID_PRIVATE_KEY || "").trim();
}

export function savePushSubscription(
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  },
  userAgent?: string
): AdminPushSubscription {
  const newSub: AdminPushSubscription = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    endpoint: subscription.endpoint,
    keys: subscription.keys,
    userAgent,
    createdAt: new Date().toISOString(),
  };

  updateDb((draft) => {
    if (!draft.adminPushSubscriptions) {
      draft.adminPushSubscriptions = [];
    }
    draft.adminPushSubscriptions = draft.adminPushSubscriptions.filter(
      (s) => s.endpoint !== subscription.endpoint
    );
    draft.adminPushSubscriptions.unshift(newSub);
    if (draft.adminPushSubscriptions.length > 20) {
      draft.adminPushSubscriptions = draft.adminPushSubscriptions.slice(0, 20);
    }
  });

  return newSub;
}

export async function savePushSubscriptionAsync(
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  },
  userAgent?: string
): Promise<AdminPushSubscription> {
  const newSub: AdminPushSubscription = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    endpoint: subscription.endpoint,
    keys: subscription.keys,
    userAgent,
    createdAt: new Date().toISOString(),
  };

  await updateDbAsync((draft) => {
    if (!draft.adminPushSubscriptions) {
      draft.adminPushSubscriptions = [];
    }
    draft.adminPushSubscriptions = draft.adminPushSubscriptions.filter(
      (s) => s.endpoint !== subscription.endpoint
    );
    draft.adminPushSubscriptions.unshift(newSub);
    if (draft.adminPushSubscriptions.length > 20) {
      draft.adminPushSubscriptions = draft.adminPushSubscriptions.slice(0, 20);
    }
  });

  return newSub;
}

export async function notifyAdmin(payload: {
  type: AdminAlertEvent["type"];
  title: string;
  body: string;
  url?: string;
}): Promise<AdminAlertEvent> {
  const targetUrl = payload.url || "/admin";

  // 1. Record in DB and persist to Supabase for instant live poller / badge updates
  const alert = await recordAdminAlertAsync({
    type: payload.type,
    title: payload.title,
    body: payload.body,
    url: targetUrl,
  });

  // 2. Dispatch Web Push if subscriptions exist (retrieved from Supabase)
  try {
    const db = await readDbAsync();
    const subs = db.adminPushSubscriptions || [];

    if (subs.length > 0) {
      // Dynamically load web-push to prevent bundling issues if not installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const webPush = require("web-push");
      const publicKey = getVapidPublicKey();
      const privateKey = getVapidPrivateKey();

      if (publicKey && privateKey) {
        const vapidSubject = process.env.VAPID_SUBJECT || DEFAULT_VAPID_SUBJECT;
        webPush.setVapidDetails(vapidSubject, publicKey, privateKey);

        const pushData = JSON.stringify({
          title: payload.title,
          body: payload.body,
          url: targetUrl,
          tag: `maisoncare-${payload.type.toLowerCase()}`,
          timestamp: alert.timestamp,
        });

        await Promise.allSettled(
          subs.map(async (sub) => {
            try {
              await webPush.sendNotification(
                {
                  endpoint: sub.endpoint,
                  keys: sub.keys,
                },
                pushData
              );
            } catch (err: unknown) {
              const status = (err as { statusCode?: number })?.statusCode;
              // 410 Gone or 404 Not Found indicates subscription expired
              if (status === 410 || status === 404) {
                await updateDbAsync((draft) => {
                  draft.adminPushSubscriptions = (
                    draft.adminPushSubscriptions || []
                  ).filter((s) => s.endpoint !== sub.endpoint);
                });
              }
            }
          })
        );
      }
    }
  } catch (err) {
    // Non-fatal: if web-push is unconfigured or failed, the client-side
    // live-alerts poller & native audio/vibration listener delivers it immediately.
    console.warn("[PushService] Push dispatch note:", err);
  }

  return alert;
}

