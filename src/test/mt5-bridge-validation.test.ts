import { describe, expect, it } from "vitest";
import { mt5BridgePayloadSchema, verifyMt5BridgeSignature } from "@/lib/mt5-bridge-validation";

const validAccount = {
  login: 12345678,
  server: "Demo-Server",
  currency: "USD",
  balance: 1000,
  equity: 1000,
  margin: 0,
  margin_free: 1000,
  margin_level: 0,
  leverage: 100,
};

function validEvent(eventType: "OPEN" | "CLOSE" | "MODIFY") {
  return {
    event_id: `event-${eventType.toLowerCase()}`,
    event_type: eventType,
    symbol: "EURUSD",
    ticket: 7654321,
    direction: "BUY",
    volume: 0.1,
    price_open: 1.08,
    price_current: 1.08,
    sl: 1.07,
    tp: 1.09,
    profit: 0,
    occurred_at: "2026-11-18T00:00:00.000Z",
  };
}

describe("MT5 bridge payload validation", () => {
  it.each(["OPEN", "CLOSE", "MODIFY"] as const)("accepts %s events", (eventType) => {
    const result = mt5BridgePayloadSchema.safeParse({
      account: validAccount,
      events: [validEvent(eventType)],
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.events[0]?.event_type).toBe(eventType);
  });

  it("rejects event types outside OPEN, CLOSE, and MODIFY", () => {
    const result = mt5BridgePayloadSchema.safeParse({
      account: validAccount,
      events: [
        {
          ...validEvent("OPEN"),
          event_type: "DELETE",
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});

describe("MT5 bridge request signatures", () => {
  it("accepts a correctly signed recent request", async () => {
    const body = JSON.stringify({ ok: true });
    const timestamp = "1794960000";
    const testSecret = "test-only-bridge-secret";
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(testSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${timestamp}.${body}`),
    );
    const signature = Array.from(new Uint8Array(signatureBytes), (byte) => byte.toString(16).padStart(2, "0")).join("");

    await expect(
      verifyMt5BridgeSignature(body, timestamp, signature, testSecret, 1794960000000),
    ).resolves.toBe(true);
  });

  it("rejects a request outside the five-minute signing window", async () => {
    await expect(
      verifyMt5BridgeSignature("{}", "1794960000", "0".repeat(64), "test-only-bridge-secret", 1794960601000),
    ).resolves.toBe(false);
  });

  it("rejects a signature that does not match the request", async () => {
    await expect(
      verifyMt5BridgeSignature("{}", "1794960000", "0".repeat(64), "test-only-bridge-secret", 1794960000000),
    ).resolves.toBe(false);
  });
});