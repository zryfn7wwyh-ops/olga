import { AlertTriangleIcon, InfoIcon } from "@/components/ui/icons";
import type { CalloutBlock } from "@/data/blog/types";
import { InlineText } from "@/components/blog/InlineText";

type CalloutBoxProps = {
  block: CalloutBlock;
};

export function CalloutBox({ block }: CalloutBoxProps) {
  const isWarning = block.tone === "warning";

  return (
    <div
      className={`flex gap-3 rounded-xl border-l-4 p-5 ${
        isWarning ? "border-ink/60 bg-ink/5" : "border-bronze bg-cream"
      }`}
    >
      <span className={`mt-0.5 shrink-0 ${isWarning ? "text-ink" : "text-bronze"}`}>
        {isWarning ? <AlertTriangleIcon className="h-5 w-5" /> : <InfoIcon className="h-5 w-5" />}
      </span>
      <div className="text-sm leading-relaxed text-text sm:text-base">
        {block.title ? <p className="font-semibold text-ink">{block.title}</p> : null}
        <p className={block.title ? "mt-1" : ""}>
          <InlineText content={block.content} />
        </p>
      </div>
    </div>
  );
}
