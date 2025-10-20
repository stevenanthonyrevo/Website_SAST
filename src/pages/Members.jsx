/* eslint-disable react/prop-types */
import React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllMembers, getActiveMembers } from "../lib/members/data";

/* ---------------- Filter pill ---------------- */

function FilterPill({ value = true, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 text-sm text-white/90 backdrop-blur hover:bg-white/10 hover:border-white/25"
      style={{ padding: "0.5rem 1rem" }}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          value
            ? "bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,.15)]"
            : "bg-zinc-500"
        }`}
      />
      <span>Active</span>
      <span className="opacity-70">×</span>
      <span className="opacity-70">▾</span>
    </button>
  );
}

/* ---------------- Card ---------------- */

function MemberCard({ m }) {
  return (
    <Link
      to={`/community/members/${m.slug}`}
      aria-label={`Open profile of ${m.name}`}
      className="group w-full max-w-[360px] rounded-2xl border border-[#2a2f37] bg-[#1b1e24] text-center transition hover:-translate-y-0.5 hover:border-[#39414d] hover:shadow-[0_10px_24px_rgba(0,0,0,.35)] focus:outline-none focus:ring-2 focus:ring-emerald-400"
      style={{ margin: "0 auto", padding: "2rem" }}
    >
      <div
        className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/10"
        style={{ margin: "0 auto" }}
      >
        <img
          src={m.avatarUrl || "/images/members/_placeholder.jpg"}
          alt={m.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h3 className="truncate text-[22px] font-semibold text-white sm:text-2xl">
          {m.name}
        </h3>
        {m.role && (
          <p className="text-base text-white/75 sm:text-lg" style={{ marginTop: "0.5rem" }}>
            {m.role}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ---------------- Page ---------------- */

export default function Members() {
  const all = getAllMembers();
  const active = getActiveMembers();

  const [activeOnly, setActiveOnly] = useState(true);

  // Source data based on filter (NO dummy padding)
  const data = useMemo(
    () => (activeOnly ? active : all),
    [activeOnly, all, active]
  );

  return (
    <React.Fragment>
      <section className="w-full" style={{ paddingBottom: "7rem" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          <header
            className="relative w-full"
            style={{ marginTop: "3rem", marginBottom: "3.75rem" }}
          >
            <h1 className="text-center text-[38px] font-extrabold leading-tight tracking-[-0.02em] text-white md:text-6xl">
              Meet our Community Members
            </h1>
            <p
              className="text-center text-lg text-white/75 md:text-2xl"
              style={{ marginTop: "1rem" }}
            >
              A warm and welcoming collection of open sourcers
            </p>

            <div className="absolute right-0 top-1 hidden md:block">
              <FilterPill value={activeOnly} onChange={setActiveOnly} />
            </div>
          </header>

          <div
            className="flex w-full justify-center md:hidden"
            style={{ marginBottom: "2rem" }}
          >
            <FilterPill value={activeOnly} onChange={setActiveOnly} />
          </div>

          <div
            className="grid w-full place-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "2.5rem" }}
          >
            {data.map((m) => (
              <MemberCard key={m.slug} m={m} />
            ))}
          </div>

          <div style={{ marginTop: "3rem" }} />
        </div>
      </section>
    </React.Fragment>
  );
}
