import Image from "next/image";
import { blogAuthors } from "@/data/blog/authors";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { BlogAuthorId } from "@/data/blog/types";

type AuthorBlockProps = {
  authorId: BlogAuthorId;
};

export function AuthorBlock({ authorId }: AuthorBlockProps) {
  const author = blogAuthors[authorId];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-paper p-6 sm:flex-row sm:items-center sm:p-7">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-ink/5">
        <Image src={author.photo} alt={author.name} fill sizes="80px" className="object-cover" />
      </div>

      <div>
        <p className="font-display text-lg font-semibold text-ink">{author.name}</p>
        <p className="mt-0.5 text-sm text-bronze">{author.statusLine}</p>
        <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-[0.95rem]">
          {author.bio}
        </p>
        <a
          href={author.profileHref}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-bronze transition-colors hover:text-ink"
        >
          Подробнее об адвокате
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
