export type InlineNode =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  | { type: "italic"; text: string }
  | { type: "link"; text: string; href: string; external?: boolean };

export type InlineContent = InlineNode[];

export type HeadingBlock = { type: "heading"; level: 2 | 3 | 4; text: string; id: string };
export type ParagraphBlock = { type: "paragraph"; content: InlineContent };
export type ListBlock = { type: "list"; style: "bulleted" | "numbered"; items: InlineContent[] };
export type QuoteBlock = { type: "quote"; content: InlineContent; cite?: string };
export type TableBlock = { type: "table"; headers: string[]; rows: string[][] };
export type ImageBlock = { type: "image"; src: string; alt: string; caption?: string };
export type CalloutBlock = {
  type: "callout";
  tone: "info" | "warning";
  title?: string;
  content: InlineContent;
};

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | QuoteBlock
  | TableBlock
  | ImageBlock
  | CalloutBlock;

export type BlogCategoryId = "family" | "inheritance" | "civil" | "business" | "advice";

export type BlogCategory = {
  id: BlogCategoryId;
  label: string;
};

export type BlogPostStatus = "draft" | "published";

export type BlogAuthorId = "anita-aksyonova";

export type BlogAuthor = {
  id: BlogAuthorId;
  name: string;
  role: string;
  statusLine: string;
  photo: string;
  bio: string;
  profileHref: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: BlogCategoryId;
  publishedAt: string;
  updatedAt?: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  body: ContentBlock[];
  seoTitle: string;
  seoDescription: string;
  canonical?: string;
  status: BlogPostStatus;
  authorId: BlogAuthorId;
};
