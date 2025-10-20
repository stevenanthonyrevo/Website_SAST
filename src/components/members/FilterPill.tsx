import React, { useState } from "react";
import "../../index.css";


export default function FilterPill({ onChange, initial = true }) {
  const [active, setActive] = useState(initial);
  return (
    <button
      aria-pressed={active}
      onClick={() => {
        const next = !active;
        setActive(next);
        onChange(next);
      }}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 transition
        ${active ? "bg-emerald-600/20 ring-emerald-400" : "bg-zinc-800 ring-zinc-700"}`}
    >
      <span className={`size-2 rounded-full ${active ? "bg-emerald-400" : "bg-zinc-500"}`} />
      Active
    </button>
  );
}
