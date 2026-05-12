export {};
import "./globals.css";

export const metadata = {
  title: "SynaptiReach",
  description: "AI CRM & Marketing Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
