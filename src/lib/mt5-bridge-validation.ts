import { z } from "zod";

const nullableFiniteNumber = z.number().finite().nullable().optional();
const safePositiveInteger = z
  .number()
  .int()
  .positive()
  .max(Number.MAX_SAFE_INTEGER);

export const mt5BridgePayloadSchema = z
  .object({
    account: z
      .object({
        login: safePositiveInteger,
        server: z.string().trim().min(1).max(160),
        currency: z.string().max(16).nullable().optional(),
        balance: nullableFiniteNumber,
        equity: nullableFiniteNumber,
        margin: nullableFiniteNumber,
        margin_free: nullableFiniteNumber,
        margin_level: nullableFiniteNumber,
        leverage: z.number().int().nonnegative().nullable().optional(),
      })
      .strict(),
    events: z
      .array(
        z
          .object({
            event_id: z.string().min(1).max(128).regex(/^[a-zA-Z0-9:_-]+$/),
            event_type: z.enum(["OPEN", "CLOSE", "MODIFY"]),
            symbol: z.string().trim().min(1).max(32),
            ticket: safePositiveInteger,
            direction: z.enum(["BUY", "SELL"]).optional(),
            volume: nullableFiniteNumber,
            price_open: nullableFiniteNumber,
            price_current: nullableFiniteNumber,
            sl: nullableFiniteNumber,
            tp: nullableFiniteNumber,
            profit: nullableFiniteNumber,
            occurred_at: z.string().datetime({ offset: true }),
            payload: z.record(z.string(), z.unknown()).optional(),
          })
          .strict(),
      )
      .max(100),
  })
  .strict();

export type Mt5BridgePayload = z.infer<typeof mt5BridgePayloadSchema>;

export async function verifyMt5BridgeSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
  secret: string,
  nowMs = Date.now(),
): Promise<boolean> {
  if (!secret || !/^\d{10}$/.test(timestamp) || !/^[a-f\d]{64}$/i.test(signature)) {
    return false;
  }

  const requestSeconds = Number(timestamp);
  if (!Number.isSafeInteger(requestSeconds) || Math.abs(Math.floor(nowMs / 1000) - requestSeconds) > 300) {
    return false;
  }

  const signatureBytes = new Uint8Array(
    signature.match(/.{2}/g)?.map((part) => Number.parseInt(part, 16)) ?? [],
  );
  if (signatureBytes.length !== 32) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  return crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  );
}