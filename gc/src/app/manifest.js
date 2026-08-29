export default function manifest() {
  return {
    name: "Grief Cartographer",
    short_name: "Grief Cartographer",
    description: "A quiet space for reflection, expression, and navigating grief.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ee",
    theme_color: "#8b5e8a",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
