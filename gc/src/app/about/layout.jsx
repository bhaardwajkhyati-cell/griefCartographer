export const metadata = {
  title: "About",
  authors: [
    {
      name: "Khyati Bhaardwaj",
      url: "https://github.com/bhaardwajkhyati-cell",
    },
  ],
  creator: "Khyati Bhaardwaj",
  publisher: "Khyati Bhaardwaj",
  description:
    "Learn about Grief Cartographer, a reflective space for expressing grief through drawing and release.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Grief Cartographer, made by Khyati Bhaardwaj",
    description: "A reflective space for expressing grief through drawing, memory, and release.",
    url: "https://griefcartographer.vercel.app/about",
    siteName: "Grief Cartographer",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Grief Cartographer about page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Grief Cartographer, made by Khyati Bhaardwaj",
    description: "A reflective space for expressing grief through drawing, memory, and release.",
    images: ["/icon.png"],
  },
};

export default function AboutLayout({ children }) {
  return children;
}