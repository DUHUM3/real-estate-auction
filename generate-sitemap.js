import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";

const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },

  { url: "/lands-and-auctions-list", changefreq: "daily", priority: 0.9 },
  { url: "/purchase-requests", changefreq: "weekly", priority: 0.8 },

  { url: "/terms-of-service", changefreq: "yearly", priority: 0.3 },
  { url: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
];

const sitemap = new SitemapStream({
  hostname: "https://shaheenplus.sa",
});

const writeStream = createWriteStream("./public/sitemap.xml");
sitemap.pipe(writeStream);

// إضافة الروابط
links.forEach(link => sitemap.write(link));

sitemap.end();

streamToPromise(sitemap).then(() => {
  console.log("✅ Sitemap generated successfully");
});
