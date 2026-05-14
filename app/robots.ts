import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/sign-in", "/sign-up", "/welcome", "/api/"],
    },
    sitemap: "https://easyhost.pro/sitemap.xml",
  };
}
