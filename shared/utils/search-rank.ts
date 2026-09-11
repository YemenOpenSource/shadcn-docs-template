/**
 * Scores how well `text` matches `query`: 0 means no match, higher means a
 * stronger match (exact > prefix > word-boundary > plain substring). This is
 * the one ranking primitive shared across the search seam — it's used
 * directly as the command palette's `:filter` scorer, and as the building
 * block behind `rankSearchResult` below.
 */

const WHITESPACE_REGEX = /\s/;
export function matchScore(text: string, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) {
    return 1;
  }

  const t = text.toLowerCase();
  const index = t.indexOf(q);
  if (index === -1) {
    return 0;
  }
  if (t === q) {
    return 4;
  }
  if (index === 0) {
    return 3;
  }
  if (WHITESPACE_REGEX.test(t[index - 1] ?? "")) {
    return 2;
  }
  return 1;
}

const TITLE_WEIGHT = 100;
const DESCRIPTION_WEIGHT = 10;
const BODY_WEIGHT = 1;

/**
 * Ranks a search result against `query` by combining per-field match
 * scores: a title match always outranks a description-only match, which
 * always outranks a body-only match, while `matchScore`'s finer grading
 * breaks ties within the same field.
 */
export function rankSearchResult(
  item: { title: string; description?: string; body?: string },
  query: string,
): number {
  const titleScore = matchScore(item.title, query) * TITLE_WEIGHT;
  const descriptionScore = item.description ? matchScore(item.description, query) * DESCRIPTION_WEIGHT : 0;
  const bodyScore = item.body ? matchScore(item.body, query) * BODY_WEIGHT : 0;
  return titleScore + descriptionScore + bodyScore;
}
