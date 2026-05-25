"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function MarkAsReadButton({ id }: { id: string }) {
  const [done, setDone] = useState(false);

  async function markAsRead() {
    await fetch(`/api/mensagens/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lida: true }),
    });
    setDone(true);
  }

  if (done) return null;

  return (
    <button
      onClick={markAsRead}
      className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-green-500 transition-colors whitespace-nowrap"
    >
      <Check size={13} /> Marcar como lida
    </button>
  );
}
