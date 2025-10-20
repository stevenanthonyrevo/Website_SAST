import React from "react";
import { Link } from "react-router-dom";

type Member = {
  slug: string;
  name: string;
  role?: string;
  avatarUrl?: string;
};

export default function MemberCard({ m }: { m: Member }) {
  return (
    <Link to={`/community/members/${m.slug}`} aria-label={`Open profile of ${m.name}`} className="member-card">
      <div className="member-avatar">
        <img
          src={m.avatarUrl || "/images/members/_placeholder.jpg"}
          alt={m.name}
          className="img"
          loading="lazy"
        />
      </div>
      <div className="member-text">
        <h3 className="name">{m.name}</h3>
        {m.role && <p className="role">{m.role}</p>}
      </div>
    </Link>
  );
}
