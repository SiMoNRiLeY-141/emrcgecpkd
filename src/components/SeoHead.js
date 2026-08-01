import Head from "next/head";
import { DEFAULT_IMAGE } from "../lib/seo";

export default function SeoHead({ metadata, schema, type = "website" }) {
  return (
    <Head>
      <title>{metadata.title}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={metadata.description} />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="bingbot" content="index, follow" />
      <link rel="canonical" href={metadata.canonical} />
      <link rel="icon" href="/favicon.svg" />
      <meta
        name="google-site-verification"
        content="RsmQDkTKhMkEqmP3ipd5IGfsQoeIZd3glUMDWGcEhUI"
      />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:image" content={metadata.image || DEFAULT_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={metadata.canonical} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={metadata.image || DEFAULT_IMAGE} />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Head>
  );
}
