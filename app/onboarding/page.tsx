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
            {selected.includes(item) && <span className="mr-1 text-cyan-400">✓</span>}
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
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-black text-xs font-black">✓</div>
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
        <span className="text-white text-sm font-medium text-right max-w-xs truncate">{value || "—"}</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-12">
      {loading && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin mb-6" />
          <p className="text-xl font-black text-cyan-400">Building Your Workspace</p>
          <p className="text-gray-500 mt-2 text-sm">Initializing AI core systems…</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight">SynaptiReach Core Architect</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Step {step} of 7 — {STEP_TITLES[step]}
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
                    { id: "starter", name: "Starter", price: "$97/mo", desc: "Up to 500 contacts, core automation, 1 user" },
                    { id: "growth", name: "Growth", price: "$197/mo", desc: "Up to 2,500 contacts, full AI suite, 3 users" },
                    { id: "pro", name: "Pro", price: "$397/mo", desc: "Unlimited contacts, white-label, 10 users" },
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
                  <span className="text-gray-500">{industryOpen ? "▲" : "▼"}</span>
                </div>
                {industryOpen && (
                  <div className="absolute z-20 mt-1 w-full max-w-2xl rounded-2xl border border-white/10 bg-black/95 shadow-2xl overflow-hidden">
                    <div className="p-2 border-b border-white/10">
                      <input
                        autoFocus
                        type="text"
                        value={industrySearch}
                        onChange={(e) => setIndustrySearch(e.target.value)}
                        placeholder="Search industries…"
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
                  placeholder="Describe what your business offers…"
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
                  <span className="text-cyan-400 text-lg">📁</span>
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
                    quote: '"I noticed you haven\'t heard back from us — I wanted to personally check in."'
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
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-black text-xs font-black">✓</div>
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
                  {["Instant (<1 min)", "Quick (1–5 min)", "Thoughtful (5–15 min)"].map((rt) => (
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
                  <span className="text-cyan-400 text-lg">📊</span>
                  <span className="text-sm text-gray-400">{form.csvFile ? form.csvFile.name : "Click to upload CSV"}</span>
                  <input type="file" accept=".csv" className="hidden" onChange={(e) => set("csvFile", e.target.files?.[0] ?? null)} />
                </label>
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-300">Upload Supporting Documents (optional)</label>
                <label className="flex items-center gap-3 w-full p-3 rounded-xl bg-black/60 border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
                  <span className="text-cyan-400 text-lg">📎</span>
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
                    { id: "shared", label: "Shared API (Included)", desc: "Managed by SynaptiReach — no setup required" },
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
                        {form.apiStrategy === opt.id && <span className="text-cyan-400 text-sm">✓</span>}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {(form.apiStrategy === "own_keys" || form.apiStrategy === "hybrid") && (
                <div className="space-y-4 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-gray-400 mb-2">Keys are encrypted at rest and never exposed in the UI after saving.</p>
                  <InputField label="OpenAI API Key" value={form.openaiKey} onChange={(v) => set("openaiKey", v)} placeholder="sk-…" type="password" />
                  <InputField label="Anthropic Claude Key" value={form.claudeKey} onChange={(v) => set("claudeKey", v)} placeholder="sk-ant-…" type="password" />
                  <InputField label="Google Gemini Key" value={form.geminiKey} onChange={(v) => set("geminiKey", v)} placeholder="AIza…" type="password" />
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
                    <span className="text-white text-sm font-medium text-right max-w-xs truncate">{value || "—"}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-cyan-300">
                ⚡ Your workspace will be fully initialized with AI models trained on your business data. This typically takes 30–60 seconds.
              </div>

              <button
                type="button"
                onClick={buildWorkspace}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black text-lg transition-opacity disabled:opacity-50"
              >
                {loading ? "Building…" : "⚡ Build My Workspace"}
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
              ← Back
            </button>
          )}
          {step < 7 && (
            <button
              type="button"
              onClick={next}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black transition-opacity"
            >
              Continue →
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
