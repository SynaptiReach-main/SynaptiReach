import { NextResponse } from "next/server";

import {
  getScheduledCampaigns,
} from "@/lib/marketing/scheduler/getScheduledCampaigns";

import {
  getWorkspaceIntegrations,
} from "@/lib/integrations/getWorkspaceIntegrations";

import {
  executeEmailCampaign,
} from "@/lib/marketing/execution/executeEmailCampaign";

import {
  executeSMSCampaign,
} from "@/lib/marketing/execution/executeSMSCampaign";

import {
  executeSocialCampaign,
} from "@/lib/marketing/execution/executeSocialCampaign";

export async function GET() {
  try {
    const campaigns =
      await getScheduledCampaigns();

    const results = [];

    for (const campaign of campaigns) {
      try {
        const integrations =
          await getWorkspaceIntegrations(
            campaign.workspace_id
          );

        if (!integrations) {
          continue;
        }

        let result = null;

        if (
          campaign.channel ===
          "email"
        ) {
          result =
            await executeEmailCampaign(
              campaign,
              integrations.resend_api_key
            );
        }

        if (
          campaign.channel ===
          "sms"
        ) {
          result =
            await executeSMSCampaign(
              campaign,
              integrations.twilio_sid,
              integrations.twilio_token
            );
        }

        if (
          campaign.channel ===
          "social"
        ) {
          result =
            await executeSocialCampaign(
              campaign,
              integrations.ayrshare_key
            );
        }

        results.push({
          campaign_id:
            campaign.id,

          success: true,

          result,
        });
      } catch (error: any) {
        results.push({
          campaign_id:
            campaign.id,

          success: false,

          error:
            error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed:
        results.length,

      results,
    });
  } catch (error: any) {
    const setupRequired = String(error?.message || "").includes(
      "Supabase setup required"
    );

    return NextResponse.json(
      {
        success: false,
        setup_required: setupRequired,
        error:
          error.message,
      },
      {
        status: setupRequired ? 503 : 500,
      }
    );
  }
}
