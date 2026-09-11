import { refDebounced, useMemoize } from "@vueuse/core";

/**
 * The one piece of logic the client cache's correctness actually depends on:
 * compare the previously seen docs version against the latest one, and clear
 * the search cache *before* adopting the new version — never after. Kept as
 * a pure function (no fetch, no refs) so the ordering can be tested directly
 * without mocking `$fetch`.
 *
 * The server's own cache (`server/api/search.get.ts`) already keys its
 * entries by docs version, so this is the sole source of cache invalidation
 * on the client; there is no separate TTL to reason about here.
 */
export function ensureFreshCache(
  previousVersion: string | null,
  latestVersion: string,
  clearCache: () => void,
): string {
  if (previousVersion && previousVersion !== latestVersion) {
    clearCache();
  }
  return latestVersion;
}

export function useSearch() {
  const searchQuery = ref("");
  const debouncedQuery = refDebounced(searchQuery, 300);
  const isSearching = ref(false);
  const searchResults = ref<SearchResult[]>([]);
  const currentDocsVersion = ref<string | null>(null);

  // Memoized search request. No TTL here on purpose: freshness is owned by
  // ensureFreshCache below, which clears this cache whenever the docs
  // version changes. Layering a time-based expiry on top would just be a
  // second, redundant invalidation story next to that version check.
  const memoizedSearch = useMemoize(
    async (query: string): Promise<SearchResult[]> => {
      if (!query || query.trim().length < 2) {
        return [];
      }

      try {
        const results = await $fetch<SearchResult[]>("/api/search", {
          query: { q: query },
        });
        return results || [];
      }
      catch (e) {
        console.error(`[useSearch] Fetch error: ${e}`);
        return [];
      }
    },
  );

  async function performSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      isSearching.value = true;

      // Check for version update before searching
      try {
        const { version } = await $fetch<{ version: string }>("/api/docs-version");
        currentDocsVersion.value = ensureFreshCache(
          currentDocsVersion.value,
          version,
          memoizedSearch.clear,
        );
      }
      catch (e) {
        console.error(`[ERROR]: ${e}`);
      }

      const results = await memoizedSearch(query);
      return results;
    }
    catch {
      return [];
    }
    finally {
      isSearching.value = false;
    }
  }

  // Watch debounced query and perform search
  watch(debouncedQuery, async (newQuery) => {
    if (newQuery && newQuery.trim().length >= 2) {
      searchResults.value = await performSearch(newQuery);
    }
    else {
      searchResults.value = [];
    }
  });

  return {
    searchQuery,
    debouncedQuery,
    isSearching,
    searchResults,
    performSearch,
    // expose cache controls if you want them:
    reloadSearch: memoizedSearch.load,
    deleteSearchCache: memoizedSearch.delete,
    clearSearchCache: memoizedSearch.clear,
  };
}
