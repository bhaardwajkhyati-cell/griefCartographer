export const metadata = {
  title: "Choose a Beginning",
  description: "Choose the emotional space that feels closest to you as you begin reflecting on grief with Grief Cartographer.",
  alternates: {
    canonical: "/theme",
  },
  openGraph: {
    title: "Choose a Beginning",
    description: "Begin your reflection in the emotional space that feels closest to you today.",
    url: "https://griefcartographer.vercel.app/theme",
    siteName: "Grief Cartographer",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Grief Cartographer theme selection page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Choose a Beginning",
    description: "Begin your reflection in the emotional space that feels closest to you today.",
    images: ["/icon.png"],
  },
};

export default function ThemeLayout({ children }) {
  return children;
}
