import { ClickTracker } from "@/components/blog/ClickTracker";
import { BlogGrid } from "@/components/blog/BlogGrid";
import type { BlogPost } from "@/data/blog/types";

type RelatedArticlesProps = {
  posts: BlogPost[];
};

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink">Читайте также</h2>
      <div className="mt-6">
        <ClickTracker goal="related_article_click">
          <BlogGrid posts={posts} trackIdPrefix="related" />
        </ClickTracker>
      </div>
    </div>
  );
}
