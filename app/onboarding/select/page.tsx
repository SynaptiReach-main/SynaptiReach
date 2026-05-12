export {};
"use client";

import { useRouter } from "next/navigation";

export default function SelectIndustry() {
  const router = useRouter();

  const choose = (industry: string) => {
    localStorage.setItem("industry", industry);
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">
        What are you building?
      </h1>

      <button onClick={() => choose("AI SaaS")}>AI SaaS</button>
      <button onClick={() => choose("Agency")}>Agency</button>
      <button onClick={() => choose("Ecommerce")}>Ecommerce</button>
    </div>
  );
}
