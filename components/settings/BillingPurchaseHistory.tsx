"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import type { SimpleMetricDetail } from "@/components/dashboard/SimpleMetricModal";

type Props = {
  billing: any;
  creditPackPurchases: any[];
  billingEvents: any[];
  serviceRequests: any[];
  resendConfigured?: boolean;
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

function isResendRestriction(metadata: any) {
  const text = String(metadata?.credit_pack_confirmation_email_error || metadata?.confirmation_email?.reason || "").toLowerCase();
  return ["verified", "test", "recipient", "domain", "restricted"].some((term) => text.includes(term));
}

function latestByDate(items: any[], dateKey = "created_at") {
  return [...items].sort((a, b) => new Date(b?.[dateKey] || 0).getTime() - new Date(a?.[dateKey] || 0).getTime())[0] || null;
}

function StatusChip({ label, tone = "cyan" }: { label: string; tone?: "cyan" | "green" | "yellow" | "red" | "gray" }) {
  const tones = {
    cyan: "border-cyan-400/20 bg-cyan-500/10 text-cyan-100",
    green: "border-green-400/20 bg-green-500/10 text-green-100",
    yellow: "border-yellow-400/20 bg-yellow-500/10 text-yellow-100",
    red: "border-red-400/20 bg-red-500/10 text-red-100",
    gray: "border-white/10 bg-white/[0.04] text-gray-200",
  };
  return <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>{label}</span>;
}

function statusTone(status: any): "cyan" | "green" | "yellow" | "red" | "gray" {
  const value = String(status || "").toLowerCase();
  if (value.includes("paid") || value.includes("sent") || value.includes("processed")) return "green";
  if (value.includes("failed") || value.includes("cancel")) return "red";
  if (value.includes("required") || value.includes("pending") || value.includes("checkout")) return "yellow";
  return "cyan";
}

function CollapsibleGroup({
  title,
  count,
  status,
  open,
  onToggle,
  children,
}: {
  title: string;
  count: number;
  status: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <button type="button" onClick={onToggle} className="flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-black text-white">{title}</h4>
          <StatusChip label={`${count} record${count === 1 ? "" : "s"}`} tone="gray" />
          <StatusChip label={status} tone={statusTone(status)} />
        </div>
        <ChevronDown className={`text-cyan-200 transition ${open ? "rotate-180" : ""}`} size={18} />
      </button>
      {open && <div className="border-t border-white/10 p-4">{children}</div>}
    </div>
  );
}

export default function BillingPurchaseHistory({
  billing,
  creditPackPurchases,
  billingEvents,
  serviceRequests,
  resendConfigured = false,
  setSelectedMetric,
  planDisplayName,
  billingModeLabel,
}: Props) {
  const recentBillingEvents = billingEvents.slice(0, 8);
  const recentServiceRequests = serviceRequests.slice(0, 6);
  const billingHistoryCount = creditPackPurchases.length + billingEvents.length + serviceRequests.length + (billing ? 1 : 0);
  const latestPurchase = useMemo(() => latestByDate(creditPackPurchases), [creditPackPurchases]);
  const latestWebhook = useMemo(() => latestByDate(billingEvents), [billingEvents]);
  const latestService = useMemo(() => latestByDate(serviceRequests, "requested_at"), [serviceRequests]);
  const emailStatus = latestPurchase ? emailConfirmationState(latestPurchase.metadata) : "No receipt activity";
  const latestEmailFailed = Boolean(latestPurchase?.metadata?.credit_pack_confirmation_email_failed);
  const resendRestriction = isResendRestriction(latestPurchase?.metadata) || (latestEmailFailed && !resendConfigured);
  const [openGroups, setOpenGroups] = useState({
    creditPacks: false,
    subscription: false,
    webhooks: false,
    services: false,
  });

  useEffect(() => {
    if (latestPurchase && ["paid", "checkout_created"].includes(String(latestPurchase.status))) {
      setOpenGroups((current) => ({ ...current, creditPacks: true }));
    }
  }, [latestPurchase?.id, latestPurchase?.status]);

  const toggleGroup = (key: keyof typeof openGroups) => {
    setOpenGroups((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-black text-white">Billing & Purchase History</h3>
          <p className="mt-2 text-sm text-gray-400">
            Compact payment, webhook, receipt, and consultation status. Expand a group for detailed records.
          </p>
        </div>
        <StatusChip label={`${billingHistoryCount} total record${billingHistoryCount === 1 ? "" : "s"}`} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Latest purchase", latestPurchase ? `${readableStatus(latestPurchase.status)} · ${formatCents(latestPurchase.price_cents)}` : "No purchases"],
          ["Latest webhook", latestWebhook ? `${readableStatus(latestWebhook.status)} · ${latestWebhook.event_type}` : "No webhook events"],
          ["Receipt email", emailStatus],
          ["Services", latestService ? `${serviceRequests.length} request${serviceRequests.length === 1 ? "" : "s"} · ${readableStatus(latestService.status)}` : "No requests"],
          ["Resend setup", resendConfigured ? "Configured in this runtime" : "Production env missing or unavailable"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-gray-500">{label}</div>
            <div className="mt-2 text-sm font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      {latestEmailFailed && (
        <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          {resendRestriction
            ? "Email attempted, but Resend is currently restricted to verified/test recipients. Verify a sending domain before customer receipt emails can be delivered."
            : "Email attempted, but Resend returned a delivery error. Review the safe failure reason in the expanded credit-pack record."}
        </div>
      )}
      {!resendConfigured && (
        <div className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          Receipt emails require RESEND_API_KEY and RESEND_FROM_EMAIL in production. Until a verified sending domain is configured, customer receipt delivery may remain blocked by Resend. The temporary sender can remain SynaptiReach &lt;onboarding@resend.dev&gt; for test-only delivery.
        </div>
      )}

      {billingHistoryCount === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">
          No billing, credit-pack, webhook, or consultation history has been recorded for this workspace yet.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <CollapsibleGroup
            title="Credit pack purchases"
            count={creditPackPurchases.length}
            status={latestPurchase ? readableStatus(latestPurchase.status) : "No purchases"}
            open={openGroups.creditPacks}
            onToggle={() => toggleGroup("creditPacks")}
          >
            {creditPackPurchases.length === 0 ? (
              <div className="text-sm text-gray-400">No credit-pack purchases yet.</div>
            ) : (
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
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-black text-white">{purchase.pack_type || "Credit pack"}</div>
                        <div className="mt-1 text-xs text-gray-500">{formatHistoryDate(purchase.created_at)}</div>
                      </div>
                      <StatusChip label={readableStatus(purchase.status)} tone={statusTone(purchase.status)} />
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-gray-400 sm:grid-cols-2">
                      <div>Amount: <span className="text-white">{formatCents(purchase.price_cents)}</span></div>
                      <div>Stripe ref: <span className="text-white">{safeStripeReference(purchase.checkout_reference || purchase.metadata?.stripe_session_id)}</span></div>
                      <div>Webhook: <span className="text-white">{webhookConfirmationState(purchase)}</span></div>
                      <div>Email: <span className="text-white">{emailConfirmationState(purchase.metadata)}</span></div>
                      {purchase.metadata?.credit_pack_confirmation_email_recipient && (
                        <div className="sm:col-span-2">Recipient: <span className="text-white">{purchase.metadata.credit_pack_confirmation_email_recipient}</span></div>
                      )}
                      {purchase.metadata?.credit_pack_confirmation_email_error && (
                        <div className="sm:col-span-2">Safe failure: <span className="text-white">{purchase.metadata.credit_pack_confirmation_email_error}</span></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CollapsibleGroup>

          <CollapsibleGroup
            title="Subscription checkout"
            count={billing ? 1 : 0}
            status={billing ? readableStatus(billing.status) : "No subscription account"}
            open={openGroups.subscription}
            onToggle={() => toggleGroup("subscription")}
          >
            {billing ? (
              <button
                type="button"
                onClick={() => setSelectedMetric({
                  title: "Subscription billing account",
                  value: readableStatus(billing.status),
                  description: "Subscription state is updated from Stripe Checkout and verified Stripe webhook lifecycle events. The app does not mark a subscription active before webhook confirmation.",
                  records: [billing],
                  href: "/dashboard/settings#billing",
                })}
                className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="font-black text-white">{planDisplayName(billing.plan_tier || billing.metadata?.selected_plan || "Plan not selected")}</div>
                    <div className="mt-1 text-xs text-gray-500">{formatHistoryDate(billing.created_at)}</div>
                  </div>
                  <StatusChip label={readableStatus(billing.status)} tone={statusTone(billing.status)} />
                </div>
                <div className="mt-3 grid gap-2 text-xs text-gray-400 sm:grid-cols-2">
                  <div>Billing mode: <span className="text-white">{billingModeLabel(billing.billing_mode)}</span></div>
                  <div>Stripe customer: <span className="text-white">{safeStripeReference(billing.stripe_customer_id)}</span></div>
                  <div>Subscription: <span className="text-white">{safeStripeReference(billing.stripe_subscription_id)}</span></div>
                  <div>Trial ends: <span className="text-white">{billing.trial_ends_at ? formatHistoryDate(billing.trial_ends_at) : "Not set"}</span></div>
                </div>
              </button>
            ) : (
              <div className="text-sm text-gray-400">No subscription checkout record has been stored yet.</div>
            )}
          </CollapsibleGroup>

          <CollapsibleGroup
            title="Stripe webhook events"
            count={billingEvents.length}
            status={latestWebhook ? readableStatus(latestWebhook.status) : "No events"}
            open={openGroups.webhooks}
            onToggle={() => toggleGroup("webhooks")}
          >
            {recentBillingEvents.length === 0 ? (
              <div className="text-sm text-gray-400">No Stripe webhook events have reached this workspace yet.</div>
            ) : (
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
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-black text-white">{event.event_type}</div>
                        <div className="mt-1 text-xs text-gray-500">{formatHistoryDate(event.created_at)}</div>
                      </div>
                      <StatusChip label={readableStatus(event.status)} tone={statusTone(event.status)} />
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
            )}
          </CollapsibleGroup>

          <CollapsibleGroup
            title="Service consultation requests"
            count={serviceRequests.length}
            status={latestService ? readableStatus(latestService.status) : "No requests"}
            open={openGroups.services}
            onToggle={() => toggleGroup("services")}
          >
            {recentServiceRequests.length === 0 ? (
              <div className="text-sm text-gray-400">No service consultation requests have been recorded yet.</div>
            ) : (
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
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-black text-white">{request.item_name || request.service_type || "Service request"}</div>
                        <div className="mt-1 text-xs text-gray-500">{formatHistoryDate(request.requested_at)}</div>
                      </div>
                      <StatusChip label={readableStatus(request.status)} tone={statusTone(request.status)} />
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
            )}
          </CollapsibleGroup>
        </div>
      )}
    </div>
  );
}
