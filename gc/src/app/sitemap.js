const baseUrl = "https://griefcartographer.vercel.app";

export default function sitemap() {
  return ["", "/express", "/gallery", "/theme"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}