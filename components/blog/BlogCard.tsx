import Image from "next/image";
import { getCategoryLabel } from "@/data/blog/categories";
import { formatPostDate } from "@/lib/blog";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { BlogPost } from "@/data/blog/types";

type BlogCardProps = {
  post: BlogPost;
  trackId?: string;
};

export function BlogCard({ post, trackId }: BlogCardProps) {
  return (
    <a
      href={`/blog/${post.slug}`}
      data-track-id={trackId}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-200 hover:-translate-y-1 hover:border-bronze/50 hover:shadow-[0_18px_40px_-20px_rgba(23,25,29,0.25)]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/5">
        <Image
          src={post.coverImage}
          alt={post.coverImageAlt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-bronze">
          <span>{getCategoryLabel(post.category)}</span>
          <span className="h-1 w-1 rounded-full bg-bronze/50" aria-hidden="true" />
          <span className="font-medium normal-case tracking-normal text-text-muted">
            {formatPostDate(post.publishedAt)}
          </span>
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">{post.excerpt}</p>

        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bronze">
          Читать статью
          <span className="inline-flex transition-transform duration-200 group-hover:translate-x-1">
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </span>
      </div>
    </a>
  );
}
