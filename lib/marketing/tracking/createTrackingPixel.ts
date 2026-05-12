export function createTrackingPixel(
  campaignId: string,
  leadId: string
) {
  const base =
    process.env
      .NEXT_PUBLIC_APP_URL ||
    "";

  return `
    <img
      src="${base}/api/marketing/track/open?campaign=${campaignId}&lead=${leadId}"
      width="1"
      height="1"
      style="display:none;"
    />
  `;
}
