import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendEmail(
  campaign: any,
  lead: any
) {
  await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/marketing/email/send`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        to: lead.email,
        subject:
          campaign.subject,
        html: campaign.body,
      }),
    }
  );
}

async function sendSMS(
  campaign: any,
  lead: any
) {
  await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/marketing/sms/send`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        to: lead.phone,
        body: campaign.body,
      }),
    }
  );
}

async function publishSocial(
  campaign: any
) {
  await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/marketing/social/publish`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        post: campaign.body,
        platforms:
          campaign.platforms,
      }),
    }
  );
}

function sleep(ms: number) {
  return new Promise(
    (resolve) =>
      setTimeout(resolve, ms)
  );
}

export async function executeCampaign(
  campaignId: string
) {
  const {
    data: campaign,
  } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (!campaign) {
    throw new Error(
      "Campaign not found"
    );
  }

  await supabase
    .from("marketing_campaigns")
    .update({
      status: "running",
    })
    .eq("id", campaignId);

  const {
    data: leads,
  } = await supabase
    .from("crm_leads")
    .select("*");

  const stagger =
    campaign.stagger_size || 50;

  let delivered = 0;

  if (
    campaign.type === "social"
  ) {
    await publishSocial(
      campaign
    );

    await supabase
      .from(
        "marketing_campaigns"
      )
      .update({
        status: "completed",
      })
      .eq(
        "id",
        campaignId
      );

    return;
  }

  for (
    let i = 0;
    i < (leads || []).length;
    i += stagger
  ) {
    const batch =
      leads?.slice(
        i,
        i + stagger
      ) || [];

    await Promise.all(
      batch.map(
        async (lead) => {
          try {
            if (
              campaign.type ===
              "email"
            ) {
              await sendEmail(
                campaign,
                lead
              );
            }

            if (
              campaign.type ===
              "sms"
            ) {
              await sendSMS(
                campaign,
                lead
              );
            }

            delivered++;

            await supabase
              .from(
                "marketing_events"
              )
              .insert({
                type: "campaign_delivery",
                event_type: "campaign_delivery",
                action: "delivered",
                title: "Campaign Delivered",
                message:
                  `${campaign.name || campaign.subject || campaign.id} delivered to ${lead.name || lead.email || lead.id}`,
                details:
                  `${campaign.name || campaign.subject || campaign.id} delivered to ${lead.name || lead.email || lead.id}`,
                campaign_id:
                  campaign.id,
              });
          } catch (error) {
            console.error(
              error
            );
          }
        }
      )
    );

    await supabase
      .from(
        "marketing_campaigns"
      )
      .update({
        delivered_count:
          delivered,
      })
      .eq(
        "id",
        campaignId
      );

    await sleep(3000);
  }

  await supabase
    .from(
      "marketing_campaigns"
    )
    .update({
      status: "completed",
      delivered_count:
        delivered,
    })
    .eq(
      "id",
      campaignId
    );
}
