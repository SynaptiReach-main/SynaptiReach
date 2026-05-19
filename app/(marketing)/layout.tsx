export {};
import BackgroundSystem from "../components/BackgroundSystem";
import Navbar from "../components/Navbar";
import WaitlistWidget from "@/components/waitlist/WaitlistWidget";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackgroundSystem />

      <Navbar />

      <div className="relative z-10 pt-20">
        <WaitlistWidget />
        {children}
      </div>
    </>
  );
}
