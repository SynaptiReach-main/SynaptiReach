type EmailInput = {
  to?: string | null;
  subject: string;
  text: string;
  replyTo?: string | null;
};

export async function sendSynaptiReachEmail(input: EmailInput) {
  const apiKey = process.env.RESEND_API_KEY || "";
  if (!apiKey) {
    return { success: false, setupRequired: true, error: "Resend is not configured." };
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "SynaptiReach <onboarding@resend.dev>",
        to: [input.to || process.env.SYNAPTIREACH_CONTACT_EMAIL || "synaptireach@gmail.com"],
        subject: input.subject,
        text: input.text,
        reply_to: input.replyTo || undefined,
      }),
    });
  } catch {
    return {
      success: false,
      setupRequired: false,
      error: "Resend request failed. Verify network access and Resend sender/recipient configuration.",
    };
  }

  const body = await response.json().catch(() => ({}));
  return response.ok
    ? { success: true, setupRequired: false, id: body.id || null, error: null }
    : { success: false, setupRequired: false, error: body?.message || "Resend email failed." };
}
