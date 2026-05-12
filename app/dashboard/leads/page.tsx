"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building2,
  User2,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

type Lead = {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
};

export default function LeadsPage() {
  const [loading, setLoading] =
    useState(true);

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    async function loadLeads() {

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        return;
      }

      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("owner_id", session.user.id)
        .order("created_at", {
          ascending: false,
        });

      setLeads(data || []);

      setLoading(false);
    }

    loadLeads();
  }, []);

  const filteredLeads =
    leads.filter((lead) => {

      const q =
        search.toLowerCase();

      return (
        lead.full_name
          ?.toLowerCase()
          .includes(q) ||

        lead.email
          ?.toLowerCase()
          .includes(q) ||

        lead.company
          ?.toLowerCase()
          .includes(q)
      );
    });

  return (
    <main className="min-h-screen text-white">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

        <div>

          <h1 className="text-4xl font-black mb-2">
            Leads Pipeline
          </h1>

          <p className="text-gray-500 text-lg">
            Real customer leads synced
            to your AI CRM workspace
          </p>

        </div>

        <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-black">

          <Plus size={18} />

          Add Lead

        </button>

      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

        <div className="lg:col-span-2 relative">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search leads..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-4 outline-none focus:border-cyan-400/40"
          />

        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">

          <Filter size={18} />

          Filters

        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-gray-500 text-sm mb-2">
            Total Leads
          </p>

          <h2 className="text-4xl font-black">
            {leads.length}
          </h2>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-gray-500 text-sm mb-2">
            Qualified
          </p>

          <h2 className="text-4xl font-black">
            {
              leads.filter(
                (l) =>
                  l.status ===
                  "qualified"
              ).length
            }
          </h2>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-gray-500 text-sm mb-2">
            Active Pipeline
          </p>

          <h2 className="text-4xl font-black">
            {
              leads.filter(
                (l) =>
                  l.status !==
                  "closed"
              ).length
            }
          </h2>

        </div>

      </div>

      {/* LEADS TABLE */}
      <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">

        <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">

          <div>

            <h3 className="text-xl font-black">
              Lead Database
            </h3>

            <p className="text-sm text-gray-500">
              Real synced CRM lead data
            </p>

          </div>

        </div>

        {loading ? (

          <div className="p-10 text-center text-gray-500">
            Loading leads...
          </div>

        ) : filteredLeads.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            No leads found
          </div>

        ) : (

          <div className="divide-y divide-white/10">

            {filteredLeads.map(
              (lead) => (

                <div
                  key={lead.id}
                  className="p-6 hover:bg-white/[0.03] transition-all"
                >

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-center">

                    {/* NAME */}
                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                        <User2
                          size={18}
                          className="text-cyan-300"
                        />

                      </div>

                      <div>

                        <p className="font-semibold">
                          {lead.full_name ||
                            "Unnamed Lead"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {lead.status ||
                            "new"}
                        </p>

                      </div>

                    </div>

                    {/* EMAIL */}
                    <div className="flex items-center gap-2 text-gray-300">

                      <Mail size={16} />

                      <span className="text-sm">
                        {lead.email ||
                          "No email"}
                      </span>

                    </div>

                    {/* PHONE */}
                    <div className="flex items-center gap-2 text-gray-300">

                      <Phone size={16} />

                      <span className="text-sm">
                        {lead.phone ||
                          "No phone"}
                      </span>

                    </div>

                    {/* COMPANY */}
                    <div className="flex items-center gap-2 text-gray-300">

                      <Building2 size={16} />

                      <span className="text-sm">
                        {lead.company ||
                          "No company"}
                      </span>

                    </div>

                    {/* STATUS */}
                    <div className="flex justify-start lg:justify-end">

                      <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-semibold">

                        {lead.status ||
                          "new"}

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}
