import { createFileRoute } from "@tanstack/react-router";
import { mt5BridgePayloadSchema, verifyMt5BridgeSignature } from "@/lib/mt5-bridge-validation";

const MAX_BODY_BYTES = 256 * 1024;

export const Route = createFileRoute("/api/public/mt5-bridge")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const sharedSecret = process.env["MT5_BRIDGE_SHARED_SECRET"];
        if (!sharedSecret) {
          return Response.json({ error: "Bridge receiver is not configured." }, { status: 503 });
        }

        const contentLength = Number(request.headers.get("content-length") ?? 0);
        if (contentLength > MAX_BODY_BYTES) {
          return Response.json({ error: "Request body is too large." }, { status: 413 });
        }

        const rawBody = await request.text();
        if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
          return Response.json({ error: "Request body is too large." }, { status: 413 });
        }

        const timestamp = request.headers.get("x-nextra-timestamp") ?? "";
        const signature = request.headers.get("x-nextra-signature") ?? "";
        const validSignature = await verifyMt5BridgeSignature(
          rawBody,
          timestamp,
          signature,
          sharedSecret,
        );
        if (!validSignature) {
          return Response.json({ error: "Unauthorized." }, { status: 401 });
        }

        let untrustedBody: unknown;
        try {
          untrustedBody = JSON.parse(rawBody);
        } catch {
          return Response.json({ error: "Invalid JSON body." }, { status: 400 });
        }

        const parsed = mt5BridgePayloadSchema.safeParse(untrustedBody);
        if (!parsed.success) {
          return Response.json({ error: "Invalid bridge payload." }, { status: 400 });
        }

        const { account, events } = parsed.data;
        const receivedAt = new Date().toISOString();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { error: accountError } = await supabaseAdmin
          .from("mt5_bridge_account_snapshots")
          .upsert(
            {
              account_login: account.login,
              server: account.server,
              currency: account.currency ?? null,
              balance: account.balance ?? null,
              equity: account.equity ?? null,
              margin: account.margin ?? null,
              margin_free: account.margin_free ?? null,
              margin_level: account.margin_level ?? null,
              leverage: account.leverage ?? null,
              last_synced_at: receivedAt,
            },
            { onConflict: "account_login,server" },
          );

        if (accountError) {
          console.error("MT5 bridge account snapshot could not be saved.", accountError.message);
          return Response.json({ error: "Could not save account snapshot." }, { status: 500 });
        }

        if (events.length > 0) {
          const rows = events.map((event) => ({
            event_id: event.event_id,
            account_login: account.login,
            server: account.server,
            event_type: event.event_type,
            symbol: event.symbol,
            ticket: event.ticket,
            direction: event.direction ?? null,
            volume: event.volume ?? null,
            price_open: event.price_open ?? null,
            price_current: event.price_current ?? null,
            sl: event.sl ?? null,
            tp: event.tp ?? null,
            profit: event.profit ?? null,
            occurred_at: event.occurred_at,
            payload: event.payload ?? {},
          }));

          const { error: eventError } = await supabaseAdmin
            .from("mt5_bridge_events")
            .upsert(rows, { onConflict: "event_id", ignoreDuplicates: true });

          if (eventError) {
            console.error("MT5 bridge events could not be saved.", eventError.message);
            return Response.json({ error: "Could not save trade events." }, { status: 500 });
          }
        }

        return Response.json({ accepted: true, receivedEvents: events.length });
      },
    },
  },
});