"use client";

import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  Bell,
  Users,
} from "lucide-react";

export default function CommunicationsPage() {
  return (
    <main className="min-h-screen text-white">

      {/* HEADER */}
      <div className="mb-8">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs mb-4">
          <MessageSquare size={14} />
          Communications Hub
        </div>

        <h1 className="text-5xl font-black mb-4 leading-tight">
          Customer
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            {" "}Communications
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-3xl">
          Manage conversations, notifications, outreach,
          customer engagement, and live communication channels.
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        {[
          {
            title: "Messages Sent",
            value: "12,847",
            icon: Send,
          },
          {
            title: "Active Conversations",
            value: "284",
            icon: MessageSquare,
          },
          {
            title: "Email Campaigns",
            value: "42",
            icon: Mail,
          },
          {
            title: "Support Requests",
            value: "19",
            icon: Bell,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
            >

              <div className="flex items-center justify-between mb-6">

                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Icon
                    className="text-cyan-300"
                    size={20}
                  />
                </div>

              </div>

              <div className="text-3xl font-black mb-2">
                {item.value}
              </div>

              <div className="text-sm text-gray-400">
                {item.title}
              </div>

            </div>
          );
        })}

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* LIVE CONVERSATIONS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl font-black">
                  Live Conversations
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Real-time customer communication activity
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl border border-green-500/20 bg-green-500/10 text-green-300 text-sm font-semibold">
                Live
              </div>

            </div>

            <div className="space-y-4">

              {[
                {
                  name: "Sarah Johnson",
                  type: "Email Inquiry",
                  status: "Awaiting Reply",
                },
                {
                  name: "Michael Carter",
                  type: "Support Ticket",
                  status: "Resolved",
                },
                {
                  name: "Emily Davis",
                  type: "Sales Outreach",
                  status: "In Progress",
                },
                {
                  name: "Daniel Smith",
                  type: "Phone Follow-up",
                  status: "Scheduled",
                },
              ].map((conversation) => (
                <div
                  key={conversation.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-4"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Users
                        className="text-cyan-300"
                        size={18}
                      />
                    </div>

                    <div>

                      <div className="font-semibold">
                        {conversation.name}
                      </div>

                      <div className="text-sm text-gray-500">
                        {conversation.type}
                      </div>

                    </div>

                  </div>

                  <div className="text-sm text-cyan-300 font-semibold">
                    {conversation.status}
                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* CHANNEL PERFORMANCE */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-6">

              <h2 className="text-2xl font-black">
                Channel Performance
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Communication activity across all channels
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {[
                {
                  label: "Email",
                  icon: Mail,
                  value: "94%",
                },
                {
                  label: "SMS",
                  icon: Phone,
                  value: "88%",
                },
                {
                  label: "Live Chat",
                  icon: MessageSquare,
                  value: "97%",
                },
              ].map((channel) => {
                const Icon = channel.icon;

                return (
                  <div
                    key={channel.label}
                    className="rounded-2xl border border-white/10 bg-black/30 p-5"
                  >

                    <div className="flex items-center justify-between mb-5">

                      <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Icon
                          className="text-cyan-300"
                          size={18}
                        />
                      </div>

                      <div className="text-green-300 font-bold">
                        {channel.value}
                      </div>

                    </div>

                    <div className="text-lg font-semibold">
                      {channel.label}
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* NOTIFICATIONS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-6">

              <h2 className="text-xl font-black">
                Notifications
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Recent communication alerts
              </p>

            </div>

            <div className="space-y-4">

              {[
                "New customer inquiry received",
                "AI follow-up completed",
                "Campaign response rate increased",
                "Support request escalated",
                "Lead requested callback",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300"
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

          {/* AI STATUS */}
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Bell
                  className="text-cyan-300"
                  size={20}
                />
              </div>

              <div>

                <h3 className="text-xl font-black">
                  AI Communications
                </h3>

                <p className="text-sm text-cyan-200/70">
                  Automation System Active
                </p>

              </div>

            </div>

            <div className="space-y-4 text-sm text-gray-300">

              <div className="flex items-center justify-between">
                <span>Automated Replies</span>
                <span className="text-cyan-300 font-semibold">
                  Enabled
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Lead Follow-ups</span>
                <span className="text-green-300 font-semibold">
                  Running
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Conversation AI</span>
                <span className="text-cyan-300 font-semibold">
                  Online
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
