import DemoTopNav from "@/components/demo/DemoTopNav";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1800px] px-3 pb-8 pt-4 sm:px-5 md:px-8">
        <DemoTopNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
