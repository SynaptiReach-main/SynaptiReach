export {};
"use client";

export default function FAQ() {
  return (
    <section className="py-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6 text-white/70">
        <div>
          <div className="font-semibold text-white">
            How does the AI work?
          </div>
          <div>
            It responds instantly to leads and books appointments automatically.
          </div>
        </div>

        <div>
          <div className="font-semibold text-white">
            Can I customize responses?
          </div>
          <div>
            Yes — everything can be tailored to your business.
          </div>
        </div>
      </div>
    </section>
  );
}
