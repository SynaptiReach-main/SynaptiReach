export {};
"use client";

export default function Charts({ state }: any) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card title="Leads" value={state.leads} />
      <Card title="Deals" value={state.deals} />
      <Card title="Revenue" value={`$${state.deals * 2400}`} />
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-black/30 p-4 rounded-xl">
      <div className="text-gray-400 text-xs">{title}</div>
      <div className="text-white text-2xl">{value}</div>
    </div>
  );
}
