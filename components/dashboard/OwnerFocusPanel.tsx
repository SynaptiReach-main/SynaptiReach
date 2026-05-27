import Link from "next/link";

type OwnerFocusItem = {
  label: string;
  value?: string | number;
  detail: string;
  href?: string;
  action?: string;
  tone?: "cyan" | "green" | "yellow" | "neutral";
};

type OwnerFocusPanelProps = {
  title?: string;
  subtitle?: string;
  items: OwnerFocusItem[];
};

const toneClasses: Record<NonNullable<OwnerFocusItem["tone"]>, string> = {
  cyan: "border-cyan-400/20 bg-cyan-500/[0.06] text-cyan-100",
  green: "border-green-400/20 bg-green-500/[0.06] text-green-100",
  yellow: "border-yellow-400/20 bg-yellow-500/[0.06] text-yellow-100",
  neutral: "border-white/10 bg-black/25 text-gray-200",
};

export default function OwnerFocusPanel({
  title = "Owner Focus",
  subtitle = "A short view of what deserves attention before going deeper.",
  items,
}: OwnerFocusPanelProps) {
  if (!items.length) return null;

  return (
    <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-cyan-500/5">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-black text-white">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {items.map((item) => {
          const body = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">{item.label}</div>
                {item.value !== undefined && (
                  <div className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-xs font-black text-white">
                    {item.value}
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{item.detail}</p>
              {item.action && <div className="mt-3 text-xs font-black text-cyan-100">{item.action}</div>}
            </>
          );

          const className = `block min-h-32 rounded-2xl border p-4 text-left ${toneClasses[item.tone || "neutral"]}`;

          return item.href ? (
            <Link key={`${item.label}-${item.href}`} href={item.href} className={className}>
              {body}
            </Link>
          ) : (
            <div key={item.label} className={className}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
