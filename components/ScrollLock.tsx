"use client";
import { useEffect } from "react";

export default function ScrollLock() {
  useEffect(() => {
    const originalScrollTo = window.scrollTo;
    const originalScrollIntoView = Element.prototype.scrollIntoView;

    // Block scrollTo
    window.scrollTo = () => {};

    // Block scrollIntoView
    Element.prototype.scrollIntoView = () => {};

    return () => {
      window.scrollTo = originalScrollTo;
      Element.prototype.scrollIntoView = originalScrollIntoView;
    };
  }, []);

  return (
      <div className="w-full h-full">
        {/* restored UI shell */}
      </div>
    );
}
