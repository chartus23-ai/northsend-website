import type { MetadataRoute } from "next";

/* /roi and /tools/* carry their own noindex meta tags; they stay crawlable
   here so Google can actually see those tags. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://www.northsend.io/sitemap.xml",
  };
}
