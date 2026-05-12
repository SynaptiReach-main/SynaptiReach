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

    for (const campaign of campaigns) {
      const integrations =
        await getWorkspaceIntegrations(
          campaign.workspace_id
        );

      if (!integrations) {
        continue;
      }

      if (
        campaign.channel ===
        "email"
      ) {
        await executeEmailCampaign(
          campaign,
          integrations.resend_api_key
        );
      }

      if (
        campaign.channel ===
        "sms"
      ) {
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
        await executeSocialCampaign(
          campaign,
          integrations.ayrshare_key
        );
      }
    }

    return NextResponse.json({
      success: true,
      total:
        campaigns.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}
