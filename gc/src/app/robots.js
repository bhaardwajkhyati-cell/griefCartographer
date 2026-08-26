export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://griefcartographer.vercel.app/sitemap.xml",
  };
}