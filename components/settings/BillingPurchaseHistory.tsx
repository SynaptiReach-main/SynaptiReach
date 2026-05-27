"use client";

import type { SimpleMetricDetail } from "@/components/dashboard/SimpleMetricModal";

type Props = {
  billing: any;
  creditPackPurchases: any[];
  billingEvents: any[];
  serviceRequests: any[];
  setSelectedMetric: (metric: SimpleMetricDetail | null) => void;
  planDisplayName: (value: string | null | undefined) => string;
  billingModeLabel: (value: string | null | undefined) => string;
};

function formatCents(value: any) {
  const cents = Number(value || 0);
  if (!cents) return "Amount not recorded";
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatHistoryDate(value: any) {
  if (!value) return "Date not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not recorded";
  return date.toLocaleString();
}

function safeStripeReference(value: any) {
  if (!value) return "Not recorded";
  const text = String(value);
  if (text.length <= 14) return text;
  return `${text.slice(0, 8)}...${text.slice(-6)}`;
}

function readableStatus(value: any) {
  const status = String(value || "pending_webhook_confirmation");
  const labels: Record<string, string> = {
    checkout_required: "Checkout Required",
    checkout_created: "Checkout Created",
    pending_webhook_confirmation: "Pending Webhook Confirmation",
    paid: "Paid",
    expired: "Expired",
    payment_failed: "Payment Failed",
    requires_action: "Requires Action",
    cancelled: "Cancelled",
    consultation_requested: "Consultation Requested",
    processed: "Processed",
    received: "Received",
  };
  return labels[status] || status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function emailConfirmationState(metadata: any) {
  if (metadata?.credit_pack_confirmation_email_sent) return "Sent";
  if (metadata?.credit_pack_confirmation_email_failed) return "Failed";
  if (metadata?.credit_pack_confirmation_email_skipped_reason) return `Skipped: ${metadata.credit_pack_confirmation_email_skipped_reason}`;
  if (metadata?.credit_pack_confirmation_email_attempted) return "Attempted";
  return "Not attempted";
}

function webhookConfirmationState(record: any) {
  const metadata = record?.metadata || {};
  if (record?.status === "paid") return "Payment confirmed by webhook";
  if (metadata.stripe_event_type || metadata.webhook_processed_at) return "Webhook reached app";
  if (record?.status === "checkout_created") return "Waiting for webhook";
  return "No webhook confirmation yet";
}

export default function BillingPurchaseHistory({
  billing,
  creditPackPurchases,
  billingEvents,
  serviceRequests,
  setSelectedMetric,
  planDisplayName,
  billingModeLabel,
}: Props) {
  const recentBillingEvents = billingEvents.slice(0, 8);
  const recentServiceRequests = serviceRequests.slice(0, 6);
  const billingHistoryCount = creditPackPurchases.length + billingEvents.length + serviceRequests.length + (billing ? 1 : 0);

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-black text-white">Billing & Purchase History</h3>
          <p className="mt-2 text-sm text-gray-400">
            Track checkout attempts, webhook confirmation, credit-pack payment state, confirmation email diagnostics, and consultation requests.
          </p>
        </div>
        <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-100">
          {billingHistoryCount} record{billingHistoryCount === 1 ? "" : "s"}
        </span>
      </div>

      {billingHistoryCount === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">
          No billing, credit-pack, webhook, or consultation history has been recorded for this workspace yet.
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {creditPackPurchases.length > 0 && (
            <div>
              <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Credit pack purchases</div>
              <div className="grid gap-3 lg:grid-cols-2">
                {creditPackPurchases.slice(0, 8).map((purchase) => (
                  <button
                    key={purchase.id}
                    type="button"
                    onClick={() => setSelectedMetric({
                      title: purchase.pack_type || "Credit pack purchase",
                      value: readableStatus(purchase.status),
                      description: "Credit-pack purchases are marked paid only after Stripe webhook confirmation. Email diagnostics are recorded after the app attempts the confirmation email.",
                      records: [purchase],
                      href: "/dashboard/settings#billing",
                    })}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-black text-white">{purchase.pack_type || "Credit pack"}</div>
                        <div className="mt-1 text-xs text-gray-500">{formatHistoryDate(purchase.created_at)}</div>
                      </div>
                      <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-cyan-100">
                        {readableStatus(purchase.status)}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-gray-400 sm:grid-cols-2">
                      <div>Amount: <span className="text-white">{formatCents(purchase.price_cents)}</span></div>
                      <div>Stripe ref: <span className="text-white">{safeStripeReference(purchase.checkout_reference || purchase.metadata?.stripe_session_id)}</span></div>
                      <div>Webhook: <span className="text-white">{webhookConfirmationState(purchase)}</span></div>
                      <div>Email: <span className="text-white">{emailConfirmationState(purchase.metadata)}</span></div>
                      {purchase.metadata?.credit_pack_confirmation_email_recipient && (
                        <div className="sm:col-span-2">Recipient: <span className="text-white">{purchase.metadata.credit_pack_confirmation_email_recipient}</span></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {billing && (
            <div>
              <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Subscription checkout</div>
              <button
                type="button"
                onClick={() => setSelectedMetric({
                  title: "Subscription billing account",
                  value: readableStatus(billing.status),
                  description: "Subscription state is updated from Stripe Checkout and verified Stripe webhook lifecycle events. The app does not mark a subscription active before webhook confirmation.",
                  records: [billing],
                  href: "/dashboard/settings#billing",
                })}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="font-black text-white">{planDisplayName(billing.plan_tier || billing.metadata?.selected_plan || "Plan not selected")}</div>
                    <div className="mt-1 text-xs text-gray-500">{formatHistoryDate(billing.created_at)}</div>
                  </div>
                  <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-cyan-100">
                    {readableStatus(billing.status)}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-gray-400 sm:grid-cols-2">
                  <div>Billing mode: <span className="text-white">{billingModeLabel(billing.billing_mode)}</span></div>
                  <div>Stripe customer: <span className="text-white">{safeStripeReference(billing.stripe_customer_id)}</span></div>
                  <div>Subscription: <span className="text-white">{safeStripeReference(billing.stripe_subscription_id)}</span></div>
                  <div>Trial ends: <span className="text-white">{billing.trial_ends_at ? formatHistoryDate(billing.trial_ends_at) : "Not set"}</span></div>
                </div>
              </button>
            </div>
          )}

          {recentBillingEvents.length > 0 && (
            <div>
              <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Stripe webhook events</div>
              <div className="grid gap-3 lg:grid-cols-2">
                {recentBillingEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedMetric({
                      title: event.event_type || "Stripe event",
                      value: readableStatus(event.status),
                      description: "Safe Stripe webhook diagnostics. Secrets and raw payment method details are never shown here.",
                      records: [event],
                      href: "/dashboard/settings#billing",
                    })}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-black text-white">{event.event_type}</div>
                        <div className="mt-1 text-xs text-gray-500">{formatHistoryDate(event.created_at)}</div>
                      </div>
                      <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-cyan-100">
                        {readableStatus(event.status)}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-gray-400 sm:grid-cols-2">
                      <div>Event reached app: <span className="text-white">Yes</span></div>
                      <div>Signature verified: <span className="text-white">{event.metadata?.webhook_signature_verified ? "Yes" : "Not recorded"}</span></div>
                      <div>Purchase matched: <span className="text-white">{event.metadata?.purchase_matched ? "Yes" : "No"}</span></div>
                      <div>Email: <span className="text-white">{event.metadata?.confirmation_email?.sent ? "Sent" : event.metadata?.confirmation_email?.reason || "Not applicable"}</span></div>
                      <div className="sm:col-span-2">Stripe event: <span className="text-white">{safeStripeReference(event.stripe_event_id)}</span></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {recentServiceRequests.length > 0 && (
            <div>
              <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Service consultation requests</div>
              <div className="grid gap-3 lg:grid-cols-2">
                {recentServiceRequests.map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setSelectedMetric({
                      title: request.item_name || "Service request",
                      value: readableStatus(request.status),
                      description: "Service requests remain consultation-first and review-gated. They do not create paid service state by themselves.",
                      records: [request],
                      href: "/dashboard/settings#services",
                    })}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-black text-white">{request.item_name || request.service_type || "Service request"}</div>
                        <div className="mt-1 text-xs text-gray-500">{formatHistoryDate(request.requested_at)}</div>
                      </div>
                      <span className="w-fit rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-cyan-100">
                        {readableStatus(request.status)}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-gray-400 sm:grid-cols-2">
                      <div>Amount: <span className="text-white">{formatCents(request.price_cents)}</span></div>
                      <div>Type: <span className="text-white">{request.recurring ? "Recurring" : "One-time"}</span></div>
                      <div>Consultation: <span className="text-white">{request.consultation_required ? "Required" : "Not required"}</span></div>
                      <div>Checkout: <span className="text-white">{safeStripeReference(request.checkout_session_id)}</span></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
