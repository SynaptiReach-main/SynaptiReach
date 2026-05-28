export {};
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setError(
          error?.message ||
            "Invalid email or password"
        );

        setLoading(false);
        return;
      }

      if (
        email ===
        "admin@synaptireach.com"
      ) {
        router.push(
          "/admin/dashboard"
        );

      } else if (
        email ===
        "portalstaff@synaptireach.com"
      ) {
        router.push(
          "/portal-staff/dashboard"
        );

      } else if (
        email ===
        "portal@synaptireach.com"
      ) {
        router.push(
          "/portal/dashboard"
        );

      } else if (
        email ===
        "staff@synaptireach.com"
      ) {
        router.push(
          "/staff/dashboard"
        );

      } else {
        const returnTo = new URLSearchParams(window.location.search).get("returnTo");
        router.push(returnTo && returnTo.startsWith("/") ? returnTo : "/dashboard");
      }

      router.refresh();

    } catch (err) {
      console.error(err);

      setError(
        "Unexpected login error"
      );

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">

      <div
        className="w-full max-w-md rounded-2xl p-8 flex flex-col gap-6"
        style={{
          background:
            "rgba(255,255,255,0.04)",

          border:
            "1px solid rgba(0,229,255,0.15)",

          backdropFilter:
            "blur(16px)",
        }}
      >

        <div className="text-center flex flex-col gap-1">

          <h1 className="text-2xl font-extrabold text-white">
            Welcome back
          </h1>

          <p className="text-sm text-[#B2EBF2]/70">
            Sign in to your SynaptiReach account
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >

          <div className="flex flex-col gap-1.5">

            <label className="text-xs font-semibold text-[#B2EBF2]/80 uppercase tracking-wider">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
              style={{
                background:
                  "rgba(255,255,255,0.06)",

                border:
                  "1px solid rgba(0,229,255,0.18)",
              }}
            />

          </div>

          <div className="flex flex-col gap-1.5">

            <label className="text-xs font-semibold text-[#B2EBF2]/80 uppercase tracking-wider">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
              style={{
                background:
                  "rgba(255,255,255,0.06)",

                border:
                  "1px solid rgba(0,229,255,0.18)",
              }}
            />

          </div>

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-[#0A0F1F]"
            style={{
              background:
                "linear-gradient(to right, #00FFFF, #00E676)",
            }}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>

        <p className="text-center text-sm text-[#B2EBF2]/60">

          Don&apos;t have an account?{" "}

          <Link
            href="/signup"
            className="text-[#00FFFF] font-semibold"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}
