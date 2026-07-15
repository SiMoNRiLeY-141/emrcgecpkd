import supabase from "../pages/api/supabase";

export const NEWS_SELECT = "id, title, image_url, url, created_at";
export const COMMITTEE_SELECT = "id, name, position, photo_url, created_at";

function applyOrder(query, column, options) {
  return typeof query.order === "function"
    ? query.order(column, options)
    : query;
}

export async function fetchHomePageContent() {
  const [newsResult, committeeResult] = await Promise.all([
    applyOrder(supabase.from("news").select(NEWS_SELECT), "created_at", {
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
