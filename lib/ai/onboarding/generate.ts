export {};
export function generateWorkspaceBlueprint(industry: string) {
  const base = {
    "AI SaaS": {
      pipeline: ["Lead Capture", "Demo Booked", "Trial", "Paid"],
      crm: ["Leads", "Companies", "Conversations"],
      automations: ["email_followup", "trial_nurture", "upgrade_prompt"]
    },
    "Agency": {
      pipeline: ["Inbound Lead", "Qualified", "Proposal", "Won"],
      crm: ["Clients", "Leads", "Projects"],
      automations: ["proposal_followup", "retainer_upsell"]
    },
    "Ecommerce": {
      pipeline: ["Visitor", "Cart", "Checkout", "Purchase"],
      crm: ["Customers", "Orders", "Abandoned Carts"],
      automations: ["abandoned_cart", "post_purchase", "upsell"]
    }
  };

  return base[industry as keyof typeof base] || {
    pipeline: ["Lead", "Contacted", "Closed"],
    crm: ["Contacts"],
    automations: []
  };
}
