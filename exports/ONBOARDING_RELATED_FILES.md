# SynaptiReach Onboarding Related Files


## .\app\(marketing)\signup\page.tsx

```
export {};
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const INDUSTRIES = [
  "Accounting",
  "Advertising Agency",
  "Appliance Repair",
  "Architecture",
  "Auto Detailing",
  "Automotive Repair",
  "Bakery",
  "Barbershop",
  "Beauty Salon",
  "Bookkeeping",
  "Business Consulting",
  "Carpet Cleaning",
  "Catering",
  "Chiropractic",
  "Cleaning Services",
  "Construction",
  "Contractor",
  "Dental",
  "Digital Marketing",
  "Electrician",
  "Event Planning",
  "Financial Services",
  "Fitness Gym",
  "Flooring",
  "Food Truck",
  "Graphic Design",
  "HVAC",
  "Home Inspection",
  "Home Security",
  "Insurance",
  "Interior Design",
  "IT Services",
  "Junk Removal",
  "Landscaping",
  "Law Firm",
  "Locksmith",
  "Logistics",
  "Massage Therapy",
  "Medical Spa",
  "Moving Company",
  "Painting",
  "Pest Control",
  "Pet Grooming",
  "Photography",
  "Physical Therapy",
  "Plumbing",
  "Pool Services",
  "Pressure Washing",
  "Real Estate",
  "Recruitment Agency",
  "Remodeling",
  "Restaurant",
  "Roofing",
  "Security Services",
  "Solar",
  "Tattoo Studio",
  "Tax Services",
  "Tree Services",
  "Veterinary",
  "Video Production",
  "Web Design",
  "Wedding Services",
  "Window Cleaning",
  "Yoga Studio",
  "Other"
];

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    businessName: "",
    industry: "",
  });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signInWithPassword(
      {
        email: form.email,
        password: form.password,
      }
    );

    localStorage.setItem(
      "synaptireach_signup",
      JSON.stringify(form)
    );

    router.push("/onboarding");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20 overflow-hidden relative">

      <div className="absolute inset-0">

        <div className="absolute top-[-150px] left-[-150px] w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full bg-green-500/20 blur-3xl" />

      </div>

      <div className="relative z-10 w-full max-w-2xl">

        <div className="text-center mb-10">

          <h1 className="text-5xl sm:text-6xl font-black leading-tight">

            Build Your{" "}

            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              AI CRM Empire
            </span>

          </h1>

          <p className="text-gray-400 mt-5 text-lg">
            Create a real AI-powered CRM system
            customized for your business,
            revenue goals, and customer lifecycle.
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              placeholder="Business Name"
              value={form.businessName}
              onChange={(e) =>
                setForm({
                  ...form,
                  businessName:
                    e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10"
            />

            <select
              value={form.industry}
              onChange={(e) =>
                setForm({
                  ...form,
                  industry:
                    e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10"
            >
              <option value="">
                Select Industry
              </option>

              {INDUSTRIES.map(
                (industry) => (
                  <option
                    key={industry}
                    value={industry}
                  >
                    {industry}
                  </option>
                )
              )}

            </select>

            <input
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10"
            />

            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
              className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black text-xl"
            >
              {loading
                ? "Creating Workspace..."
                : "Start Building"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}

```

## .\app\(marketing)\trial\page.tsx

```
"use client";

import { useState } from "react";
import Link from "next/link";
import { COMMITMENT_DISCOUNTS, TRIAL_PLANS } from "@/lib/billing/plans";
import Footer from "@/components/sections/Footer";

export default function TrialPage() {
  const [mode, setMode] = useState<"managed" | "byok">("managed");

  return (
    <main className="min-h-screen px-5 py-16 text-white">
      <section className="mx-auto max-w-6xl text-center">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-200">
          14-DAY FREE TRIAL
        </div>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">
          Start SynaptiReach With
          <span className="block bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
            Hard-Capped Trial Access
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-cyan-50/70">
          Start a 14-day free trial with safe usage caps. No overages. Upgrade is required to continue after limits or after 14 days.
        </p>
      </section>

      <section className="mx-auto mt-10 flex max-w-6xl justify-center gap-3">
        <button onClick={() => setMode("managed")} className={`rounded-2xl px-5 py-3 font-bold ${mode === "managed" ? "bg-gradient-to-r from-cyan-300 to-green-300 text-black" : "border border-cyan-400/15 bg-cyan-400/5 text-cyan-100"}`}>
          SynaptiReach Managed Trial
        </button>
        <button onClick={() => setMode("byok")} className={`rounded-2xl px-5 py-3 font-bold ${mode === "byok" ? "bg-gradient-to-r from-cyan-300 to-green-300 text-black" : "border border-cyan-400/15 bg-cyan-400/5 text-cyan-100"}`}>
          BYOK Trial
        </button>
      </section>

      {mode === "managed" ? (
        <section className="mx-auto mt-12 max-w-6xl">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-black">Managed Trial Caps</h2>
            <p className="mt-2 text-cyan-50/65">
              No managed SMS during free trial unless you connect your own Twilio/BYOK provider. Trial caps are hard caps.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {TRIAL_PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-6 backdrop-blur ${plan.popular ? "border-cyan-300/50" : ""}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-300 to-green-300 px-4 py-1 text-xs font-black text-black">POPULAR PREVIEW</div>}
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <dl className="mt-5 space-y-3 text-sm text-cyan-50/75">
                  <div className="flex justify-between gap-4"><dt>AI actions</dt><dd className="font-bold text-white">{plan.aiActions}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Emails</dt><dd className="font-bold text-white">{plan.emails}</dd></div>
                  <div className="flex justify-between gap-4"><dt>SMS</dt><dd className="font-bold text-white">{plan.sms}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Contacts</dt><dd className="font-bold text-white">{plan.contacts}</dd></div>
                  <div className="flex justify-between gap-4"><dt>AI agents</dt><dd className="font-bold text-white">{plan.agents}</dd></div>
                </dl>
                <Link href={plan.available ? "/signup" : "/contact"} className="mt-6 block rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-5 py-3 text-center font-black text-black">
                  {plan.available ? "Start 14-Day Trial" : "Contact Sales Approval"}
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto mt-12 max-w-4xl rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-8 text-center backdrop-blur">
          <h2 className="text-3xl font-black">BYOK 14-Day Trial</h2>
          <p className="mt-4 text-cyan-50/70">
            Use SynaptiReach for 14 days while connecting your own AI, email, and SMS provider keys. You pay your own provider/API usage.
            SynaptiReach does not expose managed SMS, AI, or email cost during BYOK trial.
          </p>
          <p className="mt-4 text-sm font-bold text-green-200">No overages. Hard caps. Upgrade required after limits or after 14 days.</p>
          <Link href="/signup" className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-cyan-300 to-green-300 px-7 py-3 font-black text-black">
            Start 14-Day Trial
          </Link>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-5xl rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-8">
        <h2 className="text-2xl font-black">Commit before your trial ends and save up to 30%.</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          {COMMITMENT_DISCOUNTS.map((item) => (
            <div key={item.duration} className="rounded-2xl border border-cyan-400/15 bg-black/25 p-4 text-center">
              <div className="text-sm text-cyan-50/65">{item.duration}</div>
              <div className="mt-2 text-3xl font-black text-cyan-200">{item.discount}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl space-y-4 rounded-3xl border border-cyan-400/15 bg-slate-950/70 p-8 text-sm text-cyan-50/75">
        <h2 className="text-2xl font-black text-white">Trial FAQ</h2>
        <p><strong className="text-white">How long is the free trial?</strong> The free trial lasts 14 days.</p>
        <p><strong className="text-white">Can I use managed SMS?</strong> No managed SMS is included during free trial unless you connect your own Twilio/BYOK provider.</p>
        <p><strong className="text-white">Are overages allowed?</strong> No. Trial caps are hard caps.</p>
        <p><strong className="text-white">What happens at the end?</strong> Upgrade is required to continue after limits or after 14 days.</p>
      </section>

      <Footer />
    </main>
  );
}

```

## .\app\admin\dashboard\staff\page.tsx

```
export {};
export default function StaffPage() {
  return <h2>Staff Panel</h2>;
}

```

## .\app\api\billing\portal\route.ts

```
import { NextResponse } from "next/server";
import { createBillingPortalSession, createStripeCustomer, getStripeBillingStatus } from "@/lib/billing/stripe";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const stripe = getStripeBillingStatus();
    if (!stripe.configured) {
      return NextResponse.json({
        success: false,
        setupRequired: true,
        error: "Stripe is not configured. Add STRIPE_SECRET_KEY and redeploy before opening the Billing Portal.",
      });
    }

    const context = await getWorkspaceContext(request);
    const supabase = createSupabaseAdmin();

    const { data: billing, error: billingError } = await applyWorkspaceScope(
      supabase.from("crm_billing_accounts").select("*"),
      context
    )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (billingError) throw billingError;

    const { data: settings, error: settingsError } = await applyWorkspaceScope(
      supabase.from("crm_settings").select("business_name,contact_email"),
      context
    )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (settingsError) throw settingsError;

    let customerId = billing?.stripe_customer_id || billing?.metadata?.stripe_customer_id || null;
    if (!customerId) {
      const customer = await createStripeCustomer({
        email: settings?.contact_email || null,
        name: settings?.business_name || null,
        workspaceId: context.workspaceId,
        companyId: context.companyId,
        userId: context.userId,
      });

      if (!customer.success || !customer.customerId) {
        return NextResponse.json({
          success: false,
          setupRequired: Boolean(customer.setupRequired),
          error: customer.error || "Could not create a Stripe customer for this workspace.",
        });
      }

      customerId = customer.customerId;
      if (billing?.id) {
        await supabase
          .from("crm_billing_accounts")
          .update({
            stripe_customer_id: customerId,
            metadata: {
              ...(billing.metadata || {}),
              stripe_customer_created_from: "billing_portal_route",
            },
          })
          .eq("id", billing.id);
      } else {
        await supabase.from("crm_billing_accounts").insert({
          workspace_id: context.workspaceId || null,
          company_id: context.companyId || null,
          user_id: context.userId || null,
          status: "setup_required",
          stripe_customer_id: customerId,
          metadata: {
            stripe_customer_created_from: "billing_portal_route",
          },
        });
      }
    }

    const portal = await createBillingPortalSession({
      customerId,
      origin: new URL(request.url).origin,
    });

    if (!portal.success || !portal.url) {
      return NextResponse.json({
        success: false,
        setupRequired: Boolean(portal.setupRequired),
        error: portal.error || "Could not create a Stripe Billing Portal session.",
      });
    }

    return NextResponse.json({
      success: true,
      url: portal.url,
      stripeMode: stripe.mode,
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

```

## .\app\api\billing\stripe\webhook\route.ts

```
import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { verifyStripeWebhookSignature } from "@/lib/billing/stripe";

const SELECTED_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.expired",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
  "payment_intent.requires_action",
  "customer.created",
  "customer.updated",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "charge.refunded",
  "charge.dispute.created",
]);

function duplicateEvent(error: any) {
  return error?.code === "23505" || /duplicate key/i.test(error?.message || "");
}

function objectMetadata(object: any) {
  return object?.metadata || object?.subscription_details?.metadata || {};
}

async function safeInsert(supabase: any, table: string, values: Record<string, any>) {
  await supabase.from(table).insert(values).then(() => undefined).catch(() => undefined);
}

async function findPurchase(supabase: any, object: any) {
  const metadata = objectMetadata(object);
  const purchaseId = metadata.purchase_id || object?.metadata?.purchase_id;
  const sessionId = object?.id;
  const paymentIntent = typeof object?.payment_intent === "string" ? object.payment_intent : object?.payment_intent?.id;

  if (purchaseId) {
    const { data } = await supabase
      .from("crm_credit_pack_purchases")
      .select("*")
      .eq("id", purchaseId)
      .maybeSingle();
    if (data) return data;
  }

  if (sessionId) {
    const { data } = await supabase
      .from("crm_credit_pack_purchases")
      .select("*")
      .eq("checkout_reference", sessionId)
      .maybeSingle();
    if (data) return data;
  }

  const { data: recent } = await supabase
    .from("crm_credit_pack_purchases")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(250);

  return (recent || []).find((item: any) => {
    const itemMetadata = item.metadata || {};
    return (
      itemMetadata.purchase_id === purchaseId ||
      itemMetadata.stripe_session_id === sessionId ||
      itemMetadata.stripe_payment_intent === paymentIntent
    );
  }) || null;
}

async function updatePurchaseFromStripe(supabase: any, purchase: any, status: string, object: any, event: any) {
  const metadata = {
    ...(purchase.metadata || {}),
    stripe_event_id: event.id,
    stripe_event_type: event.type,
    stripe_session_id: object?.object === "checkout.session" ? object.id : purchase.metadata?.stripe_session_id,
    stripe_payment_intent:
      typeof object?.payment_intent === "string" ? object.payment_intent : object?.payment_intent?.id || purchase.metadata?.stripe_payment_intent,
    stripe_payment_status: object?.payment_status || object?.status || null,
    stripe_customer: typeof object?.customer === "string" ? object.customer : object?.customer?.id || null,
    stripe_amount_total: object?.amount_total || object?.amount || null,
    stripe_currency: object?.currency || "usd",
    webhook_processed_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("crm_credit_pack_purchases")
    .update({
      status,
      checkout_reference: metadata.stripe_session_id || purchase.checkout_reference || null,
      metadata,
    })
    .eq("id", purchase.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function notifyBillingEvent(supabase: any, purchase: any, title: string, message: string, priority = "normal") {
  await safeInsert(supabase, "crm_notifications", {
    workspace_id: purchase?.workspace_id || null,
    company_id: purchase?.company_id || null,
    user_id: purchase?.user_id || null,
    title,
    message,
    type: "billing",
    priority,
    status: "unread",
    record_type: "crm_credit_pack_purchases",
    record_id: purchase?.id || null,
    href: "/dashboard/settings",
    metadata: {
      source: "stripe_webhook",
    },
  });
}

async function updateBillingAccountFromCustomerObject(supabase: any, object: any, event: any) {
  const customerId =
    typeof object?.customer === "string" ? object.customer : object?.customer?.id || (object?.object === "customer" ? object.id : null);
  if (!customerId) return null;

  const updates: Record<string, any> = {
    metadata: {
      stripe_last_event_id: event.id,
      stripe_last_event_type: event.type,
      stripe_last_event_at: new Date().toISOString(),
    },
  };

  if (object?.object === "subscription") {
    updates.stripe_subscription_id = object.id;
    updates.status = object.status || "subscription_event";
    updates.trial_ends_at = object.trial_end ? new Date(object.trial_end * 1000).toISOString() : undefined;
  }

  const { data } = await supabase
    .from("crm_billing_accounts")
    .update(updates)
    .eq("stripe_customer_id", customerId)
    .select()
    .limit(1);

  return data?.[0] || null;
}

export async function POST(request: Request) {
  const payload = await request.text();
  const verification = verifyStripeWebhookSignature(payload, request.headers.get("stripe-signature"));

  if (!verification.verified) {
    return NextResponse.json({ success: false, error: verification.error }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ success: false, error: "Invalid Stripe webhook payload." }, { status: 400 });
  }

  const object = event.data?.object || {};
  const metadata = objectMetadata(object);
  const supabase = createSupabaseAdmin();

  try {
    const { data: eventRow, error: eventError } = await supabase
      .from("crm_billing_events")
      .insert({
        workspace_id: metadata.workspace_id || null,
        company_id: metadata.company_id || null,
        user_id: metadata.user_id || null,
        stripe_event_id: event.id,
        event_type: event.type,
        status: SELECTED_EVENTS.has(event.type) ? "received" : "ignored",
        resource_type: object.object || null,
        resource_id: object.id || null,
        metadata: {
          source: "stripe_snapshot_webhook",
          livemode: Boolean(event.livemode),
          selected_event: SELECTED_EVENTS.has(event.type),
          stripe_object_status: object.status || object.payment_status || null,
        },
      })
      .select()
      .single();

    if (eventError) {
      if (duplicateEvent(eventError)) return NextResponse.json({ success: true, duplicate: true });
      throw eventError;
    }

    if (!SELECTED_EVENTS.has(event.type)) {
      return NextResponse.json({ success: true, ignored: true, event: eventRow });
    }

    let purchase: any = null;
    let processedStatus = "processed";

    if (event.type === "checkout.session.completed") {
      purchase = await findPurchase(supabase, object);
      if (purchase) {
        const updated = await updatePurchaseFromStripe(supabase, purchase, "paid", object, event);
        await notifyBillingEvent(supabase, updated, "Credit pack payment completed", `${updated.pack_type} is paid and ready for credit fulfillment.`, "high");
        purchase = updated;
      }
    } else if (event.type === "checkout.session.expired") {
      purchase = await findPurchase(supabase, object);
      if (purchase) {
        const updated = await updatePurchaseFromStripe(supabase, purchase, "expired", object, event);
        await notifyBillingEvent(supabase, updated, "Credit pack checkout expired", `${updated.pack_type} checkout expired before payment.`, "normal");
        purchase = updated;
      }
    } else if (event.type.startsWith("payment_intent.")) {
      purchase = await findPurchase(supabase, object);
      if (purchase) {
        const statusByType: Record<string, string> = {
          "payment_intent.succeeded": "paid",
          "payment_intent.payment_failed": "payment_failed",
          "payment_intent.canceled": "cancelled",
          "payment_intent.requires_action": "requires_action",
        };
        const updated = await updatePurchaseFromStripe(supabase, purchase, statusByType[event.type] || "payment_review", object, event);
        await notifyBillingEvent(
          supabase,
          updated,
          event.type === "payment_intent.succeeded" ? "Payment succeeded" : "Payment needs review",
          `${updated.pack_type} payment status: ${statusByType[event.type] || "payment_review"}.`,
          event.type === "payment_intent.succeeded" ? "high" : "normal"
        );
        purchase = updated;
      }
    } else if (event.type.startsWith("customer.") || event.type.startsWith("customer.subscription.") || event.type.startsWith("invoice.")) {
      await updateBillingAccountFromCustomerObject(supabase, object, event);
    } else if (event.type === "charge.refunded" || event.type === "charge.dispute.created") {
      await safeInsert(supabase, "crm_notifications", {
        workspace_id: metadata.workspace_id || null,
        company_id: metadata.company_id || null,
        user_id: metadata.user_id || null,
        title: event.type === "charge.refunded" ? "Stripe charge refunded" : "Stripe dispute created",
        message: "Review this Stripe billing event in the Stripe Dashboard.",
        type: "billing",
        priority: event.type === "charge.dispute.created" ? "high" : "normal",
        status: "unread",
        href: "/dashboard/settings",
        metadata: {
          source: "stripe_webhook",
          stripe_event_id: event.id,
          stripe_object_id: object.id || null,
        },
      });
    }

    if (!purchase && ["checkout.session.completed", "checkout.session.expired"].includes(event.type)) {
      processedStatus = "processed_no_matching_purchase";
    }

    await supabase
      .from("crm_billing_events")
      .update({
        status: processedStatus,
        workspace_id: purchase?.workspace_id || metadata.workspace_id || null,
        company_id: purchase?.company_id || metadata.company_id || null,
        user_id: purchase?.user_id || metadata.user_id || null,
        metadata: {
          ...(eventRow.metadata || {}),
          processed_at: new Date().toISOString(),
          purchase_id: purchase?.id || metadata.purchase_id || null,
        },
      })
      .eq("id", eventRow.id);

    await safeInsert(supabase, "crm_audit_logs", {
      workspace_id: purchase?.workspace_id || metadata.workspace_id || null,
      company_id: purchase?.company_id || metadata.company_id || null,
      user_id: purchase?.user_id || metadata.user_id || null,
      action: "stripe_webhook_processed",
      resource_type: "crm_billing_events",
      resource_id: eventRow.id,
      details: {
        stripe_event_id: event.id,
        event_type: event.type,
        purchase_id: purchase?.id || null,
      },
    });

    return NextResponse.json({ success: true, event_id: event.id, status: processedStatus });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

```

## .\app\api\crm\leads\import\route.ts

```
import { NextResponse } from "next/server";
import { importLeadRows } from "@/lib/crm/importLeadsCsv";
import { friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No CSV rows provided." },
        { status: 400 }
      );
    }

    if (rows.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Import is limited to 5,000 rows at a time." },
        { status: 400 }
      );
    }

    const result = await importLeadRows(rows, body.workspace_id || body.workspaceId || null);

    return NextResponse.json({
      success: true,
      imported_count: result.imported_count,
      skipped_count: result.skipped_count,
      duplicate_count: result.duplicate_count,
      total_rows: result.total_rows,
      valid_rows: result.valid_rows,
      errors: result.errors,
      leads: result.imported.slice(0, 100),
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);

    return NextResponse.json(
      {
        success: false,
        error: friendly.message || "Failed to import leads.",
        missingSchema: friendly.missingSchema,
      },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

```

## .\app\api\crm\staff\route.ts

```
import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { CRM_PERMISSIONS } from "@/lib/security/permissions";
import { getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

function normalizeStaff(body: any) {
  return {
    workspace_id: body.workspace_id || body.workspaceId || null,
    company_id: body.company_id || body.companyId || null,
    user_id: body.user_id || body.userId || null,
    role_id: body.role_id || body.roleId || null,
    name: body.name || null,
    email: body.email || null,
    phone: body.phone || null,
    title: body.title || null,
    status: body.status || "invited",
    metadata: body.metadata || {},
  };
}

async function savePermissions(supabase: any, staffId: string, permissions: string[], workspaceId?: string | null, companyId?: string | null) {
  const validPermissions = permissions.filter((permission) => (CRM_PERMISSIONS as readonly string[]).includes(permission));
  await supabase.from("crm_staff_permissions").update({ granted: false }).eq("staff_id", staffId);
  if (validPermissions.length === 0) return [];

  const { data, error } = await supabase
    .from("crm_staff_permissions")
    .insert(
      validPermissions.map((permission) => ({
        workspace_id: workspaceId || null,
        company_id: companyId || null,
        staff_id: staffId,
        permission,
        granted: true,
      }))
    )
    .select();

  if (error) throw error;
  return data || [];
}

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const context = await getWorkspaceContext(request);
    const { data, error } = await supabase
      .from("crm_staff")
      .select("*")
      .neq("status", "archived")
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const staffIds = (data || []).map((member: any) => member.id);
    const { data: permissionRows } = staffIds.length
      ? await supabase.from("crm_staff_permissions").select("*").in("staff_id", staffIds).eq("granted", true)
      : { data: [] };

    const staff = (data || []).map((member: any) => ({
      ...member,
      permissions: (permissionRows || [])
        .filter((permission: any) => permission.staff_id === member.id)
        .map((permission: any) => permission.permission),
    }));

    return NextResponse.json({ success: true, staff, data: staff, permissions: CRM_PERMISSIONS });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const context = await getWorkspaceContext(req);
    const staff = normalizeStaff(body);
    staff.workspace_id = staff.workspace_id || context.workspaceId || null;
    staff.company_id = staff.company_id || context.companyId || null;

    if (!staff.name && !staff.email) {
      return NextResponse.json({ success: false, error: "Staff name or email is required." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("crm_staff").insert(staff).select().single();
    if (error) throw error;

    const permissions = await savePermissions(supabase, data.id, body.permissions || [], data.workspace_id, data.company_id);

    await supabase.from("crm_audit_logs").insert({
      workspace_id: data.workspace_id || null,
      company_id: data.company_id || null,
      action: "staff_created",
      resource_type: "crm_staff",
      resource_id: data.id,
      details: "Staff member created from settings.",
      metadata: { source: "settings_page" },
    });

    return NextResponse.json({ success: true, staff: { ...data, permissions: permissions.map((item: any) => item.permission) } });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const context = await getWorkspaceContext(req);
    if (!body.id) return NextResponse.json({ success: false, error: "Missing staff id." }, { status: 400 });

    const supabase = createSupabaseAdmin();
    const values = normalizeStaff(body);
    delete (values as any).workspace_id;
    delete (values as any).company_id;

    const { data, error } = await supabase
      .from("crm_staff")
      .update(values)
      .eq("id", body.id)
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .select()
      .single();
    if (error) throw error;

    const permissions = Array.isArray(body.permissions)
      ? await savePermissions(supabase, data.id, body.permissions, data.workspace_id, data.company_id)
      : [];

    await supabase.from("crm_audit_logs").insert({
      workspace_id: data.workspace_id || null,
      company_id: data.company_id || null,
      action: "staff_updated",
      resource_type: "crm_staff",
      resource_id: data.id,
      details: "Staff member updated from settings.",
      metadata: { source: "settings_page", permissions_updated: Array.isArray(body.permissions) },
    });

    return NextResponse.json({
      success: true,
      staff: {
        ...data,
        permissions: Array.isArray(body.permissions) ? permissions.map((item: any) => item.permission) : body.permissions,
      },
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

```

## .\app\api\onboarding\complete\route.ts

```
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildWorkspaceIntelligence, generateGeminiInsights } from "@/lib/ai/workspace-intelligence";
import { bootstrapWorkspace } from "@/lib/workspace/bootstrapWorkspace";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ success: false, error: "Missing authorization" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const intelligence = buildWorkspaceIntelligence({
      businessName: body.businessName,
      industry: body.industry,
      monthlyRevenue: body.monthlyRevenue,
      yearlyRevenue: body.yearlyRevenue,
      monthlyProfit: body.monthlyProfit,
      yearlyProfit: body.yearlyProfit,
      customerLTV: body.customerLTV,
      roiTarget: body.roiTarget,
      responseTime: body.responseTime,
      peakMonths: body.peakMonths,
      slowMonths: body.slowMonths,
      aiPersonality: body.aiPersonality,
      products: body.products,
      promotedProducts: body.promotedProducts,
      integrations: body.integrations || [],
      uploadedFiles: body.uploadedFiles || [],
      csvFile: body.csvFile || null,
      geminiKey: body.geminiKey,
    });

    const geminiAnalysis = await generateGeminiInsights(
      body.businessName,
      body.industry,
      body.products,
      body.roiTarget,
      body.geminiKey
    );

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .insert({
        owner_id: user.id,
        name: body.businessName,
        industry: body.industry,
        onboarding_data: body,
        intelligence,
        gemini_analysis: geminiAnalysis,
        monthly_revenue: body.monthlyRevenue || 0,
        yearly_revenue: body.yearlyRevenue || 0,
        customer_ltv: body.customerLTV || 0,
        roi_target: body.roiTarget || "0",
        uploaded_knowledge_count: (body.uploadedFiles || []).length,
        csv_imported: Boolean(body.csvFile),
        integrations: body.integrations || [],
      })
      .select()
      .single();

    if (workspaceError) {
      console.error(workspaceError);
      return NextResponse.json({ success: false, error: workspaceError.message }, { status: 500 });
    }

    if (workspace) {
      await bootstrapWorkspace(workspace);
    }

    return NextResponse.json({ success: true, workspace, redirect: "/dashboard" });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

```

## .\app\api\onboarding\integrations\route.ts

```
export {};
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    success: true,
    integrations: body,
  });
}

```

## .\app\api\onboarding\save\route.ts

```
export {};
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("ONBOARDING SAVE:", body);

  return NextResponse.json({
    success: true,
  });
}

```

## .\app\api\onboarding\upload\route.ts

```
export {};
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    url: "/uploads/mock-file.pdf",
  });
}

```

## .\app\api\stripe\webhook\route.ts

```
export { POST } from "@/app/api/billing/stripe/webhook/route";

```

## .\app\lib\workspace-store.ts

```
export {};
type Workspace = {
  id: string;
  scenario: string;
  createdAt: number;
  state: any;
};

const workspaces = new Map<string, Workspace>();

export function createWorkspace(id: string, scenario: string) {
  const ws = {
    id,
    scenario,
    createdAt: Date.now(),
    state: {
      revenue: 10000,
      users: 10,
      churn: 1.2,
      growth: 3,
    },
  };

  workspaces.set(id, ws);
  return ws;
}

export function getWorkspaces(id: string) {
  return workspaces.get(id);
}

export function updateWorkspace(id: string, patch: any) {
  const ws = workspaces.get(id);
  if (!ws) return;

  ws.state = { ...ws.state, ...patch };
}

```

## .\app\onboarding\auth-check.ts

```
export {};
import { supabase } from "@/lib/supabase/client";

export async function requireSession() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

```

## .\app\onboarding\page.tsx

```
export {};
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const INDUSTRIES = [
  "Accounting","Advertising Agency","Appliance Repair","Architecture",
  "Auto Detailing","Automotive Repair","Bakery","Barbershop","Beauty Salon",
  "Bookkeeping","Business Consulting","Car Wash","Carpet Cleaning","Catering",
  "Chiropractic","Cleaning Services","Construction","Contractor","Dental",
  "Digital Marketing","Electrician","Event Planning","Financial Services",
  "Fitness Gym","Flooring","Food Truck","Graphic Design","HVAC",
  "Home Inspection","Home Security","Insurance","Interior Design","IT Services",
  "Junk Removal","Landscaping","Law Firm","Locksmith","Logistics",
  "Massage Therapy","Medical Spa","Moving Company","Painting","Pest Control",
  "Pet Grooming","Photography","Physical Therapy","Plumbing","Pool Services",
  "Pressure Washing","Real Estate","Recruitment Agency","Remodeling","Restaurant",
  "Roofing","Security Services","Solar","Tattoo Studio","Tax Services",
  "Tree Services","Veterinary","Video Production","Web Design","Wedding Services",
  "Window Cleaning","Yoga Studio","Other"
];

const INTEGRATIONS = [
  "Google Calendar","Google Contacts","Stripe","QuickBooks","Zapier",
  "Slack","Twilio SMS","Mailchimp","HubSpot","Salesforce","Facebook Ads",
  "Google Ads","Instagram","WhatsApp Business","Shopify","WooCommerce",
  "Square","PayPal","DocuSign","Calendly"
];

const SERVICES_LIST = [
  "AI Lead Follow-Up","SMS Campaigns","Email Campaigns","Auto-Scheduling",
  "Pipeline Management","Revenue Forecasting","Customer Segmentation",
  "Reputation Management","Review Automation","Quote Generation",
  "Invoice Automation","Appointment Reminders","Missed Call Text-Back",
  "Abandoned Lead Recovery","Monthly ROI Reports"
];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

type FormState = {
  plan: string;
  trialChoice: string;
  twilioAuthorization: string;
  businessName: string;
  address: string;
  employees: string;
  industry: string;
  monthlyRevenue: string;
  monthlyProfit: string;
  yearlyRevenue: string;
  yearlyProfit: string;
  customerLTV: string;
  roiTarget: string;
  peakMonths: string[];
  slowMonths: string[];
  responseTime: string;
  aiPersonality: string;
  logo: File | null;
  products: string;
  promotedProducts: string;
  apiStrategy: string;
  openaiKey: string;
  claudeKey: string;
  geminiKey: string;
  integrations: string[];
  adBudget: string;
  services: string[];
  uploadedFiles: File[];
  csvFile: File | null;
};

const initialForm: FormState = {
  plan: "",
  trialChoice: "keep_trial",
  twilioAuthorization: "",
  businessName: "",
  address: "",
  employees: "",
  industry: "",
  monthlyRevenue: "",
  monthlyProfit: "",
  yearlyRevenue: "",
  yearlyProfit: "",
  customerLTV: "",
  roiTarget: "",
  peakMonths: [],
  slowMonths: [],
  responseTime: "",
  aiPersonality: "",
  logo: null,
  products: "",
  promotedProducts: "",
  apiStrategy: "",
  openaiKey: "",
  claudeKey: "",
  geminiKey: "",
  integrations: [],
  adBudget: "",
  services: [],
  uploadedFiles: [],
  csvFile: null,
};

const STEP_TITLES: Record<number, string> = {
  1: "Plan & Authorization",
  2: "Business Intelligence",
  3: "Aura & AI Personality",
  4: "Revenue & Growth Data",
  5: "Services & Integrations",
  6: "AI Engine Setup",
  7: "Review & Build",
};

const progressMap: Record<number, number> = {
  1: 14, 2: 28, 3: 42, 4: 57, 5: 71, 6: 85, 7: 100,
};

function InputField({
  label, value, onChange, placeholder = "", type = "text", required = false
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block mb-2 text-sm font-bold text-gray-300">
        {label}{required && <span className="text-cyan-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/60 transition-colors"
      />
    </div>
  );
}

function MonthToggle({
  label, selected, onChange
}: { label: string; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (m: string) =>
    onChange(selected.includes(m) ? selected.filter((x) => x !== m) : [...selected, m]);
  return (
    <div>
      <label className="block mb-3 text-sm font-bold text-gray-300">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {MONTHS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => toggle(m)}
            className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
              selected.includes(m)
                ? "bg-gradient-to-r from-cyan-400 to-green-400 text-black"
                : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            {m.slice(0, 3)}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckGrid({
  label, items, selected, onChange
}: { label: string; items: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (item: string) =>
    onChange(selected.includes(item) ? selected.filter((x) => x !== item) : [...selected, item]);
  return (
    <div>
      <label className="block mb-3 text-sm font-bold text-gray-300">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => toggle(item)}
            className={`py-2 px-3 rounded-xl text-sm font-medium text-left transition-all ${
              selected.includes(item)
                ? "bg-cyan-400/15 border border-cyan-400/60 text-cyan-300"
                : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            {selected.includes(item) && <span className="mr-1 text-cyan-400">âœ“</span>}
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [industrySearch, setIndustrySearch] = useState("");
  const [industryOpen, setIndustryOpen] = useState(false);
  const industryRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) router.push("/signup");
    });
  }, [router]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (industryRef.current && !industryRef.current.contains(e.target as Node)) {
        setIndustryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const progress = progressMap[step];

  function set(field: keyof FormState, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const errs = { ...prev }; delete errs[field]; return errs; });
  }

  function validateStep(): boolean {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.plan) errs.plan = "Please select a plan.";
      if (!form.twilioAuthorization.trim()) errs.twilioAuthorization = "Authorization required.";
    }
    if (step === 2) {
      if (!form.businessName.trim()) errs.businessName = "Business name is required.";
      if (!form.industry) errs.industry = "Please select an industry.";
    }
    if (step === 3) {
      if (!form.aiPersonality) errs.aiPersonality = "Please select an AI personality.";
    }
    if (step === 4) {
      if (!form.monthlyRevenue.trim()) errs.monthlyRevenue = "Monthly revenue is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep()) setStep((s) => Math.min(s + 1, 7));
  }
  function back() { setStep((s) => Math.max(s - 1, 1)); }

  async function buildWorkspace() {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { alert("Unauthorized"); setLoading(false); return; }

      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...form,
          uploadedFiles: form.uploadedFiles.map((f) => f.name),
          csvFile: form.csvFile?.name || null,
          logo: form.logo?.name || null,
        }),
      });

      const data = await res.json();
      if (!data.success) { alert(data.error || "Build failed. Please try again."); setLoading(false); return; }
      router.push(data.redirect || "/dashboard");
    } catch {
      alert("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  const filteredIndustries = INDUSTRIES.filter((i) =>
    i.toLowerCase().includes(industrySearch.toLowerCase())
  );

  function personalityCard(
    value: string, title: string, desc: string, quote: string
  ) {
    const selected = form.aiPersonality === value;
    return (
      <div
        key={value}
        className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
          selected ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/10" : "border-white/10 hover:border-white/20"
        }`}
        onClick={() => set("aiPersonality", value)}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-black">{title}</h3>
          {selected && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-black text-xs font-black">âœ“</div>
          )}
        </div>
        <p className="text-gray-400 mt-2 text-sm">{desc}</p>
        <p className="text-cyan-400 mt-3 text-sm italic border-l-2 border-cyan-400/40 pl-3">{quote}</p>
      </div>
    );
  }

  function ReviewRow({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex justify-between py-2 border-b border-white/5">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-white text-sm font-medium text-right max-w-xs truncate">{value || "â€”"}</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-12">
      {loading && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin mb-6" />
          <p className="text-xl font-black text-cyan-400">Building Your Workspace</p>
          <p className="text-gray-500 mt-2 text-sm">Initializing AI core systemsâ€¦</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight">SynaptiReach Core Architect</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Step {step} of 7 â€” {STEP_TITLES[step]}
              </p>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 text-3xl font-black">{progress}%</div>
            </div>
          </div>

          <div className="flex gap-1.5 mb-3">
            {[1,2,3,4,5,6,7].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  s < step ? "bg-green-400" : s === step ? "bg-cyan-400" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black">Plan & Authorization</h2>

              <div>
                <label className="block mb-3 text-sm font-bold text-gray-300">
                  Select Your Plan <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "basic_managed", name: "Basic Managed", price: "$49/mo", desc: "500 contacts, 3,000 AI actions, 1 lightweight AI agent" },
                    { id: "growth_managed", name: "Growth Managed", price: "$99/mo", desc: "2,500 contacts, 12,000 AI actions, 3 AI agents" },
                    { id: "premium_managed", name: "Premium Managed", price: "$199/mo", desc: "10,000 contacts, 40,000 AI actions, 8 AI agents" },
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => set("plan", plan.id)}
                      className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                        form.plan === plan.id
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-black">{plan.name}</span>
                          <p className="text-gray-400 text-sm mt-0.5">{plan.desc}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-cyan-400 font-black">{plan.price}</span>
                          {form.plan === plan.id && (
                            <div className="text-green-400 text-xs mt-1">Selected</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.plan && <p className="text-red-400 text-xs mt-2">{errors.plan}</p>}
              </div>

              <div>
                <label className="block mb-3 text-sm font-bold text-gray-300">Trial Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "keep_trial", label: "Start 14-Day Trial" },
                    { id: "skip_trial", label: "Skip Trial & Activate" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set("trialChoice", opt.id)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all ${
                        form.trialChoice === opt.id
                          ? "bg-gradient-to-r from-cyan-400 to-green-400 text-black"
                          : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-300">
                  Twilio A2P Authorization Acknowledgment <span className="text-cyan-400">*</span>
                </label>
                <div className="rounded-2xl bg-black/40 border border-white/10 p-4 mb-3 text-xs text-gray-400 leading-relaxed">
                  By proceeding, you confirm you are authorized to send SMS/MMS messages to your contacts under A2P 10DLC compliance standards. You agree to maintain opt-in records and honor all opt-out requests immediately. Misuse is a violation of TCPA and Twilio's Acceptable Use Policy.
                </div>
                <input
                  type="text"
                  value={form.twilioAuthorization}
                  onChange={(e) => set("twilioAuthorization", e.target.value)}
                  placeholder='Type "I AUTHORIZE" to confirm'
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/60 transition-colors"
                />
                {errors.twilioAuthorization && (
                  <p className="text-red-400 text-xs mt-1">{errors.twilioAuthorization}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black">Business Intelligence</h2>

              <InputField
                label="Business Name" value={form.businessName}
                onChange={(v) => set("businessName", v)}
                placeholder="Acme Services LLC" required
              />
              {errors.businessName && <p className="text-red-400 text-xs -mt-3">{errors.businessName}</p>}

              <InputField
                label="Business Address" value={form.address}
                onChange={(v) => set("address", v)}
                placeholder="123 Main St, City, State ZIP"
              />

              <InputField
                label="Number of Employees" value={form.employees}
                onChange={(v) => set("employees", v)}
                placeholder="e.g. 5" type="number"
              />

              <div ref={industryRef}>
                <label className="block mb-2 text-sm font-bold text-gray-300">
                  Industry <span className="text-cyan-400">*</span>
                </label>
                <div
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white cursor-pointer flex justify-between items-center"
                  onClick={() => setIndustryOpen(!industryOpen)}
                >
                  <span className={form.industry ? "text-white" : "text-gray-600"}>
                    {form.industry || "Select your industry"}
                  </span>
                  <span className="text-gray-500">{industryOpen ? "â–²" : "â–¼"}</span>
                </div>
                {industryOpen && (
                  <div className="absolute z-20 mt-1 w-full max-w-2xl rounded-2xl border border-white/10 bg-black/95 shadow-2xl overflow-hidden">
                    <div className="p-2 border-b border-white/10">
                      <input
                        autoFocus
                        type="text"
                        value={industrySearch}
                        onChange={(e) => setIndustrySearch(e.target.value)}
                        placeholder="Search industriesâ€¦"
                        className="w-full p-2 bg-white/5 rounded-lg text-white text-sm placeholder-gray-600 outline-none"
                      />
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {filteredIndustries.map((ind) => (
                        <div
                          key={ind}
                          onClick={() => { set("industry", ind); setIndustryOpen(false); setIndustrySearch(""); }}
                          className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                            form.industry === ind
                              ? "bg-cyan-400/15 text-cyan-300"
                              : "text-gray-300 hover:bg-white/5"
                          }`}
                        >
                          {ind}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {errors.industry && <p className="text-red-400 text-xs mt-1">{errors.industry}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-300">Products & Services Offered</label>
                <textarea
                  value={form.products}
                  onChange={(e) => set("products", e.target.value)}
                  placeholder="Describe what your business offersâ€¦"
                  rows={3}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/60 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-300">Top Promoted Products / Services</label>
                <textarea
                  value={form.promotedProducts}
                  onChange={(e) => set("promotedProducts", e.target.value)}
                  placeholder="What do you most actively sell or upsell?"
                  rows={2}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/60 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-300">Upload Business Logo (optional)</label>
                <label className="flex items-center gap-3 w-full p-3 rounded-xl bg-black/60 border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
                  <span className="text-cyan-400 text-lg">ðŸ“</span>
                  <span className="text-sm text-gray-400">
                    {form.logo ? form.logo.name : "Click to upload image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => set("logo", e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black">Aura & AI Personality</h2>
              <p className="text-gray-400 text-sm">
                Your AI personality defines how SynaptiReach communicates with leads and customers on your behalf.
              </p>

              <div className="space-y-3">
                {[
                  {
                    value: "executive", title: "Apex Commander",
                    desc: "Strategic executive AI focused on metrics, performance, and operational efficiency.",
                    quote: '"Data indicates a 14% conversion gap in your Q2 funnel. Initiating recovery sequence."'
                  },
                  {
                    value: "hustler", title: "Revenue Titan",
                    desc: "Fast-paced growth AI optimized for aggressive follow-up and revenue acceleration.",
                    quote: '"Fresh leads hitting the deck. Let\'s get these deals closed and revenue moving."'
                  },
                  {
                    value: "specialist", title: "Precision Operator",
                    desc: "Analytical AI focused on technical optimization, segmentation, and workflow precision.",
                    quote: '"Lead metadata analyzed. Deploying targeted follow-up campaign on schedule."'
                  },
                  {
                    value: "advisor", title: "Trusted Advisor",
                    desc: "Warm, consultative AI that builds relationships and guides customers with empathy.",
                    quote: '"I noticed you haven\'t heard back from us â€” I wanted to personally check in."'
                  },
                ].map(({ value, title, desc, quote }) => {
                  const selected = form.aiPersonality === value;
                  return (
                    <div
                      key={value}
                      className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
                        selected ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/10" : "border-white/10 hover:border-white/20"
                      }`}
                      onClick={() => set("aiPersonality", value)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-black">{title}</h3>
                        {selected && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-black text-xs font-black">âœ“</div>
                        )}
                      </div>
                      <p className="text-gray-400 mt-2 text-sm">{desc}</p>
                      <p className="text-cyan-400 mt-3 text-sm italic border-l-2 border-cyan-400/40 pl-3">{quote}</p>
                    </div>
                  );
                })}
              </div>

              {errors.aiPersonality && <p className="text-red-400 text-xs">{errors.aiPersonality}</p>}

              {form.aiPersonality && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-xs text-gray-500 mb-1">Active Personality</div>
                  <div className="text-lg font-black text-cyan-400 capitalize">{form.aiPersonality}</div>
                </div>
              )}

              <div>
                <label className="block mb-3 text-sm font-bold text-gray-300">Preferred Response Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Instant (<1 min)", "Quick (1â€“5 min)", "Thoughtful (5â€“15 min)"].map((rt) => (
                    <button
                      key={rt}
                      type="button"
                      onClick={() => set("responseTime", rt)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        form.responseTime === rt
                          ? "bg-gradient-to-r from-cyan-400 to-green-400 text-black"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black">Revenue & Growth Data</h2>
              <p className="text-gray-400 text-sm">
                This data trains your AI to generate accurate ROI forecasts and performance benchmarks.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Monthly Revenue" value={form.monthlyRevenue} onChange={(v) => set("monthlyRevenue", v)} placeholder="$0" required />
                <InputField label="Monthly Profit" value={form.monthlyProfit} onChange={(v) => set("monthlyProfit", v)} placeholder="$0" />
                <InputField label="Yearly Revenue" value={form.yearlyRevenue} onChange={(v) => set("yearlyRevenue", v)} placeholder="$0" />
                <InputField label="Yearly Profit" value={form.yearlyProfit} onChange={(v) => set("yearlyProfit", v)} placeholder="$0" />
                <InputField label="Avg Customer LTV" value={form.customerLTV} onChange={(v) => set("customerLTV", v)} placeholder="$0" />
                <InputField label="Monthly Ad Budget" value={form.adBudget} onChange={(v) => set("adBudget", v)} placeholder="$0" />
              </div>
              {errors.monthlyRevenue && <p className="text-red-400 text-xs">{errors.monthlyRevenue}</p>}

              <InputField label="ROI Target (%)" value={form.roiTarget} onChange={(v) => set("roiTarget", v)} placeholder="e.g. 300" type="number" />

              <MonthToggle label="Peak Business Months" selected={form.peakMonths} onChange={(v) => set("peakMonths", v)} />
              <MonthToggle label="Slow Business Months" selected={form.slowMonths} onChange={(v) => set("slowMonths", v)} />

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-300">Import Existing Contacts (CSV)</label>
                <label className="flex items-center gap-3 w-full p-3 rounded-xl bg-black/60 border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
                  <span className="text-cyan-400 text-lg">ðŸ“Š</span>
                  <span className="text-sm text-gray-400">{form.csvFile ? form.csvFile.name : "Click to upload CSV"}</span>
                  <input type="file" accept=".csv" className="hidden" onChange={(e) => set("csvFile", e.target.files?.[0] ?? null)} />
                </label>
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-300">Upload Supporting Documents (optional)</label>
                <label className="flex items-center gap-3 w-full p-3 rounded-xl bg-black/60 border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
                  <span className="text-cyan-400 text-lg">ðŸ“Ž</span>
                  <span className="text-sm text-gray-400">
                    {form.uploadedFiles.length > 0 ? `${form.uploadedFiles.length} file(s) selected` : "Click to upload files"}
                  </span>
                  <input type="file" multiple className="hidden" onChange={(e) => set("uploadedFiles", Array.from(e.target.files || []))} />
                </label>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black">Services & Integrations</h2>

              <CheckGrid label="AI Services to Activate" items={SERVICES_LIST} selected={form.services} onChange={(v) => set("services", v)} />
              <CheckGrid label="Platform Integrations" items={INTEGRATIONS} selected={form.integrations} onChange={(v) => set("integrations", v)} />

              <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-sm text-gray-400">
                <span className="text-cyan-400 font-bold">{form.services.length} services</span>{" "}
                and <span className="text-cyan-400 font-bold">{form.integrations.length} integrations</span> selected
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black">AI Engine Setup</h2>
              <p className="text-gray-400 text-sm">
                Configure your AI provider strategy. Use shared API or connect your own keys for dedicated capacity.
              </p>

              <div>
                <label className="block mb-3 text-sm font-bold text-gray-300">API Strategy</label>
                <div className="space-y-2">
                  {[
                    { id: "shared", label: "Shared API (Included)", desc: "Managed by SynaptiReach â€” no setup required" },
                    { id: "own_keys", label: "Your Own API Keys", desc: "Connect OpenAI, Claude, or Gemini keys for dedicated usage" },
                    { id: "hybrid", label: "Hybrid", desc: "Use your keys when available, fall back to shared" },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => set("apiStrategy", opt.id)}
                      className={`rounded-xl border p-4 cursor-pointer transition-all ${
                        form.apiStrategy === opt.id ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-bold text-sm">{opt.label}</span>
                        {form.apiStrategy === opt.id && <span className="text-cyan-400 text-sm">âœ“</span>}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {(form.apiStrategy === "own_keys" || form.apiStrategy === "hybrid") && (
                <div className="space-y-4 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-gray-400 mb-2">Keys are encrypted at rest and never exposed in the UI after saving.</p>
                  <InputField label="OpenAI API Key" value={form.openaiKey} onChange={(v) => set("openaiKey", v)} placeholder="sk-â€¦" type="password" />
                  <InputField label="Anthropic Claude Key" value={form.claudeKey} onChange={(v) => set("claudeKey", v)} placeholder="sk-ant-â€¦" type="password" />
                  <InputField label="Google Gemini Key" value={form.geminiKey} onChange={(v) => set("geminiKey", v)} placeholder="AIzaâ€¦" type="password" />
                </div>
              )}
            </div>
          )}

          {step === 7 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black">Review & Build</h2>
              <p className="text-gray-400 text-sm">Confirm your configuration before SynaptiReach initializes your workspace.</p>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-1">
                {[
                  ["Plan", form.plan],
                  ["Trial", form.trialChoice === "keep_trial" ? "14-Day Trial" : "Activate Now"],
                  ["Business", form.businessName],
                  ["Industry", form.industry],
                  ["Employees", form.employees],
                  ["AI Personality", form.aiPersonality],
                  ["Response Time", form.responseTime],
                  ["Monthly Revenue", form.monthlyRevenue],
                  ["ROI Target", form.roiTarget ? `${form.roiTarget}%` : ""],
                  ["Services", `${form.services.length} selected`],
                  ["Integrations", `${form.integrations.length} selected`],
                  ["API Strategy", form.apiStrategy],
                  ["Contacts CSV", form.csvFile?.name || "None"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium text-right max-w-xs truncate">{value || "â€”"}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-cyan-300">
                âš¡ Your workspace will be fully initialized with AI models trained on your business data. This typically takes 30â€“60 seconds.
              </div>

              <button
                type="button"
                onClick={buildWorkspace}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black text-lg transition-opacity disabled:opacity-50"
              >
                {loading ? "Buildingâ€¦" : "âš¡ Build My Workspace"}
              </button>
            </div>
          )}

        </div>

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 transition-colors"
            >
              â† Back
            </button>
          )}
          {step < 7 && (
            <button
              type="button"
              onClick={next}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black transition-opacity"
            >
              Continue â†’
            </button>
          )}
        </div>

      </div>
    </main>
  );
}

```

## .\app\onboarding\select\page.tsx

```
export {};
"use client";

import { useRouter } from "next/navigation";

export default function SelectIndustry() {
  const router = useRouter();

  const choose = (industry: string) => {
    localStorage.setItem("industry", industry);
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">
        What are you building?
      </h1>

      <button onClick={() => choose("AI SaaS")}>AI SaaS</button>
      <button onClick={() => choose("Agency")}>Agency</button>
      <button onClick={() => choose("Ecommerce")}>Ecommerce</button>
    </div>
  );
}

```

## .\app\portal-staff\layout.tsx

```
export {};
import PortalStaffSidebar from "./PortalStaffSidebar"
export default function ClientStaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-[52px]">
      <PortalStaffSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

```

## .\app\portal-staff\PortalStaffSidebar.tsx

```
export {};
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ListTodo, Users, MessageSquare } from "lucide-react"

const LINKS = [
  { label: "Dashboard", href: "/portal-staff/dashboard", icon: LayoutDashboard },
  { label: "Tasks",     href: "/portal-staff/tasks",     icon: ListTodo        },
  { label: "Leads",     href: "/portal-staff/leads",     icon: Users           },
  { label: "Messages",  href: "/portal-staff/messages",  icon: MessageSquare   },
]

export default function PortalStaffSidebar() {
  const pathname = usePathname()
  return (
    <div className="hidden md:flex w-60 flex-col shrink-0 h-[calc(100vh-52px)] sticky top-[52px]"
      style={{ background: "rgba(10,15,31,0.97)", borderRight: "1px solid rgba(0,188,212,0.15)" }}>
      <div className="px-5 py-4 border-b border-[rgba(0,188,212,0.12)]">
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md"
          style={{ background: "rgba(0,188,212,0.1)", color: "#00BCD4" }}>
          Team Portal
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {LINKS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: active ? "rgba(0,188,212,0.1)" : "transparent",
                color: active ? "#00BCD4" : "rgba(178,235,242,0.65)",
                borderLeft: active ? "2px solid #00BCD4" : "2px solid transparent",
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-[rgba(0,188,212,0.1)]">
        <p className="text-xs text-white/30">Client Team Member</p>
      </div>
    </div>
  )
}

```

## .\app\portal-staff\dashboard\page.tsx

```
export {};
export default function ClientStaffDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Team Dashboard</h1>
        <p className="text-sm text-[#B2EBF2]/60 mt-1">Your assigned work for today.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Tasks Assigned", value: "6"  },
          { label: "Leads to Action",value: "11" },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,188,212,0.13)" }}>
            <span className="text-xs text-[#B2EBF2]/60 uppercase tracking-wider">{s.label}</span>
            <span className="text-2xl font-extrabold text-white">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,188,212,0.13)" }}>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Today&apos;s Tasks</h2>
        <p className="text-sm text-[#B2EBF2]/50">No tasks assigned yet.</p>
      </div>
    </div>
  )
}

```

## .\app\providers\AuthProvider.tsx

```
export {};
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

```

## .\app\staff\layout.tsx

```
export {};
import StaffSidebar from "./StaffSidebar"
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-[52px]">
      <StaffSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

```

## .\app\staff\StaffSidebar.tsx

```
export {};
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ListTodo, Users, CalendarDays, MessageSquare } from "lucide-react"

const LINKS = [
  { label: "My Tasks",  href: "/staff/dashboard", icon: LayoutDashboard },
  { label: "Leads",     href: "/staff/leads",     icon: Users           },
  { label: "Campaigns", href: "/staff/campaigns", icon: ListTodo        },
  { label: "Schedule",  href: "/staff/schedule",  icon: CalendarDays    },
  { label: "Messages",  href: "/staff/messages",  icon: MessageSquare   },
]

export default function StaffSidebar() {
  const pathname = usePathname()
  return (
    <div className="hidden md:flex w-60 flex-col shrink-0 h-[calc(100vh-52px)] sticky top-[52px]"
      style={{ background: "rgba(10,15,31,0.97)", borderRight: "1px solid rgba(0,100,255,0.15)" }}>
      <div className="px-5 py-4 border-b border-[rgba(0,100,255,0.12)]">
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md"
          style={{ background: "rgba(0,100,255,0.12)", color: "#4FC3F7" }}>
          Staff Portal
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {LINKS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: active ? "rgba(0,100,255,0.12)" : "transparent",
                color: active ? "#4FC3F7" : "rgba(178,235,242,0.65)",
                borderLeft: active ? "2px solid #4FC3F7" : "2px solid transparent",
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-[rgba(0,100,255,0.1)]">
        <p className="text-xs text-white/30">Staff Member</p>
      </div>
    </div>
  )
}

```

## .\app\staff\dashboard\page.tsx

```
export {};
const tasks = [
  { text: "Follow up with Johnson & Co",    due: "Today",    status: "urgent" },
  { text: "Send campaign report to client", due: "Tomorrow", status: "pending" },
  { text: "Update CRM â€” 12 new contacts",   due: "Today",    status: "urgent" },
  { text: "Review AI response drafts",      due: "Fri",      status: "pending" },
]
export default function StaffDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">My Dashboard</h1>
        <p className="text-sm text-[#B2EBF2]/60 mt-1">Your tasks and activity for today.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Open Tasks",    value: "4"   },
          { label: "Leads Assigned",value: "23"  },
          { label: "Msgs Pending",  value: "7"   },
        ].map((s, i) => (
          <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,100,255,0.13)" }}>
            <span className="text-xs text-[#B2EBF2]/60 uppercase tracking-wider">{s.label}</span>
            <span className="text-2xl font-extrabold text-white">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,100,255,0.13)" }}>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">My Tasks</h2>
        <div className="flex flex-col gap-3">
          {tasks.map((t, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-white/5">
              <span className="text-sm text-[#B2EBF2]/80">{t.text}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-white/40">{t.due}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: t.status === "urgent" ? "rgba(255,82,82,0.15)" : "rgba(0,229,255,0.1)",
                    color: t.status === "urgent" ? "#FF5252" : "#00FFFF"
                  }}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

```

## .\components\leads\LeadCsvImportModal.tsx

```
"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";

const sampleCsv = `name,email,phone,company,source,status,tags,notes
Jane Smith,jane@example.com,555-123-4567,Smith Roofing,Website,new,"roofing,hot","Requested pricing"
Marcus Lee,marcus@example.com,555-222-9999,Lee HVAC,Referral,qualified,"hvac,commercial","Needs follow-up"`;

const acceptedColumns = [
  "name",
  "first_name",
  "last_name",
  "full_name",
  "email",
  "phone",
  "company",
  "source",
  "status",
  "tags",
  "notes",
  "address",
  "city",
  "state",
  "zip",
  "website",
  "lead_score",
  "score",
  "last_interaction",
  "created_at",
];

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(text: string) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one lead row.");
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return headers.reduce((row: Record<string, string>, header, index) => {
      row[header] = cells[index] || "";
      return row;
    }, {});
  });
}

function hasIdentifier(row: Record<string, string>) {
  const lookup = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      value,
    ])
  );
  const name =
    lookup.name ||
    lookup.full_name ||
    [lookup.first_name, lookup.last_name].filter(Boolean).join(" ");

  return Boolean(lookup.email || lookup.phone || name.trim());
}

export default function LeadCsvImportModal({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported?: () => void;
}) {
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const preview = rows.slice(0, 5);
  const summary = useMemo(() => {
    const valid = rows.filter(hasIdentifier).length;
    return {
      total: rows.length,
      valid,
      skipped: rows.length - valid,
    };
  }, [rows]);

  if (!open) return null;

  async function handleFile(file?: File | null) {
    try {
      setError("");
      setResult(null);

      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error("Select a .csv file.");
      }

      const text = await file.text();
      const parsed = parseCsv(text);
      setRows(parsed);
      setFileName(file.name);
    } catch (error) {
      setRows([]);
      setFileName("");
      setError(error instanceof Error ? error.message : "Failed to parse CSV.");
    }
  }

  async function importRows() {
    try {
      setImporting(true);
      setError("");
      setResult(null);

      const response = await fetch("/api/crm/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to import leads.");
      }

      setResult(data);
      window.dispatchEvent(new Event("crm-leads-imported"));
      onImported?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to import leads.");
    } finally {
      setImporting(false);
    }
  }

  function resetAndClose() {
    if (importing) return;
    setRows([]);
    setFileName("");
    setError("");
    setResult(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-cyan-400/20 bg-[#061018] p-5 text-white shadow-2xl shadow-cyan-500/10 md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              <Upload size={14} />
              Lead CSV Import
            </div>
            <h2 className="text-2xl font-black">Import contacts into the real CRM</h2>
            <p className="mt-1 text-sm text-gray-400">
              Upload a CSV, preview mapped rows, then import valid contacts into Supabase leads.
            </p>
          </div>
          <button onClick={resetAndClose} className="rounded-xl border border-white/10 bg-black/30 p-2 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 size={16} />
              Import complete
            </div>
            <div className="mt-2">
              {result.imported_count} imported, {result.duplicate_count} duplicates skipped, {result.skipped_count} skipped.
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
            <h3 className="font-black">Suggested format</h3>
            <p className="mt-2 text-sm text-gray-400">
              Columns can be in any order. At minimum, each row needs email, phone, or name.
              Duplicate detection uses email first, then phone. Duplicates are skipped safely.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-gray-300">
              {sampleCsv}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              {acceptedColumns.map((column) => (
                <span key={column} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-300">
                  {column}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/[0.05] p-5">
            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-400/30 bg-black/30 p-6 text-center hover:bg-cyan-500/10">
              <FileText className="mb-3 text-cyan-300" size={32} />
              <span className="font-black">Choose CSV file</span>
              <span className="mt-1 text-sm text-gray-500">{fileName || "Only .csv files are accepted"}</span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
            </label>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["Rows", summary.total],
                ["Valid", summary.valid],
                ["Skipped", summary.skipped],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                  <div className="text-2xl font-black text-cyan-200">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={importRows}
              disabled={importing || rows.length === 0 || summary.valid === 0}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 px-5 py-3 font-black text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {importing ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              Import Valid Leads
            </button>
          </div>
        </section>

        {preview.length > 0 && (
          <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-3 font-black">Preview first {preview.length} rows</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-widest text-gray-500">
                  <tr>
                    {Object.keys(preview[0]).slice(0, 8).map((header) => (
                      <th key={header} className="border-b border-white/10 p-3">{header}</th>
                    ))}
                    <th className="border-b border-white/10 p-3">Validation</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index} className="border-b border-white/5">
                      {Object.keys(preview[0]).slice(0, 8).map((header) => (
                        <td key={header} className="p-3 text-gray-300">{row[header]}</td>
                      ))}
                      <td className="p-3">
                        {hasIdentifier(row) ? (
                          <span className="text-cyan-200">valid</span>
                        ) : (
                          <span className="text-red-200">missing identifier</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {result?.errors?.length > 0 && (
          <section className="mt-5 rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-5">
            <h3 className="mb-3 font-black text-yellow-100">Skipped row summary</h3>
            <div className="space-y-2 text-sm text-yellow-50">
              {result.errors.slice(0, 8).map((item: any) => (
                <div key={`${item.row}-${item.reason}`}>Row {item.row}: {item.reason}</div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

```

## .\components\onboarding\IndustrySearch.tsx

```
"use client";

const industries = [
  "HVAC",
  "Roofing",
  "Plumbing",
  "Electrical",
  "Healthcare",
  "Dental",
  "Legal",
  "Insurance",
  "Real Estate",
  "Construction",
  "Agency",
  "Marketing",
  "Ecommerce",
  "Retail",
  "Restaurant",
  "Automotive",
  "Fitness",
  "Coaching",
  "Consulting",
  "Beauty",
  "Salon",
  "Med Spa",
  "Chiropractic",
  "Accounting",
  "Finance",
  "Landscaping",
  "Cleaning",
  "Security",
  "Education",
];

export default function IndustrySearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your industry..."
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
      />

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {industries
          .filter((i) =>
            i.toLowerCase().includes(value.toLowerCase())
          )
          .map((industry) => (
            <button
              key={industry}
              onClick={() => onChange(industry)}
              className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10"
            >
              {industry}
            </button>
          ))}
      </div>
    </div>
  );
}

```

## .\lib\ai\generate-workspace.ts

```
export {};
export type WorkspaceBlueprint = {
  businessType: string;
  crm: {
    entities: string[];
    fields: Record<string, string[]>;
  };
  pipeline: string[];
  aiAgents: string[];
};

/**
 * AI Workspace Generator (Production-Ready)
 * Generates REAL CRM structures used by actual SaaS tenants
 */
export function generateWorkspaceBlueprint(input: {
  industry: string;
  businessName?: string;
  goals?: string[];
}): WorkspaceBlueprint {

  const industry = input.industry?.toLowerCase() || "";

  // ðŸ  Home services
  if (industry.includes("roof") || industry.includes("construction")) {
    return {
      businessType: "home_services",
      crm: {
        entities: ["leads", "estimates", "jobs", "customers"],
        fields: {
          leads: ["name", "phone", "address", "source", "status"],
          jobs: ["jobType", "price", "scheduleDate", "status"]
        }
      },
      pipeline: [
        "new_lead",
        "contacted",
        "estimate_sent",
        "scheduled",
        "in_progress",
        "completed"
      ],
      aiAgents: [
        "lead_responder",
        "estimate_generator",
        "follow_up_agent"
      ]
    };
  }

  // ðŸ‹ï¸ Fitness / gyms
  if (industry.includes("gym") || industry.includes("fitness")) {
    return {
      businessType: "membership_business",
      crm: {
        entities: ["members", "leads", "subscriptions"],
        fields: {
          members: ["name", "phone", "membershipType", "status"]
        }
      },
      pipeline: [
        "lead",
        "trial",
        "member",
        "active",
        "churn_risk",
        "renewed"
      ],
      aiAgents: [
        "trial_converter",
        "retention_agent",
        "upsell_agent"
      ]
    };
  }

  // âš™ï¸ Default SaaS CRM
  return {
    businessType: "general_crm",
    crm: {
      entities: ["leads", "deals", "contacts", "activities"],
      fields: {
        leads: ["name", "phone", "email", "status", "source", "priority"]
      }
    },
    pipeline: [
      "new_lead",
      "contacted",
      "qualified",
      "proposal_sent",
      "closed_won",
      "closed_lost"
    ],
    aiAgents: [
      "lead_qualifier",
      "follow_up_agent",
      "pipeline_optimizer"
    ]
  };
}

```

## .\lib\ai\providers.ts

```
export type AIProfile = "cheap" | "balanced" | "premium" | "fallback";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIProviderName = "gemini" | "openai" | "openrouter";

export type AIProviderResult = {
  text: string;
  provider: AIProviderName;
  model: string;
  fallback_used: boolean;
  provider_errors: Array<{
    provider: AIProviderName;
    reason: string;
  }>;
  provider_warnings?: Array<{
    provider: AIProviderName;
    reason: string;
  }>;
};

export class AIProvidersUnavailableError extends Error {
  provider_errors: Array<{
    provider: AIProviderName;
    reason: string;
  }>;

  constructor(
    providerErrors: Array<{
      provider: AIProviderName;
      reason: string;
    }>
  ) {
    super("AI providers are unavailable or out of quota.");
    this.name = "AIProvidersUnavailableError";
    this.provider_errors = providerErrors;
  }
}

const DEFAULT_OPENROUTER_MODEL = "openrouter/free";

const MODEL_BY_PROVIDER: Record<AIProviderName, Record<AIProfile, string>> = {
  gemini: {
    cheap: process.env.GEMINI_CHEAP_MODEL || "gemini-1.5-flash-8b",
    balanced: process.env.GEMINI_BALANCED_MODEL || "gemini-1.5-flash",
    premium: process.env.GEMINI_PREMIUM_MODEL || "gemini-1.5-pro",
    fallback: process.env.GEMINI_FALLBACK_MODEL || "gemini-1.5-flash-8b",
  },
  openai: {
    cheap: process.env.OPENAI_CHEAP_MODEL || "gpt-4o-mini",
    balanced: process.env.OPENAI_BALANCED_MODEL || "gpt-4o-mini",
    premium: process.env.OPENAI_PREMIUM_MODEL || "gpt-4o",
    fallback: process.env.OPENAI_FALLBACK_MODEL || "gpt-4o-mini",
  },
  openrouter: {
    cheap: process.env.OPENROUTER_CHEAP_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    balanced: process.env.OPENROUTER_BALANCED_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    premium: process.env.OPENROUTER_PREMIUM_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    fallback: process.env.OPENROUTER_FALLBACK_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
  },
};

const OPENROUTER_SECONDARY_MODEL =
  process.env.OPENROUTER_SECONDARY_MODEL ||
  DEFAULT_OPENROUTER_MODEL;

function isOpenAIEnabled() {
  return process.env.AI_ENABLE_OPENAI === "true";
}

function configuredProviders() {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY && isOpenAIEnabled()),
    openrouter: Boolean(process.env.OPENROUTER_API_KEY),
  };
}

export function getAIProviderStatus() {
  const plan = getProviderPlan();

  return {
    configured: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
    },
    enabled: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY && isOpenAIEnabled()),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
    },
    priority: plan.order,
    warnings: plan.warnings,
    models: MODEL_BY_PROVIDER,
    openrouter_model: process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    openai_enabled: isOpenAIEnabled(),
  };
}

function parseProviderOrder(value?: string): AIProviderName[] {
  return (value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is AIProviderName =>
      ["gemini", "openai", "openrouter"].includes(item)
    );
}

function defaultProviderOrder(profile: AIProfile): AIProviderName[] {
  if (profile === "fallback") {
    return ["openrouter", "gemini"];
  }

  return ["gemini", "openrouter"];
}

function getProviderPlan(profile: AIProfile = "balanced") {
  const configured = configuredProviders();
  const explicitOrder = parseProviderOrder(process.env.AI_PROVIDER_ORDER);
  const requestedOrder =
    explicitOrder.length > 0 ? explicitOrder : defaultProviderOrder(profile);
  const warnings: AIProviderResult["provider_errors"] = [];

  const order = requestedOrder.filter((provider) => {
    if (provider === "openai" && !isOpenAIEnabled()) {
      warnings.push({
        provider: "openai",
        reason: "openai skipped because AI_ENABLE_OPENAI is not enabled",
      });
      return false;
    }

    return configured[provider];
  });

  return { order, warnings };
}

export function getProviderOrder(profile: AIProfile = "balanced") {
  return getProviderPlan(profile).order;
}

function sanitizeProviderError(error: any) {
  const message = String(error?.message || error || "provider request failed");
  const lower = message.toLowerCase();

  if (lower.includes("openai skipped because ai_enable_openai is not enabled")) {
    return "openai skipped because AI_ENABLE_OPENAI is not enabled";
  }

  if (lower.includes("quota/rate limit")) {
    return "quota/rate limit";
  }

  if (lower.includes("missing key")) {
    return "missing key";
  }

  if (lower.includes("invalid model")) {
    return "invalid model";
  }

  if (lower.includes("response parsing failed")) {
    return "response parsing failed";
  }

  if (lower.includes("no content returned")) {
    return "no content returned";
  }

  const statusMatch = lower.match(/status\s+(\d{3})/);
  if (statusMatch && !["401", "403", "429"].includes(statusMatch[1])) {
    return `request failed with status ${statusMatch[1]}`;
  }

  if (
    lower.includes("quota") ||
    lower.includes("billing") ||
    lower.includes("insufficient_quota")
  ) {
    return "quota or billing limit";
  }

  if (
    lower.includes("rate") ||
    lower.includes("429") ||
    lower.includes("too many") ||
    lower.includes("rate limit")
  ) {
    return lower.includes("openrouter") ? "quota/rate limit" : "rate limited";
  }

  if (
    lower.includes("auth") ||
    lower.includes("api key") ||
    lower.includes("401") ||
    lower.includes("403") ||
    lower.includes("permission")
  ) {
    return lower.includes("openrouter") ? "auth failed" : "authentication failed";
  }

  if (lower.includes("not configured")) {
    return "not configured";
  }

  return "request failed";
}

function messagesToGeminiText(messages: AIMessage[]) {
  return messages
    .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
    .join("\n\n");
}

async function callGemini(messages: AIMessage[], profile: AIProfile) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini is not configured.");
  }

  const model = MODEL_BY_PROVIDER.gemini[profile];
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: messagesToGeminiText(messages),
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || `Gemini request failed: ${response.status}`);
  }

  return {
    text: data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "",
    model,
  };
}

async function callOpenAI(messages: AIMessage[], profile: AIProfile) {
  if (!isOpenAIEnabled()) {
    throw new Error("OpenAI skipped because AI_ENABLE_OPENAI is not enabled.");
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI is not configured.");
  }

  const model = MODEL_BY_PROVIDER.openai[profile];
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenAI request failed: ${response.status}`);
  }

  return {
    text: data?.choices?.[0]?.message?.content?.trim() || "",
    model,
  };
}

async function callOpenRouterModel(messages: AIMessage[], model: string) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OpenRouter missing key.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "SynaptiReach CRM",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = String(data?.error?.message || "");
    const lowerDetail = detail.toLowerCase();

    if (response.status === 401 || response.status === 403) {
      throw new Error("OpenRouter auth failed.");
    }

    if (response.status === 429 || lowerDetail.includes("quota") || lowerDetail.includes("rate")) {
      throw new Error("OpenRouter quota/rate limit.");
    }

    if (
      response.status === 400 &&
      (lowerDetail.includes("model") || lowerDetail.includes("not found"))
    ) {
      throw new Error("OpenRouter invalid model.");
    }

    throw new Error(`OpenRouter request failed with status ${response.status}.`);
  }

  const choice = data?.choices?.[0];
  const text =
    choice?.message?.content?.trim?.() ||
    choice?.text?.trim?.() ||
    "";

  if (!text) {
    throw new Error("OpenRouter response parsing failed.");
  }

  return {
    text,
    model,
  };
}

async function callOpenRouter(messages: AIMessage[], profile: AIProfile) {
  const primaryModel = MODEL_BY_PROVIDER.openrouter[profile];

  try {
    return await callOpenRouterModel(messages, primaryModel);
  } catch (error) {
    const reason = sanitizeProviderError(error);
    const shouldTrySecondary =
      reason === "invalid model" ||
      reason === "response parsing failed" ||
      reason === "no content returned" ||
      reason === "request failed with status 404" ||
      reason === "request failed with status 502" ||
      reason === "request failed with status 503" ||
      reason === "request failed with status 504";

    if (primaryModel !== OPENROUTER_SECONDARY_MODEL && shouldTrySecondary) {
      return callOpenRouterModel(messages, OPENROUTER_SECONDARY_MODEL);
    }

    throw error;
  }
}

export async function generateAIText(
  messages: AIMessage[],
  options: {
    profile?: AIProfile;
    preferredProvider?: AIProviderName;
  } = {}
): Promise<AIProviderResult> {
  const profile = options.profile || "balanced";
  const providerErrors: AIProviderResult["provider_errors"] = [];
  const plan = getProviderPlan(profile);
  const providerWarnings = plan.warnings;
  const order = options.preferredProvider
    ? [
        options.preferredProvider,
        ...plan.order.filter(
          (provider) => provider !== options.preferredProvider
        ),
      ].filter((provider, index, providers) => {
        if (provider === "openai" && !isOpenAIEnabled()) {
          if (!providerWarnings.some((warning) => warning.provider === "openai")) {
            providerWarnings.push({
              provider: "openai",
              reason: "openai skipped because AI_ENABLE_OPENAI is not enabled",
            });
          }
          return false;
        }

        return providers.indexOf(provider) === index;
      })
    : plan.order;

  if (order.length === 0) {
    throw new AIProvidersUnavailableError([
      { provider: "gemini", reason: "not configured" },
      ...(providerWarnings.length > 0
        ? providerWarnings
        : [{ provider: "openai" as AIProviderName, reason: "not configured" }]),
      { provider: "openrouter", reason: "not configured" },
    ]);
  }

  for (const provider of order) {
    try {
      const result =
        provider === "gemini"
          ? await callGemini(messages, profile)
          : provider === "openai"
            ? await callOpenAI(messages, profile)
            : await callOpenRouter(messages, profile);

      if (!result.text) {
        throw new Error("Provider returned no content.");
      }

      return {
        text: result.text,
        provider,
        model: result.model,
        fallback_used: providerErrors.length > 0,
        provider_errors: providerErrors,
        provider_warnings: providerWarnings,
      };
    } catch (error) {
      providerErrors.push({
        provider,
        reason: sanitizeProviderError(error),
      });
    }
  }

  throw new AIProvidersUnavailableError([...providerWarnings, ...providerErrors]);
}

export async function generateAIJson<T>(
  messages: AIMessage[],
  fallback: T,
  options: {
    profile?: AIProfile;
    preferredProvider?: AIProviderName;
  } = {}
) {
  const result = await generateAIText(
    [
      ...messages,
      {
        role: "system",
        content:
          "Return valid JSON only. Do not wrap the JSON in markdown fences.",
      },
    ],
    options
  );

  try {
    return {
      data: JSON.parse(result.text) as T,
      meta: result,
    };
  } catch {
    return {
      data: fallback,
      meta: result,
    };
  }
}

export function providerErrorResponse(error: any) {
  if (error instanceof AIProvidersUnavailableError) {
    return {
      success: false,
      error: "AI providers are unavailable or out of quota.",
      provider_errors: error.provider_errors,
    };
  }

  return {
    success: false,
    error: "AI providers are unavailable or out of quota.",
    provider_errors: [
      {
        provider: "openai" as AIProviderName,
        reason: sanitizeProviderError(error),
      },
    ],
  };
}

```

## .\lib\ai\workspace-intelligence.ts

```
export function analyzeWorkspace() {
  return {
    score: 0,
    insights: []
  };
}

export async function buildWorkspaceIntelligence(data: unknown) {
  return { score: 0, insights: [], data };
}

export async function generateGeminiInsights(data: unknown) {
  return { insights: [], data };
}

```

## .\lib\ai\onboarding\generate.ts

```
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

```

## .\lib\api\workspace.api.ts

```
import { supabase } from "@/lib/supabase/client";

export async function fetchWorkspaces() {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}

```

## .\lib\api\workspaces.ts

```
import { getWorkspaces } from "@/server/services/workspace.service";

export async function fetchWorkspaces() {
  return getWorkspaces();
}

```

## .\lib\auth\getWorkspaceContext.ts

```
import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/crm/supabaseAdmin";

export type WorkspaceContext = {
  userId: string | null;
  workspaceId: string | null;
  companyId: string | null;
  role: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isScoped: boolean;
  warnings: string[];
};

function valueFromRequest(request: Request | NextRequest, name: string) {
  const url = new URL(request.url);
  return (
    request.headers.get(name) ||
    request.headers.get(`x-${name}`) ||
    url.searchParams.get(name) ||
    url.searchParams.get(name.replace(/_/g, ""))
  );
}

export async function getWorkspaceContext(
  request: Request | NextRequest
): Promise<WorkspaceContext> {
  const requestedWorkspaceId =
    valueFromRequest(request, "workspace_id") ||
    valueFromRequest(request, "workspace-id");
  const requestedCompanyId =
    valueFromRequest(request, "company_id") ||
    valueFromRequest(request, "company-id");
  const warnings: string[] = [];

  let userId: string | null = null;

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id || null;
  } catch {
    warnings.push("No Supabase server session was available for this request.");
  }

  if (!userId) {
    return {
      userId: null,
      workspaceId: requestedWorkspaceId || null,
      companyId: requestedCompanyId || null,
      role: null,
      permissions: [],
      isAuthenticated: false,
      isScoped: Boolean(requestedWorkspaceId || requestedCompanyId),
      warnings: [
        ...warnings,
        "Auth is not fully enforced for this route yet; server-side workspace scoping falls back to explicit workspace/company identifiers when provided.",
      ],
    };
  }

  const admin = createSupabaseAdmin();
  const workspaceQuery = requestedWorkspaceId
    ? admin
        .from("workspaces")
        .select("id, company_id, owner_id")
        .eq("id", requestedWorkspaceId)
        .or(`owner_id.eq.${userId}`)
        .maybeSingle()
    : admin
        .from("workspaces")
        .select("id, company_id, owner_id")
        .eq("owner_id", userId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

  const { data: workspace } = await workspaceQuery;

  if (!workspace) {
    warnings.push("No matching workspace was found for the authenticated user.");
  }

  return {
    userId,
    workspaceId: workspace?.id || requestedWorkspaceId || null,
    companyId: workspace?.company_id || requestedCompanyId || null,
    role: workspace?.owner_id === userId ? "owner" : null,
    permissions: workspace?.owner_id === userId ? ["*"] : [],
    isAuthenticated: true,
    isScoped: Boolean(workspace?.id || requestedWorkspaceId || requestedCompanyId),
    warnings,
  };
}

export function scopedInsert<T extends Record<string, any>>(
  record: T,
  context: WorkspaceContext
) {
  return {
    ...record,
    workspace_id: record.workspace_id || context.workspaceId || null,
    company_id: record.company_id || context.companyId || null,
    user_id: record.user_id || context.userId || null,
  };
}

export function applyWorkspaceScope<TQuery extends { eq: (column: string, value: string) => TQuery }>(
  query: TQuery,
  context: WorkspaceContext
) {
  if (context.workspaceId) return query.eq("workspace_id", context.workspaceId);
  if (context.companyId) return query.eq("company_id", context.companyId);
  if (context.userId) return query.eq("user_id", context.userId);
  return query;
}

```

## .\lib\billing\plans.ts

```
export const SELF_SERVICE_BYOK_PLANS = [
  {
    name: "Basic BYOK",
    price: "$29/mo",
    aiActions: "2,500/mo",
    emails: "1,000/mo tracked",
    sms: "BYOK SMS only",
    contacts: "500",
    agents: "0",
  },
  {
    name: "Growth BYOK",
    price: "$59/mo",
    aiActions: "10,000/mo",
    emails: "5,000/mo tracked",
    sms: "BYOK SMS only",
    contacts: "2,500",
    agents: "2",
  },
  {
    name: "Premium BYOK",
    price: "$119/mo",
    aiActions: "30,000/mo",
    emails: "15,000/mo tracked",
    sms: "BYOK SMS only",
    contacts: "10,000",
    agents: "5",
  },
];

export const MANAGED_PLANS = [
  {
    name: "Basic Managed",
    price: "$49/mo",
    aiActions: "3,000/mo",
    emails: "1,000/mo",
    sms: "100/mo",
    contacts: "500",
    agents: "1 lightweight agent",
    note: "Hard caps. No surprise overages.",
  },
  {
    name: "Growth Managed",
    price: "$99/mo",
    aiActions: "12,000/mo",
    emails: "5,000/mo",
    sms: "500/mo",
    contacts: "2,500",
    agents: "3",
    popular: true,
    note: "Hard caps. No surprise overages.",
  },
  {
    name: "Premium Managed",
    price: "$199/mo",
    aiActions: "40,000/mo",
    emails: "20,000/mo",
    sms: "1,500/mo",
    contacts: "10,000",
    agents: "8",
    note: "Hard caps. No surprise overages.",
  },
];

export const CREDIT_PACKS = [
  "AI Pack Small: 5,000 AI actions for $19",
  "AI Pack Growth: 20,000 AI actions for $59",
  "Email Pack: 5,000 emails for $25",
  "SMS Pack Small: 250 SMS for $19",
  "SMS Pack Growth: 1,000 SMS for $69",
  "Contact Pack: +5,000 contacts for $29/mo",
];

export const DFY_PLANS = [
  {
    name: "DFY Starter Setup",
    price: "$799 setup + $149/mo managed platform",
    features: ["CRM setup", "Lead pipeline", "Basic email campaign", "Basic automation", "5,000 AI actions/mo", "2 AI agents", "1 setup call"],
  },
  {
    name: "DFY Growth Setup",
    price: "$1,499 setup + $299/mo managed platform",
    popular: true,
    features: ["Full funnel build", "CRM + segmentation", "Email + SMS sequence setup", "Workflow setup", "20,000 AI actions/mo", "5 AI agents", "Monthly strategy call"],
  },
  {
    name: "DFY Premium Setup",
    price: "$2,999 setup + $599/mo managed platform",
    features: ["Full business system", "Branding + strategy", "Advanced AI agents", "Advanced automation", "Campaign tracking", "60,000 AI actions/mo", "10 AI agents", "Priority support/account management"],
  },
];

export const TRIAL_PLANS = [
  {
    name: "Basic Trial",
    aiActions: "100",
    emails: "100",
    sms: "0 managed SMS",
    contacts: "100",
    agents: "0",
    available: true,
  },
  {
    name: "Growth Trial",
    aiActions: "250",
    emails: "250",
    sms: "0 managed SMS",
    contacts: "250",
    agents: "1 lightweight preview agent",
    available: true,
    popular: true,
  },
  {
    name: "Premium Trial",
    aiActions: "Contact approval",
    emails: "Contact approval",
    sms: "0 managed SMS",
    contacts: "Contact approval",
    agents: "Locked",
    available: false,
  },
];

export const COMMITMENT_DISCOUNTS = [
  { duration: "3 months", discount: "10%" },
  { duration: "6 months", discount: "20%" },
  { duration: "9 months", discount: "25%" },
  { duration: "12 months", discount: "30%" },
];

```

## .\lib\billing\stripe.ts

```
import crypto from "crypto";

type CheckoutInput = {
  packName: string;
  amountCents: number | null;
  origin: string;
  purchaseId?: string | null;
  workspaceId?: string | null;
  companyId?: string | null;
  userId?: string | null;
  quantity?: number | null;
};

type CustomerInput = {
  email?: string | null;
  name?: string | null;
  workspaceId?: string | null;
  companyId?: string | null;
  userId?: string | null;
};

type PortalInput = {
  customerId: string;
  origin: string;
};

const STRIPE_API_VERSION = "2026-04-22.dahlia";

export function getStripeBillingStatus() {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  return {
    configured: Boolean(secretKey),
    publishableKeyConfigured: Boolean(publishableKey),
    secretKeyConfigured: Boolean(secretKey),
    webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    mode: secretKey.startsWith("sk_live_") ? "live" : secretKey.startsWith("sk_test_") ? "test" : "not configured",
    checkoutEnabled: Boolean(secretKey),
  };
}

function safeStripeError(status: number, body: any) {
  const code = body?.error?.code || body?.error?.type || "stripe_error";
  const message = body?.error?.message || `Stripe request failed with status ${status}.`;
  return `${code}: ${message}`;
}

async function stripePost(path: string, params: URLSearchParams) {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  if (!secretKey) {
    return {
      ok: false,
      setupRequired: true,
      status: 0,
      body: null,
      error: "Stripe is not configured.",
    };
  }

  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": STRIPE_API_VERSION,
    },
    body: params,
  });

  const body = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    setupRequired: false,
    status: response.status,
    body,
    error: response.ok ? null : safeStripeError(response.status, body),
  };
}

export async function createCreditPackCheckoutSession(input: CheckoutInput) {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  if (!secretKey) {
    return {
      success: false,
      setupRequired: true,
      error: "Stripe checkout is not configured.",
    };
  }

  if (!input.amountCents || input.amountCents < 50) {
    return {
      success: false,
      setupRequired: false,
      error: "A valid credit pack price is required before starting checkout.",
    };
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${input.origin}/dashboard/settings?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${input.origin}/dashboard/settings?checkout=cancelled`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(input.amountCents));
  params.set("line_items[0][price_data][product_data][name]", input.packName);
  params.set("metadata[source]", "synaptireach_settings_credit_pack");
  params.set("metadata[pack_type]", input.packName);
  params.set("metadata[quantity]", String(input.quantity || 1));
  if (input.purchaseId) params.set("metadata[purchase_id]", input.purchaseId);
  if (input.workspaceId) params.set("metadata[workspace_id]", input.workspaceId);
  if (input.companyId) params.set("metadata[company_id]", input.companyId);
  if (input.userId) params.set("metadata[user_id]", input.userId);
  params.set("payment_intent_data[metadata][source]", "synaptireach_settings_credit_pack");
  params.set("payment_intent_data[metadata][pack_type]", input.packName);
  params.set("payment_intent_data[metadata][quantity]", String(input.quantity || 1));
  if (input.purchaseId) params.set("payment_intent_data[metadata][purchase_id]", input.purchaseId);
  if (input.workspaceId) params.set("payment_intent_data[metadata][workspace_id]", input.workspaceId);
  if (input.companyId) params.set("payment_intent_data[metadata][company_id]", input.companyId);
  if (input.userId) params.set("payment_intent_data[metadata][user_id]", input.userId);

  const result = await stripePost("checkout/sessions", params);
  if (!result.ok) {
    return {
      success: false,
      setupRequired: Boolean(result.setupRequired),
      error: result.error,
    };
  }

  return {
    success: true,
    setupRequired: false,
    sessionId: result.body.id as string,
    checkoutUrl: result.body.url as string,
  };
}

export async function createStripeCustomer(input: CustomerInput) {
  const params = new URLSearchParams();
  if (input.email) params.set("email", input.email);
  if (input.name) params.set("name", input.name);
  params.set("metadata[source]", "synaptireach_settings_billing_portal");
  if (input.workspaceId) params.set("metadata[workspace_id]", input.workspaceId);
  if (input.companyId) params.set("metadata[company_id]", input.companyId);
  if (input.userId) params.set("metadata[user_id]", input.userId);

  const result = await stripePost("customers", params);
  return result.ok
    ? { success: true, customerId: result.body.id as string, setupRequired: false, error: null }
    : { success: false, customerId: null, setupRequired: Boolean(result.setupRequired), error: result.error };
}

export async function createBillingPortalSession(input: PortalInput) {
  const params = new URLSearchParams();
  params.set("customer", input.customerId);
  params.set("return_url", `${input.origin}/dashboard/settings?billing_portal=returned`);

  const result = await stripePost("billing_portal/sessions", params);
  return result.ok
    ? { success: true, url: result.body.url as string, setupRequired: false, error: null }
    : { success: false, url: null, setupRequired: Boolean(result.setupRequired), error: result.error };
}

export function verifyStripeWebhookSignature(payload: string, signatureHeader: string | null) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!webhookSecret) {
    return {
      verified: false,
      error: "Stripe webhook secret is not configured.",
    };
  }

  if (!signatureHeader) {
    return {
      verified: false,
      error: "Missing Stripe signature header.",
    };
  }

  const parts = signatureHeader.split(",").reduce((acc: Record<string, string[]>, part) => {
    const [key, value] = part.split("=");
    if (!key || !value) return acc;
    acc[key] = [...(acc[key] || []), value];
    return acc;
  }, {});

  const timestamp = parts.t?.[0];
  const signatures = parts.v1 || [];
  if (!timestamp || signatures.length === 0) {
    return {
      verified: false,
      error: "Invalid Stripe signature header.",
    };
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) {
    return {
      verified: false,
      error: "Stripe webhook timestamp is outside the allowed tolerance.",
    };
  }

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const matches = signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature, "hex");
    return signatureBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  });

  return matches
    ? { verified: true, error: null }
    : { verified: false, error: "Stripe webhook signature verification failed." };
}

```

## .\lib\crm\importLeadsCsv.ts

```
import { createSupabaseAdmin } from "@/lib/crm/supabaseAdmin";

const VALID_STATUSES = new Set([
  "new",
  "contacted",
  "qualified",
  "nurture",
  "converted",
  "lost",
]);

const FIELD_ALIASES: Record<string, string> = {
  name: "name",
  full_name: "name",
  fullname: "name",
  first_name: "first_name",
  firstname: "first_name",
  last_name: "last_name",
  lastname: "last_name",
  email: "email",
  email_address: "email",
  phone: "phone",
  phone_number: "phone",
  mobile: "phone",
  company: "company",
  organization: "company",
  source: "source",
  status: "status",
  tags: "tags",
  notes: "notes",
  note: "notes",
  address: "address",
  city: "city",
  state: "state",
  zip: "zip",
  zipcode: "zip",
  postal_code: "zip",
  website: "website",
  url: "website",
  lead_score: "score",
  score: "score",
  last_interaction: "last_interaction",
  created_at: "created_at",
};

type ImportRow = Record<string, any>;

function normalizeHeader(header: string) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clean(value: any) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function normalizeStatus(value: any) {
  const status = String(value || "new").trim().toLowerCase().replace(/\s+/g, "_");
  return VALID_STATUSES.has(status) ? status : "new";
}

function normalizeDate(value: any) {
  const text = clean(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function splitTags(value: any) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function mapRow(raw: ImportRow) {
  const mapped: Record<string, any> = {};
  const extra: Record<string, any> = {};

  Object.entries(raw || {}).forEach(([key, value]) => {
    const normalized = normalizeHeader(key);
    const target = FIELD_ALIASES[normalized];

    if (target) {
      mapped[target] = value;
    } else if (clean(value)) {
      extra[key] = value;
    }
  });

  const firstName = clean(mapped.first_name);
  const lastName = clean(mapped.last_name);
  const name =
    clean(mapped.name) ||
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    null;

  const tags = splitTags(mapped.tags);
  const metadata = {
    tags,
    address: clean(mapped.address),
    city: clean(mapped.city),
    state: clean(mapped.state),
    zip: clean(mapped.zip),
    website: clean(mapped.website),
    extra_fields: extra,
    import_source: "csv",
  };

  return {
    name,
    email: clean(mapped.email)?.toLowerCase() || null,
    phone: clean(mapped.phone),
    company: clean(mapped.company),
    source: clean(mapped.source) || "CSV Import",
    status: normalizeStatus(mapped.status),
    score: Number(mapped.score || 0) || 0,
    notes: clean(mapped.notes),
    last_interaction: normalizeDate(mapped.last_interaction),
    created_at: normalizeDate(mapped.created_at),
    metadata,
  };
}

export async function importLeadRows(rows: ImportRow[], workspaceId?: string | null) {
  const supabase = createSupabaseAdmin();
  const errors: Array<{ row: number; reason: string }> = [];
  const imported: any[] = [];
  let duplicateCount = 0;
  let validCount = 0;

  const { data: existingRows, error: existingError } = await supabase
    .from("leads")
    .select("id,email,phone")
    .eq("archived", false);

  if (existingError) throw existingError;

  const existingEmails = new Set(
    (existingRows || [])
      .map((lead: any) => String(lead.email || "").toLowerCase())
      .filter(Boolean)
  );
  const existingPhones = new Set(
    (existingRows || [])
      .map((lead: any) => String(lead.phone || "").replace(/\D/g, ""))
      .filter(Boolean)
  );
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();

  for (const [index, raw] of rows.entries()) {
    const rowNumber = index + 2;
    const lead = mapRow(raw);
    const phoneKey = String(lead.phone || "").replace(/\D/g, "");

    if (!lead.email && !lead.phone && !lead.name) {
      errors.push({ row: rowNumber, reason: "Missing email, phone, or name." });
      continue;
    }

    validCount += 1;

    const duplicate =
      (lead.email && (existingEmails.has(lead.email) || seenEmails.has(lead.email))) ||
      (phoneKey && (existingPhones.has(phoneKey) || seenPhones.has(phoneKey)));

    if (duplicate) {
      duplicateCount += 1;
      errors.push({ row: rowNumber, reason: "Duplicate email or phone skipped." });
      continue;
    }

    const insertPayload: Record<string, any> = {
      workspace_id: workspaceId || null,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
      score: lead.score,
      notes: lead.notes,
      last_interaction: lead.last_interaction,
      imported: true,
      metadata: lead.metadata,
    };

    if (lead.created_at) {
      insertPayload.created_at = lead.created_at;
    }

    const { data, error } = await supabase
      .from("leads")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      errors.push({ row: rowNumber, reason: error.message || "Insert failed." });
      continue;
    }

    imported.push(data);
    if (lead.email) seenEmails.add(lead.email);
    if (phoneKey) seenPhones.add(phoneKey);

    if (lead.notes) {
      await supabase.from("lead_activities").insert({
        workspace_id: workspaceId || null,
        lead_id: data.id,
        type: "note",
        title: "Imported CSV note",
        details: lead.notes,
        metadata: { source: "csv_import" },
      });
    }
  }

  if (imported.length > 0) {
    await supabase.from("marketing_events").insert({
      workspace_id: workspaceId || null,
      type: "crm_import",
      event_type: "crm_import",
      action: "lead_csv_imported",
      title: "Lead CSV import completed",
      message: `${imported.length} leads imported from CSV.`,
      details: `${imported.length} imported, ${duplicateCount} duplicates skipped, ${errors.length} rows skipped or flagged.`,
      metadata: {
        imported_count: imported.length,
        duplicate_count: duplicateCount,
        skipped_count: errors.length,
      },
    });

    await supabase.from("crm_ai_recommendations").insert({
      workspace_id: workspaceId || null,
      type: "lead_import_review",
      title: "Review newly imported leads",
      description:
        "New CSV contacts were imported. Run lead scoring and create follow-up tasks for high-fit contacts.",
      action: "review_lead",
      status: "open",
      confidence: 0.78,
      metadata: {
        source: "csv_import",
        imported_count: imported.length,
      },
    });
  }

  return {
    total_rows: rows.length,
    valid_rows: validCount,
    skipped_count: errors.length,
    duplicate_count: duplicateCount,
    imported_count: imported.length,
    errors: errors.slice(0, 50),
    imported,
  };
}

```

## .\lib\integrations\getWorkspaceIntegrations.ts

```
import { createClient } from "@supabase/supabase-js";

import {
  decrypt,
} from "@/lib/security/encryption";

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase setup required. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(
    supabaseUrl,
    supabaseKey
  );
}

export async function getWorkspaceIntegrations(
  workspaceId: string
) {
  if (!workspaceId) {
    return null;
  }

  const supabase =
    getSupabaseAdmin();

  const {
    data,
    error,
  } = await supabase
    .from(
      "workspace_integrations"
    )
    .select("*")
    .eq(
      "workspace_id",
      workspaceId
    )
    .maybeSingle();

  if (error) {
    console.error(error);

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    resend_api_key:
      decrypt(
        data.resend_api_key
      ),

    twilio_sid:
      decrypt(
        data.twilio_sid
      ),

    twilio_token:
      decrypt(
        data.twilio_token
      ),

    ayrshare_key:
      decrypt(
        data.ayrshare_key
      ),

    gemini_key:
      decrypt(
        data.gemini_key
      ),
  };
}

```

## .\lib\intelligence\billingUsageIntelligence.ts

```
import { insight } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function billingUsageInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const usage = context.settings?.usage || context.settings?.metadata?.usage || {};
  const aiUsed = Number(usage.ai_actions_used || usage.ai || 0);
  const aiCap = Number(usage.ai_actions_cap || usage.ai_cap || 0);

  if (aiCap > 0 && aiUsed / aiCap >= 0.85) {
    return [
      insight({
        key: "ai-cap-warning",
        type: "billing_usage_intelligence",
        priority: aiUsed >= aiCap ? "urgent" : "high",
        title: "AI usage is near the account cap",
        summary: `AI usage is at ${aiUsed} of ${aiCap} included actions.`,
        reasoning: ["Usage caps protect managed-provider costs and prevent surprise overages."],
        recommendedAction: "Review usage and consider BYOK, credit packs, or an upgrade before running heavy AI tasks.",
        actionType: "review_billing",
        relatedRecords: [],
        confidence: 0.86,
        score: Math.round((aiUsed / aiCap) * 100),
        trend: "up",
        metadata: { aiUsed, aiCap },
      }),
    ];
  }

  return [];
}

```

## .\lib\intelligence\onboardingIntelligence.ts

```
import { insight } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function onboardingInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const settings = context.settings || {};
  const warnings = [...(context.schemaWarnings || []), ...(context.workspaceWarnings || [])];
  const insights: MiniBrainInsight[] = [];

  if (warnings.length) {
    insights.push(insight({
      key: "setup-warnings",
      type: "onboarding_setup",
      priority: "high",
      title: "Workspace setup needs attention",
      summary: "Some CRM setup checks returned warnings.",
      reasoning: warnings.slice(0, 3),
      recommendedAction: "Review settings and schema setup before relying on automation.",
      actionType: "fix_setup",
      relatedRecords: [],
      confidence: 0.88,
      trend: "unknown",
      metadata: { warnings },
    }));
  }

  if (!settings || Object.keys(settings).length === 0) {
    insights.push(insight({
      key: "missing-settings",
      type: "onboarding_setup",
      priority: "medium",
      title: "CRM settings are not fully configured",
      summary: "The mini-brain could not find a complete CRM settings record.",
      reasoning: ["Settings define workspace goals, provider state, and safe automation defaults."],
      recommendedAction: "Open settings and complete the CRM setup fields.",
      actionType: "fix_setup",
      relatedRecords: [],
      confidence: 0.7,
      trend: "unknown",
    }));
  }

  return insights;
}

```

## .\lib\intelligence\staffIntelligence.ts

```
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function staffInsights(_context: MiniBrainContext): MiniBrainInsight[] {
  return [];
}

```

## .\lib\onboarding\industryTemplates.ts

```
export {};
export const industryTemplates: Record<string, any> = {
  hvac: {
    crm: "Service CRM",
    modules: [
      "Dispatch",
      "Technicians",
      "Estimates",
      "Invoices",
      "Service Agreements",
      "SMS Followups",
    ],
  },

  roofing: {
    crm: "Roofing CRM",
    modules: [
      "Insurance Claims",
      "Estimates",
      "Lead Tracking",
      "Photos",
      "Contracts",
    ],
  },

  ecommerce: {
    crm: "Ecommerce CRM",
    modules: [
      "Orders",
      "Abandoned Cart",
      "Inventory",
      "Customer Support",
      "Email Marketing",
    ],
  },

  agency: {
    crm: "Agency CRM",
    modules: [
      "Clients",
      "Projects",
      "Campaigns",
      "Analytics",
      "Reporting",
    ],
  },

  healthcare: {
    crm: "Healthcare CRM",
    modules: [
      "Appointments",
      "Patients",
      "HIPAA Messaging",
      "Reminders",
    ],
  },
};

```

## .\lib\security\requireWorkspaceAccess.ts

```
import { NextResponse } from "next/server";
import {
  getWorkspaceContext,
  type WorkspaceContext,
} from "@/lib/auth/getWorkspaceContext";
import {
  hasPermission,
  missingPermissionMessage,
  type CRMPermission,
} from "@/lib/security/permissions";

export async function requireWorkspaceAccess(
  request: Request,
  permission?: CRMPermission
): Promise<
  | { ok: true; context: WorkspaceContext }
  | { ok: false; response: NextResponse }
> {
  const context = await getWorkspaceContext(request);

  if (!context.isAuthenticated) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error:
            "Authentication is required for this CRM action. Sign in and retry.",
          workspace_warnings: context.warnings,
        },
        { status: 401 }
      ),
    };
  }

  if (!context.isScoped) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: "No workspace context was available for this CRM request.",
          workspace_warnings: context.warnings,
        },
        { status: 403 }
      ),
    };
  }

  if (permission && !hasPermission(context, permission)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: missingPermissionMessage(permission),
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, context };
}

```

## .\lib\simulation\testWorkspaceSeed.ts

```
import crypto from "crypto";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

export const SIMULATION_VERSION = "2026-05-19";
const SIMULATION_SOURCE = "synaptireach_test_workspace";
const DEFAULT_TEST_EMAIL = "donovan.mike966@gmail.com";

type SimulationProfile = "quiet" | "normal" | "high_growth";

type SimulationAuth = {
  allowed: boolean;
  setupRequired?: boolean;
  workspaceId?: string | null;
  companyId?: string | null;
  userId?: string | null;
  reason?: string;
};

const mutableTables = [
  "crm_test_simulation_events",
  "crm_test_simulation_snapshots",
  "crm_test_simulation_settings",
  "crm_test_simulation_state",
  "crm_billing_events",
  "crm_credit_pack_purchases",
  "crm_usage_events",
  "crm_billing_accounts",
  "crm_provider_connections",
  "crm_audit_logs",
  "crm_service_orders",
  "crm_service_requests",
  "waitlist_signups",
  "contact_submissions",
  "crm_notifications",
  "crm_agent_runs",
  "crm_ai_recommendations",
  "marketing_ai_recommendations",
  "crm_workflow_runs",
  "crm_workflows",
  "crm_messages",
  "crm_conversations",
  "communications",
  "marketing_events",
  "marketing_interactions",
  "marketing_campaign_logs",
  "marketing_campaign_steps",
  "marketing_campaigns",
  "crm_appointments",
  "crm_tasks",
  "crm_deals",
  "lead_activities",
  "leads",
  "crm_staff_permissions",
  "crm_staff",
  "crm_roles",
  "crm_settings",
];

function envList(name: string) {
  return (process.env[name] || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function testWorkspaceIds() {
  return envList("CRM_TEST_WORKSPACE_IDS");
}

function testAccountEmails() {
  return envList("CRM_TEST_ACCOUNT_EMAILS");
}

function simulationEnabled() {
  return process.env.CRM_ENABLE_TEST_SIMULATION === "true" || testWorkspaceIds().length > 0 || testAccountEmails().length > 0;
}

function hashUuid(input: string) {
  const hex = crypto.createHash("md5").update(input).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${((parseInt(hex.slice(16, 18), 16) & 0x3f) | 0x80).toString(16)}${hex.slice(18, 20)}-${hex.slice(20, 32)}`;
}

async function findAuthUserByEmail(supabase: ReturnType<typeof createSupabaseAdmin>, email: string) {
  const normalized = email.toLowerCase();
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = data.users.find((user) => user.email?.toLowerCase() === normalized);
    if (found) return found;
    if (data.users.length < 1000) break;
  }
  return null;
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days: number, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function testMeta(extra: Record<string, any> = {}) {
  return {
    is_test_data: true,
    simulation_source: SIMULATION_SOURCE,
    simulation_version: SIMULATION_VERSION,
    generated_at: new Date().toISOString(),
    ...extra,
  };
}

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

async function requireSimulationAccess(request: Request, body?: any): Promise<SimulationAuth> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      allowed: false,
      setupRequired: true,
      reason: "Supabase service credentials are required for test simulation controls.",
    };
  }

  const url = new URL(request.url);
  const requestedWorkspaceId =
    body?.workspace_id ||
    body?.workspaceId ||
    request.headers.get("x-workspace-id") ||
    url.searchParams.get("workspace_id") ||
    url.searchParams.get("workspaceId");
  const requestedCompanyId =
    body?.company_id ||
    body?.companyId ||
    request.headers.get("x-company-id") ||
    url.searchParams.get("company_id") ||
    url.searchParams.get("companyId");
  const providedSecret =
    body?.seed_secret ||
    body?.secret ||
    request.headers.get("x-simulation-secret") ||
    url.searchParams.get("secret");
  const configuredSecret = process.env.CRM_TEST_SIMULATION_SEED_SECRET || "";
  const allowedWorkspaceIds = testWorkspaceIds();
  const allowedEmails = testAccountEmails();

  let context = null;
  try {
    context = await getWorkspaceContext(request);
  } catch {
    context = null;
  }

  const defaultEmailWorkspaceId =
    allowedEmails.length === 1 ? hashUuid(`test-workspace:${allowedEmails[0]}`) : null;
  const workspaceId =
    requestedWorkspaceId ||
    context?.workspaceId ||
    allowedWorkspaceIds[0] ||
    defaultEmailWorkspaceId ||
    null;
  const companyId = requestedCompanyId || context?.companyId || null;
  const secretAllowed = Boolean(configuredSecret && providedSecret && providedSecret === configuredSecret);
  const workspaceAllowed = Boolean(
    context?.isAuthenticated &&
      workspaceId &&
      allowedWorkspaceIds.includes(String(workspaceId).toLowerCase())
  );
  let emailAllowed = false;

  if (!secretAllowed && !workspaceAllowed && context?.userId && allowedEmails.length > 0) {
    try {
      const admin = createSupabaseAdmin();
      const { data } = await admin.auth.admin.getUserById(context.userId);
      const email = data?.user?.email?.toLowerCase();
      emailAllowed = Boolean(email && allowedEmails.includes(email));
    } catch {
      emailAllowed = false;
    }
  }

  if (!simulationEnabled()) {
    return {
      allowed: false,
      setupRequired: true,
      workspaceId,
      companyId,
      userId: context?.userId || null,
      reason: "Set CRM_ENABLE_TEST_SIMULATION=true and CRM_TEST_WORKSPACE_IDS to enable the isolated test workspace.",
    };
  }

  if (!workspaceId) {
    return {
      allowed: false,
      setupRequired: true,
      reason: "Set CRM_TEST_WORKSPACE_IDS or pass a configured workspace_id.",
    };
  }

  if (!secretAllowed && !workspaceAllowed && !emailAllowed) {
    return {
      allowed: false,
      workspaceId,
      companyId,
      userId: context?.userId || null,
      reason: "Simulation controls are restricted to configured CRM_TEST_WORKSPACE_IDS or the seed secret.",
    };
  }

  return {
    allowed: true,
    workspaceId,
    companyId,
    userId: context?.userId || body?.user_id || body?.userId || null,
  };
}

async function upsertRows(supabase: ReturnType<typeof createSupabaseAdmin>, table: string, rows: any[]) {
  if (rows.length === 0) return 0;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw error;
  return rows.length;
}

function makeLeads(workspaceId: string, companyId: string | null, userId: string | null) {
  const first = ["Avery", "Jordan", "Morgan", "Riley", "Taylor", "Casey", "Parker", "Quinn", "Hayden", "Reese", "Cameron", "Drew"];
  const last = ["Stone", "Miller", "Hayes", "Patel", "Brooks", "Rivera", "Kim", "Carter", "Reed", "Coleman", "Nguyen", "Bennett"];
  const industries = ["roofing", "HVAC", "legal", "healthcare", "real estate", "med spa", "dental", "home services", "agency", "ecommerce", "consulting"];
  const sources = ["website", "referral", "Google Business Profile", "Facebook", "Instagram", "LinkedIn", "paid ads", "cold outreach", "CSV import", "webinar/event", "contact form", "waitlist"];
  const statuses = ["new", "contacted", "qualified", "nurture", "converted", "lost", "archived"];
  return Array.from({ length: 84 }, (_, index) => {
    const name = `${pick(first, index)} ${pick(last, index * 3)}`;
    const industry = pick(industries, index);
    const status = pick(statuses, index + Math.floor(index / 7));
    const score = Math.min(99, 18 + ((index * 13) % 82));
    const temperature = score >= 75 ? "hot" : score >= 45 ? "warm" : "cold";
    return {
      id: hashUuid(`${workspaceId}:lead:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.test`,
      phone: `+1555${String(1000000 + index * 7919).slice(0, 7)}`,
      company: `${pick(["Northstar", "Summit", "Clearline", "LaunchLab", "BluePeak", "Vertex", "Cedar"], index)} ${pick(["Group", "Systems", "Partners", "Studio", "Clinic", "Services"], index + 2)}`,
      source: pick(sources, index),
      status,
      score,
      tags: [industry, temperature, pick(["priority", "demo", "retargeting", "needs-review"], index)],
      notes: `Simulated ${temperature} ${industry} lead. ${index % 11 === 0 ? "Looks similar to another lead for duplicate review." : "Ready for normal CRM review."}`,
      last_interaction: daysAgo((index * 2) % 42),
      archived: status === "archived",
      imported: index % 9 === 0,
      created_at: daysAgo((index * 3) % 60),
      updated_at: daysAgo((index * 2) % 25),
      ai_score_explanation: `Rule-based score ${score}: ${temperature} intent, ${pick(sources, index)} source, recent activity weighting.`,
      metadata: testMeta({
        lead_id: `SIM-LEAD-${index + 1}`,
        industry,
        temperature,
        target_need: pick(["more booked consultations", "faster follow-up", "pipeline cleanup", "campaign launch", "review generation"], index),
      }),
    };
  });
}

function makeStaff(workspaceId: string, companyId: string | null, userId: string | null) {
  return ["Owner", "Sales Manager", "Marketing Lead", "Service Coordinator", "AI Reviewer", "Support Rep"].map((title, index) => ({
    id: hashUuid(`${workspaceId}:staff:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: index === 0 ? userId : null,
    name: ["Nina Park", "Marcus Lee", "Elena Brooks", "Theo Martin", "Priya Shah", "Sam Carter"][index],
    email: `demo.staff.${index + 1}@example.test`,
    phone: `+15559876${index}${index}`,
    status: "active",
    title,
    metadata: testMeta({ role: title }),
  }));
}

function makeDeals(workspaceId: string, companyId: string | null, userId: string | null, leads: any[]) {
  const stages = ["new", "discovery", "proposal", "negotiation", "won", "lost"];
  return Array.from({ length: 32 }, (_, index) => {
    const lead = leads[index % leads.length];
    const stage = pick(stages, index);
    const value = 1500 + ((index * 2250) % 48000);
    const probability = stage === "won" ? 100 : stage === "lost" ? 0 : [15, 30, 55, 75][index % 4];
    return {
      id: hashUuid(`${workspaceId}:deal:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      lead_id: lead.id,
      title: `${lead.company} ${pick(["Launch System", "Growth Engine", "Automation Setup", "AI CRM Rollout"], index)}`,
      company: lead.company,
      value,
      stage,
      status: stage === "won" ? "won" : stage === "lost" ? "lost" : "open",
      probability,
      expected_close_date: daysFromNow((index % 19) - 6, 14),
      notes: index % 6 === 0 ? "Stale simulated deal that should trigger pipeline risk review." : "Simulated active opportunity.",
      archived: false,
      created_at: daysAgo((index * 4) % 70),
      updated_at: daysAgo(index % 9),
      metadata: testMeta({ weighted_value: Math.round(value * probability / 100), stale: index % 6 === 0 }),
    };
  });
}

function makeTasks(workspaceId: string, companyId: string | null, userId: string | null, leads: any[], deals: any[], staff: any[]) {
  const titles = ["Follow up with hot lead", "Review campaign draft", "Call proposal stakeholder", "Clean duplicate lead", "Prepare service quote", "Approve AI recommendation", "Assign onboarding checklist"];
  return Array.from({ length: 64 }, (_, index) => {
    const status = index % 5 === 0 ? "completed" : "open";
    return {
      id: hashUuid(`${workspaceId}:task:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      lead_id: leads[index % leads.length].id,
      deal_id: deals[index % deals.length].id,
      title: `${pick(titles, index)} #${index + 1}`,
      details: "Simulated task for CRM workflow, follow-up, service delivery, or AI review testing.",
      status,
      priority: pick(["low", "medium", "high", "urgent"], index),
      assigned_to: staff[index % staff.length].name,
      assigned_staff_id: staff[index % staff.length].id,
      due_date: status === "completed" ? daysAgo(index % 10) : daysFromNow((index % 18) - 8, 9),
      completed_at: status === "completed" ? daysAgo(index % 8) : null,
      created_at: daysAgo(index % 35),
      updated_at: daysAgo(index % 12),
      metadata: testMeta({ recommendation_source: index % 4 === 0 ? "mini_brain" : "manual" }),
    };
  });
}

function makeCampaigns(workspaceId: string, companyId: string | null, userId: string | null) {
  const types = ["email", "sms", "social", "landing_page", "retargeting", "nurture"];
  const statuses = ["draft", "scheduled", "active", "sent", "cancelled"];
  return Array.from({ length: 22 }, (_, index) => {
    const delivered = 80 + index * 17;
    const opened = Math.round(delivered * (0.18 + (index % 5) * 0.07));
    const clicked = Math.round(opened * (0.07 + (index % 4) * 0.04));
    return {
      id: hashUuid(`${workspaceId}:campaign:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      name: `${pick(["Spring", "Launch", "Winback", "Referral", "No-show", "Review"], index)} ${pick(types, index)} campaign`,
      type: pick(types, index),
      status: pick(statuses, index),
      delivered_count: delivered,
      opened_count: opened,
      clicked_count: clicked,
      converted_count: Math.round(clicked * (index % 3 === 0 ? 0.28 : 0.11)),
      ai_generated: index % 3 === 0,
      campaign_mode: "review_gated",
      send_date: daysFromNow((index % 12) - 5, 11),
      send_time: daysFromNow((index % 12) - 5, 11),
      scheduled_for: daysFromNow((index % 12) - 5, 11),
      audience: pick(["Hot leads", "Nurture segment", "Opened not clicked", "Lost deals", "Waitlist"], index),
      stagger: 50,
      stagger_size: 50,
      subject: `${pick(["Ready to grow?", "Quick follow-up", "Your CRM plan", "Still interested?"], index)} [Simulation]`,
      content: "Simulated review-gated campaign body for QA and demo workflows.",
      body: "Simulated review-gated campaign body for QA and demo workflows.",
      platforms: ["linkedin", "facebook"],
      created_at: daysAgo(index * 2),
      metadata: testMeta({ unsubscribed_count: index % 4, failed_count: index % 3 }),
    };
  });
}

function makeAppointments(workspaceId: string, companyId: string | null, userId: string | null, leads: any[], deals: any[]) {
  const statuses = ["scheduled", "completed", "cancelled", "no_show", "proposed"];
  return Array.from({ length: 26 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:appointment:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    lead_id: leads[index % leads.length].id,
    deal_id: deals[index % deals.length].id,
    title: `${pick(["Discovery Call", "Proposal Review", "CRM Setup Session", "Campaign Planning"], index)} with ${leads[index % leads.length].company}`,
    starts_at: daysFromNow((index % 18) - 7, 10 + (index % 5)),
    ends_at: daysFromNow((index % 18) - 7, 11 + (index % 5)),
    status: pick(statuses, index),
    location: index % 2 === 0 ? "Video consultation" : "Phone call",
    notes: "Simulated appointment for calendar and intent-detection testing.",
    created_at: daysAgo(index % 30),
    updated_at: daysAgo(index % 11),
    metadata: testMeta({ intent_detected: index % 4 === 0 }),
  }));
}

function makeCommunications(workspaceId: string, companyId: string | null, userId: string | null, leads: any[], campaigns: any[]) {
  const conversations = leads.slice(0, 26).map((lead, index) => ({
    id: hashUuid(`${workspaceId}:conversation:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    lead_id: lead.id,
    campaign_id: campaigns[index % campaigns.length].id,
    subject: `${pick(["Consultation", "Proposal", "Follow-up", "Campaign question"], index)} - ${lead.company}`,
    channel: pick(["email", "sms"], index),
    status: index % 7 === 0 ? "needs_response" : "open",
    latest_message_preview: index % 5 === 0 ? "Can we schedule a call this week?" : "Thanks, send more details.",
    latest_message_at: daysAgo(index % 12),
    unread_count: index % 4 === 0 ? 1 : 0,
    created_at: daysAgo(index + 8),
    updated_at: daysAgo(index % 9),
    metadata: testMeta({ appointment_intent: index % 5 === 0 }),
  }));
  const communications = Array.from({ length: 90 }, (_, index) => {
    const lead = leads[index % leads.length];
    const conversation = conversations[index % conversations.length];
    const direction = index % 3 === 0 ? "inbound" : index % 7 === 0 ? "internal" : "outbound";
    const channel = direction === "internal" ? "note" : pick(["email", "sms"], index);
    return {
      id: hashUuid(`${workspaceId}:communication:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      lead_id: lead.id,
      campaign_id: campaigns[index % campaigns.length].id,
      conversation_id: conversation.id,
      channel,
      direction,
      recipient: lead.email,
      subject: channel === "email" ? `Re: ${conversation.subject}` : null,
      content: index % 5 === 0 ? "Can we book a time to talk this week?" : "Simulated CRM conversation message for review-gated communication testing.",
      status: index % 13 === 0 ? "failed" : index % 11 === 0 ? "draft" : "sent",
      created_at: daysAgo(index % 26),
      updated_at: daysAgo(index % 13),
      metadata: testMeta({ rule_based_draft: index % 11 === 0, requires_response: direction === "inbound" && index % 4 === 0 }),
    };
  });
  const messages = communications.map((item, index) => ({
    id: hashUuid(`${workspaceId}:message:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    conversation_id: item.conversation_id,
    lead_id: item.lead_id,
    campaign_id: item.campaign_id,
    channel: item.channel,
    direction: item.direction,
    subject: item.subject,
    content: item.content,
    status: item.status,
    created_at: item.created_at,
    updated_at: item.updated_at,
    metadata: item.metadata,
  }));
  return { conversations, communications, messages };
}

function makeWorkflows(workspaceId: string, companyId: string | null, userId: string | null) {
  const names = [
    "New lead follow-up workflow",
    "Missed follow-up reminder",
    "Opened-not-clicked campaign follow-up",
    "High-intent lead alert",
    "Appointment confirmation workflow",
    "No-show follow-up workflow",
    "Stale deal recovery workflow",
    "Waitlist invite workflow",
    "Failed payment recovery workflow",
    "AI recommendation review workflow",
    "Conversation unanswered reminder workflow",
    "Duplicate lead review workflow",
  ];
  const workflows = names.map((name, index) => ({
    id: hashUuid(`${workspaceId}:workflow:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    name,
    status: pick(["active", "active", "paused", "draft"], index),
    trigger_type: pick(["lead_created", "campaign_opened", "appointment_status", "deal_stale", "ai_recommendation"], index),
    condition: "Simulation rule condition",
    action: "Create review-gated task, notification, or draft.",
    actions: [{ type: "create_task", review_required: true }],
    last_run_at: daysAgo(index % 8),
    success_count: 2 + index,
    failure_count: index % 4 === 0 ? 1 : 0,
    created_at: daysAgo(index + 14),
    updated_at: daysAgo(index % 5),
    metadata: testMeta({ summary: "Simulated workflow template with review-gated actions." }),
  }));
  const runs = Array.from({ length: 34 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:workflow-run:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    workflow_id: workflows[index % workflows.length].id,
    status: index % 9 === 0 ? "failed" : "completed",
    started_at: daysAgo(index % 18),
    completed_at: index % 9 === 0 ? null : daysAgo(index % 18),
    logs: [{ message: "Simulation workflow evaluated CRM signal.", review_required: true }],
    error: index % 9 === 0 ? "Simulated failed run for alert testing." : null,
    metadata: testMeta({ signal: pick(["hot_lead", "stale_deal", "overdue_task", "inbound_reply"], index) }),
  }));
  return { workflows, runs };
}

function makeRecommendations(workspaceId: string, companyId: string | null, userId: string | null, leads: any[], campaigns: any[]) {
  const types = ["lead_scoring", "follow_up", "campaign_optimization", "workflow", "task", "appointment", "pipeline_risk", "billing_usage"];
  const statuses = ["pending", "approved", "denied", "dismissed", "converted_to_task", "converted_to_workflow"];
  const crm = Array.from({ length: 18 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:crm-rec:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    type: pick(types, index),
    title: `${pick(["Review hot lead", "Recover stale deal", "Approve campaign variant", "Create follow-up task", "Watch cap usage"], index)} #${index + 1}`,
    description: "Rule-based simulation recommendation generated without external AI calls.",
    action: pick(["review_lead", "review_pipeline", "create_variant", "review_tasks", "open_billing"], index),
    status: pick(statuses, index),
    confidence: 0.68 + ((index % 6) / 20),
    created_at: daysAgo(index % 16),
    updated_at: daysAgo(index % 7),
    metadata: testMeta({ provider: "mini_brain", lead_id: leads[index % leads.length].id }),
  }));
  const marketing = Array.from({ length: 14 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:marketing-rec:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    campaign_id: campaigns[index % campaigns.length].id,
    recommendation_type: "campaign_optimization",
    priority: pick(["medium", "high", "urgent"], index),
    title: `${pick(["Improve CTA", "Retarget openers", "Pause weak SMS", "Test subject line"], index)} #${index + 1}`,
    description: "Simulated marketing recommendation for approval/deny testing.",
    estimated_impact: `${8 + index}% estimated engagement lift`,
    accepted: index % 5 === 0,
    dismissed: index % 6 === 0,
    status: index % 5 === 0 ? "approved" : index % 6 === 0 ? "dismissed" : "pending_review",
    created_at: daysAgo(index % 12),
    updated_at: daysAgo(index % 6),
    metadata: testMeta({ provider: "mini_brain" }),
  }));
  const agentRuns = Array.from({ length: 18 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:agent-run:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    agent: pick(["executive", "workflow", "lead_scoring", "campaign_optimization", "task_recommendation", "pipeline_risk"], index),
    status: index % 11 === 0 ? "failed" : "completed",
    summary: { headline: "Simulation agent reviewed CRM signals", signals_reviewed: 12 + index },
    recommendations: crm.slice(index % 5, (index % 5) + 3),
    actions: [{ type: "review_required", label: "Review recommendation" }],
    confidence: 0.72,
    data_used: { leads: leads.length, campaigns: campaigns.length },
    provider: "mini_brain",
    model: "deterministic-rules",
    fallback_used: true,
    provider_errors: [],
    error: index % 11 === 0 ? "Simulated provider failure, mini-brain fallback used." : null,
    created_at: daysAgo(index % 10),
  }));
  return { crm, marketing, agentRuns };
}

function makeOperationalRows(workspaceId: string, companyId: string | null, userId: string | null, leads: any[]) {
  const notifications = Array.from({ length: 24 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:notification:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    title: pick(["Hot lead detected", "Overdue task", "New inbound reply", "Campaign ready for review", "Usage cap warning", "Trial ending soon"], index),
    message: "Simulated notification for dropdown, badge, and mark-read testing.",
    type: pick(["lead", "task", "communication", "campaign", "billing", "trial"], index),
    priority: pick(["normal", "high", "urgent"], index),
    status: index % 3 === 0 ? "read" : "unread",
    record_type: pick(["leads", "crm_tasks", "communications", "marketing_campaigns", "crm_usage_events"], index),
    record_id: leads[index % leads.length].id,
    href: pick(["/dashboard/leads", "/dashboard/tasks", "/dashboard/communications", "/dashboard/marketing", "/dashboard/settings"], index),
    read_at: index % 3 === 0 ? daysAgo(index % 7) : null,
    created_at: daysAgo(index % 15),
    updated_at: daysAgo(index % 8),
    metadata: testMeta(),
  }));
  const usage = ["ai_tokens", "emails", "sms", "contacts", "workflow_runs", "agent_runs"].map((type, index) => ({
    id: hashUuid(`${workspaceId}:usage:${type}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    usage_type: type,
    quantity: [4200, 1850, 240, 84, 96, 42][index],
    source: "test_simulation",
    metadata: testMeta({ percent_used: [42, 61, 72, 84, 33, 55][index], cap_warning: index === 3 }),
    created_at: daysAgo(index),
  }));
  const services = ["Launch System", "Growth Engine", "Automation System", "Authority Builder", "Conversion Engine", "Full Business System", "Growth Ops", "Scale Ops", "Elite Ops"].map((item, index) => ({
    id: hashUuid(`${workspaceId}:service-request:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    service_type: index < 6 ? "bundle" : "retainer",
    item_name: item,
    price_cents: [59900, 99900, 149900, 179900, 249900, 499900, 59900, 99900, 199900][index],
    recurring: index >= 6,
    status: pick(["requested", "consultation_required", "quoted", "approved", "completed", "canceled"], index),
    requested_at: daysAgo(index + 1),
    consultation_required: true,
    metadata: testMeta({ test_only_service_request: true }),
    created_at: daysAgo(index + 1),
    updated_at: daysAgo(index % 4),
  }));
  const waitlist = Array.from({ length: 8 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:waitlist:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    full_name: `Waitlist Contact ${index + 1}`,
    business_name: `Cohort Candidate ${index + 1}`,
    work_email: `waitlist.${index + 1}@example.test`,
    phone: `+1555444${index}${index}${index}${index}`,
    industry: pick(["roofing", "legal", "med spa", "dental", "home services"], index),
    website: "https://example.test",
    business_size: pick(["1-5", "6-20", "21-50"], index),
    desired_plan: pick(["BYOK Growth", "Managed Growth", "Managed Scale"], index),
    billing_preference: pick(["byok", "managed"], index),
    main_goal: "Launch cohort simulation.",
    urgency: pick(["this_week", "this_month", "exploring"], index),
    services_interested: ["Growth Engine"],
    consent_to_contact: true,
    waitlist_position: index + 1,
    founding_cohort_eligible: index < 5,
    status: pick(["pending", "invited", "accepted", "deferred"], index),
    metadata: testMeta(),
    created_at: daysAgo(index + 2),
    updated_at: daysAgo(index),
  }));
  const contacts = Array.from({ length: 6 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:contact:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    name: `Service Inquiry ${index + 1}`,
    email: `contact.${index + 1}@example.test`,
    phone: `+1555333${index}${index}${index}${index}`,
    company: `Inquiry Co ${index + 1}`,
    message: "Simulated contact form inquiry for admin/contact testing.",
    source: pick(["/services", "/contact", "/pricing"], index),
    status: pick(["new", "reviewed", "followed_up"], index),
    metadata: testMeta({ selected_service: pick(["Growth Engine", "CRM Setup", "AI Funnel Optimization"], index) }),
    created_at: daysAgo(index + 3),
  }));
  return { notifications, usage, services, waitlist, contacts };
}

export async function getTestSimulationStatus(request: Request, body?: any) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("crm_test_simulation_state")
    .select("*")
    .eq("workspace_id", auth.workspaceId)
    .maybeSingle();

  if (error) {
    const friendly = friendlySupabaseError(error);
    return { ...auth, allowed: false, setupRequired: friendly.missingSchema, reason: friendly.message };
  }

  return {
    ...auth,
    enabled: true,
    seeded: Boolean(data?.seeded_at),
    state: data || null,
    simulationVersion: SIMULATION_VERSION,
  };
}

export async function resetTestWorkspace(request: Request, body?: any) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;

  const supabase = createSupabaseAdmin();
  for (const table of mutableTables) {
    const { error } = await supabase.from(table).delete().eq("workspace_id", auth.workspaceId);
    if (error) throw error;
  }
  await supabase.from("workspaces").update({
    is_test_workspace: true,
    simulation_enabled: false,
    simulation_profile: null,
  }).eq("id", auth.workspaceId);

  return { ...auth, reset: true };
}

export async function seedTestWorkspace(request: Request, body: any = {}) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;

  const supabase = createSupabaseAdmin();
  const workspaceId = auth.workspaceId!;
  const companyId = auth.companyId || hashUuid(`${workspaceId}:company`);
  const userId = auth.userId || body.user_id || null;
  const profile = (body.profile || process.env.CRM_TEST_SIMULATION_PROFILE || "normal") as SimulationProfile;
  const now = new Date().toISOString();

  const { data: existingWorkspace, error: existingWorkspaceError } = await supabase
    .from("workspaces")
    .select("id, company_id, owner_id, is_test_workspace, simulation_enabled")
    .eq("id", workspaceId)
    .maybeSingle();

  if (existingWorkspaceError) throw existingWorkspaceError;

  if (!existingWorkspace?.is_test_workspace) {
    return {
      ...auth,
      allowed: false,
      setupRequired: true,
      reason:
        "Run POST /api/test/simulation/bootstrap first. Seed only runs for workspaces explicitly marked as test/simulation.",
    };
  }

  await supabase.from("workspaces").upsert({
    id: workspaceId,
    company_id: existingWorkspace.company_id || companyId,
    owner_id: existingWorkspace.owner_id || userId,
    name: "LaunchLab Demo Workspace",
    industry: "multi-industry CRM simulation",
    business_type: "SynaptiReach test workspace",
    plan_tier: "managed_growth_test",
    billing_mode: "synaptireach_managed_test",
    trial_started_at: daysAgo(6),
    trial_ends_at: daysFromNow(8, 9),
    usage_caps: { ai: 10000, email: 3000, sms: 500, contacts: 1000, workflows: 250 },
    is_test_workspace: true,
    simulation_enabled: true,
    simulation_profile: profile,
    updated_at: now,
  }, { onConflict: "id" });

  const effectiveCompanyId = existingWorkspace.company_id || companyId;
  const effectiveUserId = existingWorkspace.owner_id || userId;
  const staff = makeStaff(workspaceId, effectiveCompanyId, effectiveUserId);
  const leads = makeLeads(workspaceId, effectiveCompanyId, effectiveUserId);
  const deals = makeDeals(workspaceId, effectiveCompanyId, effectiveUserId, leads);
  const tasks = makeTasks(workspaceId, effectiveCompanyId, effectiveUserId, leads, deals, staff);
  const campaigns = makeCampaigns(workspaceId, effectiveCompanyId, effectiveUserId);
  const appointments = makeAppointments(workspaceId, effectiveCompanyId, effectiveUserId, leads, deals);
  const communicationData = makeCommunications(workspaceId, effectiveCompanyId, effectiveUserId, leads, campaigns);
  const workflowData = makeWorkflows(workspaceId, effectiveCompanyId, effectiveUserId);
  const recData = makeRecommendations(workspaceId, effectiveCompanyId, effectiveUserId, leads, campaigns);
  const operational = makeOperationalRows(workspaceId, effectiveCompanyId, effectiveUserId, leads);

  const roles = [
    {
      id: hashUuid(`${workspaceId}:role:owner`),
      workspace_id: workspaceId,
      company_id: effectiveCompanyId,
      name: "Simulation Owner",
      description: "Full test workspace access.",
      permissions: ["*"],
      metadata: testMeta(),
    },
  ];
  const permissions = staff.flatMap((member) => ["dashboard:view", "leads:view", "tasks:view", "communications:view"].map((permission) => ({
    id: hashUuid(`${workspaceId}:perm:${member.id}:${permission}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    staff_id: member.id,
    permission,
    granted: true,
  })));
  const activities = leads.slice(0, 50).map((lead, index) => ({
    id: hashUuid(`${workspaceId}:activity:${index}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    lead_id: lead.id,
    type: pick(["note", "email", "sms", "stage_change", "score_update"], index),
    title: "Simulation lead activity",
    details: "Generated activity to populate lead detail timelines.",
    metadata: testMeta(),
    created_at: daysAgo(index % 28),
  }));
  const marketingEvents = campaigns.flatMap((campaign, index) => ["open", "click", "conversion", "unsubscribe"].map((eventType, eventIndex) => ({
    id: hashUuid(`${workspaceId}:marketing-event:${index}:${eventType}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    campaign_id: campaign.id,
    type: eventType,
    event_type: eventType,
    title: `Simulated campaign ${eventType}`,
    message: `${campaign.name} recorded ${eventType}`,
    action: eventType,
    details: "Simulated campaign activity row.",
    metadata: testMeta({ count: 3 + eventIndex + index }),
    created_at: daysAgo((index + eventIndex) % 18),
  })));
  const interactions = leads.slice(0, 40).map((lead, index) => ({
    id: hashUuid(`${workspaceId}:interaction:${index}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    campaign_id: campaigns[index % campaigns.length].id,
    lead_id: lead.id,
    interaction_type: pick(["open", "click", "reply", "conversion"], index),
    message: "Simulated marketing interaction.",
    metadata: testMeta(),
    created_at: daysAgo(index % 19),
  }));

  const billingAccount = {
    id: hashUuid(`${workspaceId}:billing-account`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    plan_tier: "managed_growth_test",
    billing_mode: "synaptireach_managed_test",
    status: "trial",
    stripe_customer_id: "cus_test_simulated_only",
    stripe_subscription_id: null,
    payment_method_reference: "simulation_only_no_charge",
    trial_started_at: daysAgo(6),
    trial_ends_at: daysFromNow(8, 9),
    metadata: testMeta({ test_account_bypass: true, no_real_charge: true }),
  };
  const settings = {
    id: hashUuid(`${workspaceId}:settings`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    business_name: "LaunchLab Demo Workspace",
    industry: "multi-industry growth operations",
    website: "https://demo.synaptireach.example",
    contact_email: "demo.owner@example.test",
    phone: "+15550101010",
    default_sender_name: "LaunchLab Demo",
    default_sender_email: "demo@example.test",
    timezone: "America/Chicago",
    brand_voice: "Clear, premium, practical, review-gated.",
    tone: "professional",
    cta_style: "consultation",
    audience_description: "Local service, professional services, ecommerce, and agency leads.",
    automation_level: "review_required",
    metadata: testMeta({
      target_customer: "growth-focused SMBs",
      offer: "AI CRM launch and automation system",
      services: ["CRM setup", "campaign execution", "workflow automation"],
      sales_cycle_days: 21,
    }),
  };

  const batches: Array<[string, any[]]> = [
    ["crm_settings", [settings]],
    ["crm_roles", roles],
    ["crm_staff", staff],
    ["crm_staff_permissions", permissions],
    ["leads", leads],
    ["lead_activities", activities],
    ["crm_deals", deals],
    ["crm_tasks", tasks],
    ["crm_appointments", appointments],
    ["marketing_campaigns", campaigns],
    ["marketing_events", marketingEvents],
    ["marketing_interactions", interactions],
    ["communications", communicationData.communications],
    ["crm_conversations", communicationData.conversations],
    ["crm_messages", communicationData.messages],
    ["crm_workflows", workflowData.workflows],
    ["crm_workflow_runs", workflowData.runs],
    ["crm_ai_recommendations", recData.crm],
    ["marketing_ai_recommendations", recData.marketing],
    ["crm_agent_runs", recData.agentRuns],
    ["crm_notifications", operational.notifications],
    ["crm_billing_accounts", [billingAccount]],
    ["crm_usage_events", operational.usage],
    ["crm_service_requests", operational.services],
    ["waitlist_signups", operational.waitlist],
    ["contact_submissions", operational.contacts],
    ["crm_provider_connections", [
      { id: hashUuid(`${workspaceId}:provider:resend`), workspace_id: workspaceId, company_id: effectiveCompanyId, user_id: effectiveUserId, provider: "resend", provider_type: "integration", status: "setup_required", key_label: "simulation masked", metadata: testMeta({ no_secret_stored: true }) },
      { id: hashUuid(`${workspaceId}:provider:twilio`), workspace_id: workspaceId, company_id: effectiveCompanyId, user_id: effectiveUserId, provider: "twilio", provider_type: "integration", status: "setup_required", key_label: "simulation masked", metadata: testMeta({ no_secret_stored: true }) },
      { id: hashUuid(`${workspaceId}:provider:gemini`), workspace_id: workspaceId, company_id: effectiveCompanyId, user_id: effectiveUserId, provider: "gemini", provider_type: "ai", status: "setup_required", key_label: "simulation masked", metadata: testMeta({ no_secret_stored: true }) },
    ]],
    ["crm_audit_logs", [
      { id: hashUuid(`${workspaceId}:audit:seed`), workspace_id: workspaceId, company_id: effectiveCompanyId, user_id: effectiveUserId, action: "test_simulation_seeded", resource_type: "workspace", resource_id: workspaceId, details: "Seeded isolated test workspace data.", metadata: testMeta() },
    ]],
  ];

  const counts: Record<string, number> = {};
  for (const [table, rows] of batches) counts[table] = await upsertRows(supabase, table, rows);

  const state = {
    id: hashUuid(`${workspaceId}:simulation-state`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    enabled: true,
    paused: false,
    simulation_day: Number(body.simulation_day || 1),
    simulation_profile: profile,
    simulation_version: SIMULATION_VERSION,
    seeded_at: now,
    last_tick_at: null,
    next_tick_at: daysFromNow(0, new Date().getHours() + 1),
    metadata: testMeta({ counts }),
  };
  await upsertRows(supabase, "crm_test_simulation_state", [state]);
  await upsertRows(supabase, "crm_test_simulation_settings", [{
    id: hashUuid(`${workspaceId}:simulation-settings`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    auto_tick: process.env.CRM_TEST_SIMULATION_AUTO_TICK === "true",
    tick_minutes: Number(process.env.CRM_TEST_SIMULATION_TICK_MINUTES || 60),
    simulation_profile: profile,
    settings: testMeta({ profile }),
  }]);
  await upsertRows(supabase, "crm_test_simulation_events", [{
    id: hashUuid(`${workspaceId}:simulation-event:seed:${SIMULATION_VERSION}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    simulation_day: state.simulation_day,
    event_type: "seed",
    title: "Test workspace seeded",
    details: "Seeded rich isolated CRM simulation data.",
    metadata: testMeta({ counts }),
  }]);

  return {
    ...auth,
    seeded: true,
    state,
    counts,
  };
}

export async function tickTestWorkspace(request: Request, body: any = {}) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;

  const supabase = createSupabaseAdmin();
  const workspaceId = auth.workspaceId!;
  const { data: state } = await supabase
    .from("crm_test_simulation_state")
    .select("*")
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (!state?.seeded_at) {
    return { ...auth, setupRequired: true, reason: "Seed the test workspace before running a simulation tick." };
  }
  if (state.paused) {
    return { ...auth, paused: true, reason: "Simulation is paused." };
  }

  const nextDay = Number(state.simulation_day || 0) + 1;
  const now = new Date().toISOString();
  const leadId = hashUuid(`${workspaceId}:lead:${nextDay % 84}`);
  const dealId = hashUuid(`${workspaceId}:deal:${nextDay % 32}`);
  const campaignId = hashUuid(`${workspaceId}:campaign:${nextDay % 22}`);
  const taskId = hashUuid(`${workspaceId}:task:${nextDay % 64}`);

  await supabase.from("leads").update({
    score: 75 + (nextDay % 20),
    status: nextDay % 3 === 0 ? "qualified" : "contacted",
    last_interaction: now,
    updated_at: now,
  }).eq("id", leadId).eq("workspace_id", workspaceId);
  await supabase.from("crm_deals").update({
    stage: pick(["discovery", "proposal", "negotiation", "won"], nextDay),
    probability: pick([35, 55, 75, 100], nextDay),
    updated_at: now,
  }).eq("id", dealId).eq("workspace_id", workspaceId);
  await supabase.from("crm_tasks").update({
    status: nextDay % 4 === 0 ? "completed" : "open",
    completed_at: nextDay % 4 === 0 ? now : null,
    updated_at: now,
  }).eq("id", taskId).eq("workspace_id", workspaceId);
  await supabase.from("marketing_campaigns").update({
    opened_count: 100 + nextDay * 7,
    clicked_count: 20 + nextDay * 3,
    converted_count: 4 + nextDay,
  }).eq("id", campaignId).eq("workspace_id", workspaceId);

  const event = {
    id: hashUuid(`${workspaceId}:simulation-event:tick:${nextDay}`),
    workspace_id: workspaceId,
    company_id: auth.companyId || state.company_id || null,
    user_id: auth.userId || state.user_id || null,
    simulation_day: nextDay,
    event_type: "tick",
    title: `Simulation day ${nextDay} advanced`,
    details: "Updated one lead, one deal, one task, one campaign, and added reviewable CRM signals.",
    metadata: testMeta({ lead_id: leadId, deal_id: dealId, campaign_id: campaignId, task_id: taskId }),
  };
  const notification = {
    id: hashUuid(`${workspaceId}:notification:tick:${nextDay}`),
    workspace_id: workspaceId,
    company_id: auth.companyId || state.company_id || null,
    user_id: auth.userId || state.user_id || null,
    title: "Simulation tick created new CRM signals",
    message: `Day ${nextDay}: hot lead, deal movement, campaign activity, and task update generated.`,
    type: "simulation",
    priority: "normal",
    status: "unread",
    href: "/dashboard",
    metadata: testMeta({ simulation_day: nextDay }),
  };
  const recommendation = {
    id: hashUuid(`${workspaceId}:crm-rec:tick:${nextDay}`),
    workspace_id: workspaceId,
    company_id: auth.companyId || state.company_id || null,
    user_id: auth.userId || state.user_id || null,
    type: "simulation_signal",
    title: `Review simulation day ${nextDay} changes`,
    description: "Mini-brain generated a reviewable action after deterministic CRM changes.",
    action: "review_dashboard",
    status: "pending",
    confidence: 0.76,
    metadata: testMeta({ simulation_day: nextDay, provider: "mini_brain" }),
  };

  await upsertRows(supabase, "crm_test_simulation_events", [event]);
  await upsertRows(supabase, "crm_notifications", [notification]);
  await upsertRows(supabase, "crm_ai_recommendations", [recommendation]);
  await supabase.from("crm_test_simulation_state").update({
    simulation_day: nextDay,
    last_tick_at: now,
    next_tick_at: daysFromNow(0, new Date().getHours() + 1),
    updated_at: now,
    metadata: { ...(state.metadata || {}), last_tick: event.metadata },
  }).eq("workspace_id", workspaceId);

  return {
    ...auth,
    ticked: true,
    simulation_day: nextDay,
    event,
  };
}

export async function pauseTestWorkspace(request: Request, paused: boolean, body: any = {}) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;
  const supabase = createSupabaseAdmin();
  await supabase.from("crm_test_simulation_state").update({ paused, updated_at: new Date().toISOString() }).eq("workspace_id", auth.workspaceId);
  await supabase.from("workspaces").update({ simulation_enabled: !paused }).eq("id", auth.workspaceId);
  return { ...auth, paused };
}

export async function bootstrapTestWorkspace(request: Request, body: any = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      allowed: false,
      setupRequired: true,
      reason: "Supabase service credentials are required to bootstrap the test workspace.",
    };
  }

  if (process.env.CRM_ENABLE_TEST_SIMULATION !== "true") {
    return {
      allowed: false,
      setupRequired: true,
      reason: "Set CRM_ENABLE_TEST_SIMULATION=true before bootstrapping the test workspace.",
    };
  }

  const requestedEmail = String(body.email || DEFAULT_TEST_EMAIL).trim().toLowerCase();
  const allowedEmails = testAccountEmails();

  if (allowedEmails.length === 0) {
    return {
      allowed: false,
      setupRequired: true,
      reason: `Set CRM_TEST_ACCOUNT_EMAILS=${DEFAULT_TEST_EMAIL} before bootstrapping the test workspace.`,
    };
  }

  if (!allowedEmails.includes(requestedEmail)) {
    return {
      allowed: false,
      reason: `Email ${requestedEmail} is not listed in CRM_TEST_ACCOUNT_EMAILS.`,
    };
  }

  const providedSecret =
    body.bootstrap_secret ||
    body.seed_secret ||
    body.secret ||
    request.headers.get("x-bootstrap-secret") ||
    request.headers.get("x-simulation-secret") ||
    new URL(request.url).searchParams.get("secret");
  const configuredSecret =
    process.env.CRM_TEST_BOOTSTRAP_SECRET ||
    process.env.CRM_TEST_SIMULATION_SEED_SECRET ||
    "";

  let authenticatedAllowedEmail = false;
  try {
    const context = await getWorkspaceContext(request);
    if (context.userId) {
      const admin = createSupabaseAdmin();
      const { data } = await admin.auth.admin.getUserById(context.userId);
      authenticatedAllowedEmail = data.user?.email?.toLowerCase() === requestedEmail;
    }
  } catch {
    authenticatedAllowedEmail = false;
  }

  if (!authenticatedAllowedEmail && (!configuredSecret || providedSecret !== configuredSecret)) {
    return {
      allowed: false,
      reason:
        "Bootstrap is protected. Provide CRM_TEST_BOOTSTRAP_SECRET or sign in as the allowed test account.",
    };
  }

  const supabase = createSupabaseAdmin();
  let authUser = await findAuthUserByEmail(supabase, requestedEmail);
  let userCreated = false;
  let passwordSet = false;
  const requestedPassword = String(body.password || body.test_password || "").trim();

  if (!authUser) {
    const password = requestedPassword || crypto.randomBytes(24).toString("base64url");
    const { data, error } = await supabase.auth.admin.createUser({
      email: requestedEmail,
      password,
      email_confirm: true,
      app_metadata: {
        test_account: true,
        simulation_source: SIMULATION_SOURCE,
        simulation_version: SIMULATION_VERSION,
      },
      user_metadata: {
        test_account: true,
        simulation_source: SIMULATION_SOURCE,
        simulation_version: SIMULATION_VERSION,
      },
    });
    if (error) throw error;
    authUser = data.user;
    userCreated = true;
    passwordSet = Boolean(requestedPassword);
  } else if (requestedPassword) {
    const { error } = await supabase.auth.admin.updateUserById(authUser.id, {
      password: requestedPassword,
      app_metadata: {
        ...(authUser.app_metadata || {}),
        test_account: true,
        simulation_source: SIMULATION_SOURCE,
        simulation_version: SIMULATION_VERSION,
      },
      user_metadata: {
        ...(authUser.user_metadata || {}),
        test_account: true,
        simulation_source: SIMULATION_SOURCE,
        simulation_version: SIMULATION_VERSION,
      },
    });
    if (error) throw error;
    passwordSet = true;
  }

  if (!authUser?.id) {
    throw new Error("Unable to create or find the test auth user.");
  }

  const envWorkspaceId = testWorkspaceIds()[0] || null;
  const workspaceId = body.workspace_id || body.workspaceId || envWorkspaceId || hashUuid(`test-workspace:${requestedEmail}`);
  const companyId = body.company_id || body.companyId || hashUuid(`test-company:${requestedEmail}`);
  const now = new Date().toISOString();
  const metadata = testMeta({
    test_account_email: requestedEmail,
    bootstrap_source: "api_test_simulation_bootstrap",
  });

  const { error: workspaceError } = await supabase.from("workspaces").upsert({
    id: workspaceId,
    company_id: companyId,
    owner_id: authUser.id,
    name: "LaunchLab Demo Workspace",
    industry: "multi-industry CRM simulation",
    business_type: "SynaptiReach test workspace",
    plan_tier: "managed_growth_test",
    billing_mode: "synaptireach_managed_test",
    trial_started_at: daysAgo(1),
    trial_ends_at: daysFromNow(13, 9),
    usage_caps: { ai: 10000, email: 3000, sms: 500, contacts: 1000, workflows: 250 },
    is_test_workspace: true,
    simulation_enabled: true,
    simulation_profile: body.profile || process.env.CRM_TEST_SIMULATION_PROFILE || "normal",
    updated_at: now,
  }, { onConflict: "id" });
  if (workspaceError) throw workspaceError;

  await supabase.from("workspace_members").upsert({
    id: hashUuid(`${workspaceId}:member:${authUser.id}`),
    workspace_id: workspaceId,
    user_id: authUser.id,
    role: "owner",
    status: "active",
    metadata,
    updated_at: now,
  }, { onConflict: "workspace_id,user_id" });

  await supabase.from("onboarding_sessions").upsert({
    id: hashUuid(`${workspaceId}:onboarding:${authUser.id}`),
    workspace_id: workspaceId,
    user_id: authUser.id,
    payload: {
      businessName: "LaunchLab Demo Workspace",
      industry: "multi-industry CRM simulation",
      services: ["CRM setup", "campaign execution", "workflow automation"],
      testSimulation: true,
    },
    completed: true,
    metadata,
    updated_at: now,
  }, { onConflict: "id" });

  await supabase.from("crm_settings").upsert({
    id: hashUuid(`${workspaceId}:settings`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: authUser.id,
    business_name: "LaunchLab Demo Workspace",
    industry: "multi-industry growth operations",
    website: "https://demo.synaptireach.example",
    contact_email: requestedEmail,
    phone: "+15550101010",
    default_sender_name: "LaunchLab Demo",
    default_sender_email: "demo@example.test",
    timezone: "America/Chicago",
    brand_voice: "Clear, premium, practical, review-gated.",
    tone: "professional",
    cta_style: "consultation",
    audience_description: "Local service, professional services, ecommerce, and agency leads.",
    automation_level: "review_required",
    metadata,
    updated_at: now,
  }, { onConflict: "id" });

  await supabase.from("crm_test_simulation_state").upsert({
    id: hashUuid(`${workspaceId}:simulation-state`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: authUser.id,
    enabled: true,
    paused: false,
    simulation_day: 0,
    simulation_profile: body.profile || process.env.CRM_TEST_SIMULATION_PROFILE || "normal",
    simulation_version: SIMULATION_VERSION,
    metadata,
    updated_at: now,
  }, { onConflict: "workspace_id" });

  await supabase.from("crm_test_simulation_events").upsert({
    id: hashUuid(`${workspaceId}:simulation-event:bootstrap:${SIMULATION_VERSION}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: authUser.id,
    simulation_day: 0,
    event_type: "bootstrap",
    title: "Test workspace bootstrapped",
    details: `Created or found test auth user/workspace for ${requestedEmail}.`,
    metadata,
  }, { onConflict: "id" });

  return {
    allowed: true,
    bootstrapped: true,
    user_created: userCreated,
    password_set: passwordSet,
    email: requestedEmail,
    user_id: authUser.id,
    workspace_id: workspaceId,
    company_id: companyId,
    env: {
      CRM_ENABLE_TEST_SIMULATION: "true",
      CRM_TEST_ACCOUNT_EMAILS: requestedEmail,
      CRM_TEST_WORKSPACE_IDS: workspaceId,
    },
    message: `Use CRM_TEST_WORKSPACE_IDS=${workspaceId} for this isolated test workspace.`,
  };
}

```

## .\lib\types\workspace.ts

```
export type Workspace = {
  id: string;
  created_at: string;
  name?: string;
  services?: any[];
};

```

## .\lib\workspace\bootstrapWorkspace.ts

```
export async function bootstrapWorkspace(data: unknown) {
  return { success: true, data };
}

```
