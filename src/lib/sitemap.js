import { absoluteUrl } from "./seo";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSitemap(activities = []) {
  const urls = [
    { loc: absoluteUrl("/"), lastmod: null },
    ...activities.map((activity) => ({
      loc: absoluteUrl(`/news/${activity.slug}`),
      lastmod: activity.updated_at || activity.published_at,
    })),
  ];

  const entries = urls
    .map(
      ({ loc, lastmod }) =>
        `<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""}</url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
}
