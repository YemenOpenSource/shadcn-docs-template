export type NavigationItemType = "page" | "component" | "block" | "group";

/**
 * The one navigation item shape shared across the content tree, the
 * sidebar, the mobile nav, and the command palette. Previously split
 * between this file's `SidebarNavigationItem` and `useNavigation.ts`'s
 * `NavigationItem` — two names for the same near-identical structure.
 */
export type NavigationItem = {
  title: string;
  path: string;
  stem?: string;
  children?: NavigationItem[];
  page?: boolean;
  type?: NavigationItemType;
  new?: boolean;
  beta?: boolean;
  soon?: boolean;
  hide?: boolean;
  navigation?: {
    icon?: string;
  };
  [key: string]: unknown;
};

export type NavItem = {
  name: string;
  href: string;
};

/** Top-level section pills shown in the sidebar and mobile menu. */
export const NAV_SECTIONS: NavItem[] = [
  { name: "Get Started", href: "/docs/getting-started/introduction" },
  { name: "Installation", href: "/docs/getting-started/installation" },
  { name: "Components", href: "/docs/components" },
  { name: "Animations", href: "/docs/animation" },
];

/** Sidebar group titles (lowercased) that should never be rendered. */
export const SIDEBAR_EXCLUDED_SECTIONS: string[] = [];

/** Individual page paths that should be hidden from the sidebar page list. */
export const SIDEBAR_EXCLUDED_PAGES: string[] = [];

/**
 * Top-level/main site navigation items primarily used in the site header.
 * Each item follows the NavItem structure with a display name and href.
 */
export const MAIN_NAVIGATION: NavItem[] = [
  {
    href: "/docs/getting-started/introduction",
    name: "Docs",
  },
  {
    href: "/docs/components",
    name: "Components",
  },
];
