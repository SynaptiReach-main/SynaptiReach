"use client";

import { useEffect, useState } from "react";
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
    trialPath: "managed" as "managed" | "byok",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trial = params.get("trial");
    if (trial === "byok" || trial === "managed") {
      setForm((current) => ({ ...current, trialPath: trial }));
    }
  }, []);

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
      JSON.stringify({
        email: form.email,
        businessName: form.businessName,
        industry: form.industry,
        trialPath: form.trialPath,
      })
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

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["managed", "Managed Trial", "SynaptiReach-managed usage with hard trial caps."],
                ["byok", "BYOK Trial", "Use your own provider keys and pay providers directly."],
              ].map(([id, label, description]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm({ ...form, trialPath: id as "managed" | "byok" })}
                  className={`rounded-2xl border px-4 py-3 text-left ${form.trialPath === id ? "border-cyan-300/60 bg-cyan-300/10" : "border-white/10 bg-black/50"}`}
                >
                  <div className="font-black text-white">{label}</div>
                  <div className="mt-1 text-xs text-gray-400">{description}</div>
                </button>
              ))}
            </div>

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
