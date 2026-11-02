import type { InlineContent } from "@/data/blog/types";

type InlineTextProps = {
  content: InlineContent;
};

export function InlineText({ content }: InlineTextProps) {
  return (
    <>
      {content.map((node, index) => {
        switch (node.type) {
          case "bold":
            return (
              <strong key={index} className="font-semibold text-ink">
                {node.text}
              </strong>
            );
          case "italic":
            return (
              <em key={index} className="italic">
                {node.text}
              </em>
            );
          case "link":
            return (
              <a
                key={index}
                href={node.href}
                target={node.external ? "_blank" : undefined}
                rel={node.external ? "noopener noreferrer" : undefined}
                className="font-medium text-bronze underline underline-offset-2 transition-colors hover:text-ink"
              >
                {node.text}
              </a>
            );
          case "text":
          default:
            return <span key={index}>{node.text}</span>;
        }
      })}
    </>
  );
}
