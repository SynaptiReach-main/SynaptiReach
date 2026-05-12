export function createUnsubscribeLink(
  workspaceId: string,
  contact: string
) {
  const base =
    process.env
      .NEXT_PUBLIC_APP_URL || "";

  const encoded =
    encodeURIComponent(
      contact
    );

  return `${base}/api/marketing/unsubscribe?workspace=${workspaceId}&contact=${encoded}`;
}
