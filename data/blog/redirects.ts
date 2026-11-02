export type BlogRedirect = {
  from: string;
  to: string;
};

/**
 * Заполняется при смене slug уже опубликованной статьи:
 * { from: "/blog/old-slug", to: "/blog/new-slug" }
 */
export const blogRedirects: BlogRedirect[] = [];
