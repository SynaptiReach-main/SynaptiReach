export async function executeEmailCampaign(data: any) {
  const { Resend } = await import("resend");

  const resend = new Resend(process.env.RESEND_API_KEY);

  return await resend.emails.send({
    from: data.from,
    to: data.to,
    subject: data.subject,
    html: data.html,
  });
}
