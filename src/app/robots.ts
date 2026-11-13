import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "Bytespider",
          "Scrapy",
          "Omgilibot",
          "PerplexityBot",
          "Cohere-ai",
          "Diffbot",
          "ImagesiftBot",
        ],
        disallow: ["/"],
      },
      {
        userAgent: "*",
        allow: ["/", "/about", "/services", "/jobs", "/contact"],
        disallow: ["/admin", "/api/"],
      },
    ],
  };
}

