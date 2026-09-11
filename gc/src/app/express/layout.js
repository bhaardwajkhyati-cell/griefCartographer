export const metadata = {
  title: "Express Your Grief",
  description: "Create a drawing in response to a reflection prompt and release it into the Grief Cartographer gallery.",
  alternates: {
    canonical: "/express",
  },
  openGraph: {
    title: "Express Your Grief",
    description: "Draw your reflection, release it, and let it become part of the shared gallery.",
    url: "https://griefcartographer.vercel.app/express",
    siteName: "Grief Cartographer",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Grief Cartographer express page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Express Your Grief",
    description: "Draw your reflection, release it, and let it become part of the shared gallery.",
    images: ["/icon.png"],
  },
};

export default function ExpressLayout({ children }) {
  return children;
}
