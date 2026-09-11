export const metadata = {
  title: "Gallery",
  description: "Browse the collective drawings released into the Grief Cartographer gallery, where grief is shared without ownership.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Grief Cartographer Gallery",
    description: "Browse the drawings others have released into this shared, quiet space.",
    url: "https://griefcartographer.vercel.app/gallery",
    siteName: "Grief Cartographer",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Grief Cartographer gallery page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grief Cartographer Gallery",
    description: "Browse the drawings others have released into this shared, quiet space.",
    images: ["/icon.png"],
  },
};

export default function GalleryLayout({ children }) {
  return children;
}
