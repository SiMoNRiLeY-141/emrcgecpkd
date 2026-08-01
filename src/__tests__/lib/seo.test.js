import { articleSchema, pageMetadata } from "../../lib/seo";
import { buildSitemap } from "../../lib/sitemap";

describe("SEO helpers", () => {
  it("creates canonical metadata for an activity", () => {
    const metadata = pageMetadata({
      title: "Arduino workshop",
      description: "A practical workshop.",
      path: "/news/arduino-workshop",
    });

    expect(metadata.canonical).toBe(
      "https://emrcgecpkd.vercel.app/news/arduino-workshop",
    );
    expect(metadata.title).toContain("Arduino workshop");
  });

  it("creates Article markup for a published activity", () => {
    const schema = articleSchema({
      title: "Arduino workshop",
      summary: "A practical workshop.",
      slug: "arduino-workshop",
      image_url: "https://example.com/image.jpg",
      published_at: "2024-02-23T00:00:00Z",
    });

    expect(schema["@type"]).toBe("Article");
    expect(schema.mainEntityOfPage).toBe(
      "https://emrcgecpkd.vercel.app/news/arduino-workshop",
    );
  });

  it("includes the homepage and every published activity in XML", () => {
    const sitemap = buildSitemap([
      { slug: "arduino-workshop", published_at: "2024-02-23T00:00:00Z" },
    ]);

    expect(sitemap).toContain("https://emrcgecpkd.vercel.app/");
    expect(sitemap).toContain(
      "https://emrcgecpkd.vercel.app/news/arduino-workshop",
    );
  });
});
