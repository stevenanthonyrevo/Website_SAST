// JSON import requires "resolveJsonModule": true in tsconfig (usually enabled in Vite templates)
import members from "../../data/members.json";

type MemberLinks = Partial<{
  github: string;
  x: string;
  linkedin: string;
  community: string;
}>;

export type Member = {
  slug: string;
  name: string;
  role?: string;
  location?: string;
  bio?: string;
  status?: "active" | "inactive";
  avatarUrl?: string;
  links?: MemberLinks;
};

export function getAllMembers(): Member[] {
  return [...(members as Member[])].sort((a, b) => a.name.localeCompare(b.name));
}

export function getActiveMembers(): Member[] {
  return getAllMembers().filter((m) => (m.status ?? "active") === "active");
}

export function getMemberBySlug(slug: string): Member | undefined {
  return getAllMembers().find((m) => m.slug === slug);
}
