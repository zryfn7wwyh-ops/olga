import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/data/blog/types";

type BlogGridProps = {
  posts: BlogPost[];
  trackIdPrefix?: string;
};

export function BlogGrid({ posts, trackIdPrefix }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          post={post}
          trackId={trackIdPrefix ? `${trackIdPrefix}:${post.slug}` : undefined}
        />
      ))}
    </div>
  );
}
