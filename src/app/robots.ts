import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/order-confirmation", "/api/"],
    },
    sitemap: "https://www.ohhmyhappiness.com/sitemap.xml",
  };
}
