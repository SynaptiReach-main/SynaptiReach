export async function executeSMSCampaign(data: any) {
  const twilio = await import("twilio");

  const client = twilio.default(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  return await client.messages.create({
    body: data.body,
    from: data.from,
    to: data.to,
  });
}
