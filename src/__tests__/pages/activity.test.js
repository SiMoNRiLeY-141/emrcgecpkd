jest.mock("../../lib/supabaseContent", () => ({
  fetchPublishedActivities: jest.fn(),
  fetchActivityBySlug: jest.fn(),
}));

import {
  getStaticPaths,
  getStaticProps,
} from "../../pages/news/[slug]";
import {
  fetchActivityBySlug,
  fetchPublishedActivities,
} from "../../lib/supabaseContent";

describe("activity page data fetching", () => {
  afterEach(() => jest.resetAllMocks());

  it("generates a path for each published activity", async () => {
    fetchPublishedActivities.mockResolvedValue([{ slug: "arduino-workshop" }]);

    await expect(getStaticPaths()).resolves.toEqual({
      paths: [{ params: { slug: "arduino-workshop" } }],
      fallback: "blocking",
    });
  });

  it("returns an ISR activity page", async () => {
    const activity = { slug: "arduino-workshop", title: "Arduino workshop" };
    fetchActivityBySlug.mockResolvedValue(activity);

    await expect(
      getStaticProps({ params: { slug: "arduino-workshop" } }),
    ).resolves.toEqual({ props: { activity }, revalidate: 300 });
  });

  it("returns notFound for an unpublished or missing activity", async () => {
    fetchActivityBySlug.mockResolvedValue(null);

    await expect(
      getStaticProps({ params: { slug: "missing" } }),
    ).resolves.toEqual({ notFound: true, revalidate: 300 });
  });
});
