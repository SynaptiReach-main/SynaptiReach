export {};
"use client";
import { useEffect, useState } from "react";

export default function AITyping({ messages }: any) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!messages.length) return;

    let i = 0;
    const msg = messages[0];
    setText("");

    const interval = setInterval(() => {
      i++;
      setText(msg.slice(0, i));
      if (i >= msg.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="text-cyan-300 text-sm font-mono">
      {text}
    </div>
  );
}
