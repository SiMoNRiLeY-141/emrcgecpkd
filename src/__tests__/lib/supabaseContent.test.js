import {
  NEWS_ACTIVITY_SELECT,
  NEWS_CARD_SELECT,
  NEWS_SITEMAP_SELECT,
} from "../../lib/supabaseContent";

describe("news data contracts", () => {
  it("keeps cards small while including their activity slug", () => {
    expect(NEWS_CARD_SELECT).toBe(
      "id, title, image_url, url, slug, created_at",
    );
    expect(NEWS_CARD_SELECT).not.toContain("body");
  });

  it("includes all fields needed to render an activity page", () => {
    expect(NEWS_ACTIVITY_SELECT).toContain("external_url");
    expect(NEWS_ACTIVITY_SELECT).toContain("slug");
    expect(NEWS_ACTIVITY_SELECT).toContain("summary");
    expect(NEWS_ACTIVITY_SELECT).toContain("body");
    expect(NEWS_ACTIVITY_SELECT).toContain("published_at");
    expect(NEWS_ACTIVITY_SELECT).toContain("updated_at");
  });

  it("limits sitemap reads to publishing metadata", () => {
    expect(NEWS_SITEMAP_SELECT).toBe("slug, published_at, updated_at");
  });
});
