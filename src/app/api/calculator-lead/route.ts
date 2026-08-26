import { NextResponse } from "next/server";

/**
 * Public calculator email-capture endpoint.
 *
 * v1: validates input, logs to server console, returns success.
 * Charlie to wire this to n8n / a real email service when ready.
 * The simplest swap is to POST the same payload to an n8n webhook URL
 * stored in process.env.N8N_CALCULATOR_WEBHOOK.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { email, bookedPerMonth, spend } = body as {
    email?: unknown;
    bookedPerMonth?: unknown;
    spend?: unknown;
  };

  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  if (typeof bookedPerMonth !== "number" || bookedPerMonth <= 0) {
    return NextResponse.json(
      { error: "invalid bookedPerMonth" },
      { status: 400 },
    );
  }
  if (typeof spend !== "number" || spend < 0) {
    return NextResponse.json({ error: "invalid spend" }, { status: 400 });
  }

  console.log("[calculator-lead]", {
    email,
    bookedPerMonth,
    spend,
    receivedAt: new Date().toISOString(),
  });

  const webhook = process.env.N8N_CALCULATOR_WEBHOOK;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, bookedPerMonth, spend }),
      });
    } catch (err) {
      console.error("[calculator-lead] webhook forward failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}
