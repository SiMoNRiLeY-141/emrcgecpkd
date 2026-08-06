export const SITE_URL = "https://emrcgecpkd.vercel.app";
export const SITE_NAME = "EMRC GEC Palakkad";
export const DEFAULT_DESCRIPTION =
  "Electrical Maintenance and Research Club at Govt. Engineering College, Sreekrishnapuram. Explore our activities, workshops, and research.";
export const DEFAULT_IMAGE = `${SITE_URL}/og-emrc.png`;

export function absoluteUrl(path = "/") {
  if (path === "/") return SITE_URL;
  return new URL(path, SITE_URL).toString();
}

export function pageMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
}) {
  const canonical = absoluteUrl(path);
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    canonical,
    image,
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Electrical Maintenance and Research Club (EMRC)",
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  email: "emrc@gecskp.ac.in",
  sameAs: [
    "https://www.instagram.com/emrc_gec",
    "https://www.linkedin.com/company/emrc-gecpkd",
  ],
};

export function articleSchema(activity) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: activity.title,
    description: activity.summary,
    image: [activity.image_url],
    datePublished: activity.published_at,
    dateModified: activity.updated_at || activity.published_at,
    mainEntityOfPage: absoluteUrl(`/news/${activity.slug}`),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.svg`,
      },
    },
  };
}
