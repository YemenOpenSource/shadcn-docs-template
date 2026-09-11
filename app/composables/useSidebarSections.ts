import type { NavigationItem } from "~/lib/navigation";
import { showMcpDocs } from "~/lib/flag";
import { NAV_SECTIONS, SIDEBAR_EXCLUDED_SECTIONS } from "~/lib/navigation";

/**
 * Shapes a content navigation root into the two groups every nav surface
 * renders: `rootPages` (the top-level section pills, in `NAV_SECTIONS`
 * order) and `folderGroups` (the folders below them). `DocsSidebar.vue`
 * (desktop) and `MobileNav.vue` (mobile) both call this instead of each
 * defining their own near-identical computeds, so the two surfaces can't
 * drift out of sync.
 *
 * `root` takes a getter so each caller can normalize its own tree shape
 * (a single root node vs. an array whose first element is the root)
 * without duplicating that logic here.
 */
export function useSidebarSections(root: () => NavigationItem | undefined) {
  const filteredSections = computed(() =>
    NAV_SECTIONS.filter(section => showMcpDocs || !section.href.includes("/mcp")),
  );

  const rootPages = computed<NavigationItem[]>(() => {
    const children = root()?.children ?? [];
    return filteredSections.value.map((section) => {
      const treeItem = children.find(item => item.path === section.href);
      return {
        path: section.href,
        ...treeItem,
        title: section.name,
      } as NavigationItem;
    });
  });

  const folderGroups = computed<NavigationItem[]>(() => {
    const children = root()?.children ?? [];
    return children.filter(
      item =>
        (item.children || item.soon)
        && !SIDEBAR_EXCLUDED_SECTIONS.includes(item.title.toLocaleLowerCase()),
    );
  });

  return {
    rootPages,
    folderGroups,
  };
}
