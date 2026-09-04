import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { ConsentSegment } from "@/content/landing";

interface ConsentLabelProps {
  segments: ConsentSegment[];
}

export function ConsentLabel({ segments }: ConsentLabelProps) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <span key={index}>{segment.value}</span>
        ) : (
          <Link
            key={index}
            href={siteConfig.links[segment.href]}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded underline decoration-dotted underline-offset-2 hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            {segment.value}
          </Link>
        )
      )}
    </>
  );
}
