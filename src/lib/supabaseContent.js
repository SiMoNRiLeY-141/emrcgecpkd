import supabase from "../pages/api/supabase";

export const NEWS_CARD_SELECT = "id, title, image_url, url, slug, created_at";
export const NEWS_ACTIVITY_SELECT =
  "id, title, image_url, url, external_url, slug, summary, body, published_at, updated_at, created_at";
export const NEWS_SITEMAP_SELECT = "slug, published_at, updated_at";
export const COMMITTEE_SELECT = "id, name, position, photo_url, created_at";

function applyOrder(query, column, options) {
  return typeof query.order === "function"
    ? query.order(column, options)
    : query;
}

export async function fetchHomePageContent() {
  const [newsResult, committeeResult] = await Promise.all([
    applyOrder(supabase.from("news").select(NEWS_CARD_SELECT), "created_at", {
      ascending: false,
    }),
    applyOrder(supabase.from("committee").select(COMMITTEE_SELECT), "id", {
      ascending: true,
    }),
  ]);

  const newsError = newsResult.error;
  const committeeError = committeeResult.error;

  if (newsError || committeeError) {
    throw new Error(newsError?.message || committeeError?.message);
  }

  return {
    initialNews: newsResult.data || [],
    initialCommittee: committeeResult.data || [],
  };
}

export async function fetchPublishedActivities() {
  const query = supabase
    .from("news")
    .select(NEWS_SITEMAP_SELECT)
    .not("published_at", "is", null);
  const result = await applyOrder(query, "published_at", { ascending: false });

  if (result.error) throw new Error(result.error.message);
  return result.data || [];
}

export async function fetchActivityBySlug(slug) {
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_ACTIVITY_SELECT)
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
