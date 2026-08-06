import { fetchPublishedActivities } from "../lib/supabaseContent";
import { buildSitemap } from "../lib/sitemap";

export default function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  let activities = [];
  try {
    activities = await fetchPublishedActivities();
  } catch {
    // The homepage remains discoverable if the content service is unavailable.
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=86400",
  );
  res.write(buildSitemap(activities));
  res.end();
  return { props: {} };
}
