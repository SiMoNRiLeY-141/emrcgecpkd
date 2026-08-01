import Image from "next/image";
import Link from "next/link";
import SeoHead from "../../components/SeoHead";
import {
  fetchActivityBySlug,
  fetchPublishedActivities,
} from "../../lib/supabaseContent";
import { articleSchema, pageMetadata } from "../../lib/seo";

export default function ActivityPage({ activity }) {
  const metadata = pageMetadata({
    title: activity.title,
    description: activity.summary,
    path: `/news/${activity.slug}`,
    image: activity.image_url,
  });
  const publishedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(activity.published_at));
  const externalUrl = activity.external_url || activity.url;

  return (
    <>
      <SeoHead metadata={metadata} schema={articleSchema(activity)} type="article" />
      <main className="mx-auto min-h-screen max-w-3xl px-5 py-12 md:py-20">
        <article className="hud-panel overflow-hidden rounded-[24px] p-6 md:p-10">
          <Link href="/" className="text-sm text-accent-primary hover:underline">
            ← Back to EMRC home
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-wider text-accent-primary">
            Activity · {publishedDate}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
            {activity.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            {activity.summary}
          </p>
          <Image
            src={activity.image_url}
            alt={activity.title}
            width={1200}
            height={675}
            sizes="(max-width: 768px) 100vw, 768px"
            className="mt-8 aspect-video w-full rounded-xl object-cover"
            priority
          />
          <div className="mt-8 space-y-5 text-base leading-8 text-text-primary md:text-lg">
            {activity.body.split(/\n\s*\n/).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-md border border-accent-primary/50 px-4 py-2 text-accent-primary hover:bg-accent-primary/10"
            >
              View the original social post
            </a>
          )}
        </article>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const activities = await fetchPublishedActivities();
    return {
      paths: activities.map((activity) => ({ params: { slug: activity.slug } })),
      fallback: "blocking",
    };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  try {
    const activity = await fetchActivityBySlug(params.slug);
    if (!activity) return { notFound: true, revalidate: 300 };
    return { props: { activity }, revalidate: 300 };
  } catch {
    return { notFound: true, revalidate: 300 };
  }
}
