// Thin client for the public TVmaze API (https://www.tvmaze.com/api). No key needed.
const BASE = "https://api.tvmaze.com";
const cache = new Map();

async function get(path, signal) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(BASE + path, { signal });
  if (res.status === 429) throw new Error("Too many requests. Wait a few seconds and try again.");
  if (!res.ok) throw new Error(`TVmaze returned ${res.status}`);
  const data = await res.json();
  cache.set(path, data);
  return data;
}

export const searchShows = (q, signal) =>
  get(`/search/shows?q=${encodeURIComponent(q)}`, signal).then((r) => r.map((x) => x.show));

export const getShow = (id, signal) => get(`/shows/${id}?embed[]=cast&embed[]=seasons`, signal);

export const getEpisodes = (seasonId, signal) => get(`/seasons/${seasonId}/episodes`, signal);

// Top rated from the first page of the show index (TVmaze has no "trending" endpoint).
export const getTopShows = (signal) =>
  get(`/shows?page=1`, signal).then((list) =>
    list
      .filter((s) => s.image && s.rating?.average)
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, 24)
  );

// TVmaze summaries contain HTML. Convert to plain text instead of injecting it.
export function plainText(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent.trim();
}

export const year = (s) => (s.premiered ? s.premiered.slice(0, 4) : "");
