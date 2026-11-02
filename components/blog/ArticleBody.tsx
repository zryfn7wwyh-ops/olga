import Image from "next/image";
import { InlineText } from "@/components/blog/InlineText";
import { CalloutBox } from "@/components/blog/CalloutBox";
import type { ContentBlock } from "@/data/blog/types";

type ArticleBodyProps = {
  blocks: ContentBlock[];
};

const headingClasses: Record<2 | 3 | 4, string> = {
  2: "mt-10 font-display text-2xl font-semibold text-ink scroll-mt-28 sm:text-[1.75rem]",
  3: "mt-8 font-display text-xl font-semibold text-ink scroll-mt-28",
  4: "mt-6 font-display text-lg font-semibold text-ink scroll-mt-28",
};

export function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="max-w-[760px] space-y-5">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Tag = `h${block.level}` as "h2" | "h3" | "h4";
            return (
              <Tag key={index} id={block.id} className={headingClasses[block.level]}>
                {block.text}
              </Tag>
            );
          }

          case "paragraph":
            return (
              <p key={index} className="text-base leading-relaxed text-text sm:text-[1.05rem]">
                <InlineText content={block.content} />
              </p>
            );

          case "list": {
            const ListTag = block.style === "numbered" ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`space-y-2 pl-5 text-base leading-relaxed text-text sm:text-[1.05rem] ${
                  block.style === "numbered" ? "list-decimal" : "list-disc"
                }`}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <InlineText content={item} />
                  </li>
                ))}
              </ListTag>
            );
          }

          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-4 border-bronze py-1 pl-5 font-display text-lg italic leading-relaxed text-ink sm:text-xl"
              >
                <InlineText content={block.content} />
                {block.cite ? (
                  <footer className="mt-2 text-sm not-italic text-text-muted">{block.cite}</footer>
                ) : null}
              </blockquote>
            );

          case "table":
            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm sm:text-base">
                  <thead>
                    <tr className="bg-cream">
                      {block.headers.map((header, headerIndex) => (
                        <th
                          key={headerIndex}
                          className="border-b border-line px-4 py-3 font-semibold text-ink"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="odd:bg-paper even:bg-cream/40">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border-b border-line px-4 py-3 text-text">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "image":
            return (
              <figure key={index} className="my-2">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-ink/5">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="760px"
                    className="object-cover"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="mt-2 text-center text-sm text-text-muted">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );

          case "callout":
            return <CalloutBox key={index} block={block} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
