import React from "react";
import { Github, Linkedin, Globe, Twitter } from "lucide-react";

type MemberLinks = Partial<{ github: string; x: string; linkedin: string; community: string }>;
type Member = { name: string; links?: MemberLinks };

export default function SocialIcons({ m }: { m: Member }) {
  const items = [
    { key: "github", url: m.links?.github, label: "GitHub", Icon: Github },
    { key: "x", url: m.links?.x, label: "X (Twitter)", Icon: Twitter },
    { key: "linkedin", url: m.links?.linkedin, label: "LinkedIn", Icon: Linkedin },
    { key: "community", url: m.links?.linkedin, label: "Community", Icon: Globe },
  ] as const;

  const visible = items.filter((i) => !!i.url);
  if (visible.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      {visible.map(({ key, url, label, Icon }) => (
        <a
          key={key}
          href={url as string}
          target="_blank"
          rel="noopener"
          aria-label={`${m.name} on ${label}`}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/20"
        >
          <Icon className="h-6 w-6" />
          <span className="text-sm">{label}</span>
        </a>
      ))}
    </div>
  );
}
