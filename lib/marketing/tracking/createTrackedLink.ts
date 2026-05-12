export function createTrackedLink(
  url: string,
  campaignId: string,
  leadId: string
) {
  const base =
    process.env
      .NEXT_PUBLIC_APP_URL ||
    "";

  const encoded =
    encodeURIComponent(url);

  return `${base}/api/marketing/track/click?url=${encoded}&campaign=${campaignId}&lead=${leadId}`;
}
