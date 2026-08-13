import type { MetadataRoute } from "next";

import { ROUTES } from "@/constants";
import { servicePageSlugs } from "@/data/servicePages";
import { SITE_URL } from "@/lib/seo";
import { blogService, jobService, newsService } from "@/services";

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] = "weekly"
): MetadataRoute.Sitemap[0] {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  return {
    url,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    entry("/", 1, "weekly"),
    entry(ROUTES.about, 0.9),
    entry(ROUTES.services, 0.9),
    entry(ROUTES.careers, 0.8),
    entry(ROUTES.testimonials, 0.7),
    entry(ROUTES.blog, 0.8),
    entry(ROUTES.contact, 0.8),
    entry(ROUTES.privacyPolicy, 0.4, "yearly"),
    ...servicePageSlugs.map((slug) =>
      entry(`${ROUTES.services}/${slug}`, 0.85)
    ),
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const [blogsRes, newsRes, jobsRes] = await Promise.all([
      blogService.getPublished(),
      newsService.getPublished(),
      jobService.getPublished(),
    ]);

    const blogs = blogsRes.data ?? [];
    const news = newsRes.data ?? [];
    const jobs = jobsRes.data ?? [];

    dynamicRoutes = [
      ...blogs.map((post) =>
        entry(ROUTES.blogPost(post.slug), 0.6, "monthly")
      ),
      ...news.map((item) =>
        entry(ROUTES.newsArticle(item.slug), 0.6, "monthly")
      ),
      ...jobs.map((job) =>
        entry(ROUTES.careerJob(job._id), 0.65, "weekly")
      ),
    ];
  } catch {
    // API unavailable at build time — static routes still published
  }

  return [...staticRoutes, ...dynamicRoutes];
}
