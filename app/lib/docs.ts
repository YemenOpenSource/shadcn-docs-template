import type { ContentCollectionItem, ContentNavigationItem, Toc } from "@nuxt/content";

/**
 * What the docs page template actually reads, as opposed to
 * `ContentCollectionItem`, which is the full shape `content.config.ts`'s
 * schema happens to produce. Keeping the two separate means a schema change
 * only has to be re-mapped in `toDocPageView`, not chased through every
 * `page.foo.bar` call site.
 */
export type DocPageView = {
  title: string;
  description?: string;
  icon?: string;
  links?: {
    doc?: string;
    api?: string;
  };
  lastUpdated?: string;
  rawbody: string;
  toc?: Toc;
  /** The raw item, kept only for `<ContentRenderer :value>`, which needs the full document to render its body. */
  source: ContentCollectionItem;
};

/** A prev/next link, as surfaced by `queryCollectionItemSurroundings`. */
export type DocNeighbour = {
  path: string;
  title: string;
};

/**
 * Maps a raw content-collection item to a `DocPageView`. This is the one
 * place that knows about `content.config.ts`'s schema fields (`links`,
 * `navigation.icon`, `lastUpdated`, `rawbody`, `body.toc`) so the docs page
 * and its children can depend on a small, stable shape instead of reaching
 * into frontmatter directly.
 */
export function toDocPageView(item: ContentCollectionItem): DocPageView {
  return {
    title: item.title,
    description: item.description,
    icon: item.navigation?.icon,
    links: item.links,
    lastUpdated: item.lastUpdated,
    rawbody: item.rawbody ?? "",
    toc: item.body?.toc,
    source: item,
  };
}

/** Maps a surroundings entry (prev/next) to the link data pagers need. */
export function toDocNeighbour(item: ContentNavigationItem): DocNeighbour {
  return {
    path: item.path,
    title: item.title,
  };
}
