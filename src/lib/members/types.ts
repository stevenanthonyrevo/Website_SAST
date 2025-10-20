export type MemberLinkKeys = "github" | "x" | "linkedin" | "community";
export type MemberStatus = "active" | "inactive";

export interface Member {
  slug: string;
  name: string;
  role?: string;
  location?: string;
  bio?: string;
  status?: MemberStatus;
  avatarUrl?: string;
  links?: Partial<Record<MemberLinkKeys, string>>;
}
