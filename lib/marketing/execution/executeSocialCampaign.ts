export async function executeSocialCampaign(
  campaign: any,
  apiKey: string
) {
  const response =
    await fetch(
      "https://app.ayrshare.com/api/post",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          post:
            campaign.content,

          platforms:
            ["facebook", "instagram"],
        }),
      }
    );

  const data =
    await response.json();

  return data;
}
