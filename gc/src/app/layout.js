import { Cormorant_Garamond , Dancing_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "---cormorant",
  subsets: ["latin"],
  weight: ["300" , "400" ,"500"],
});
 const dancing = Dancing_Script({
    variable: "--font-dancing",
    subsets :["latin"],
    weight: ["400" , "700"],
 });
export const metadata ={
  metadataBase: new URL("https://griefcartographer.vercel.app"),
  title: {
    default: "Grief Cartographer | made by Khyati Bhaardwaj",
    template: "%s | Grief Cartographer",
  },
  description: "Grief Cartographer is a quiet space for reflection, expression, and navigating grief through drawing, memory, and release. Created and designed by Khyati Bhaardwaj.",
  keywords: ["Grief Cartographer", "grief support", "grief reflection", "emotional healing", "express grief through drawing", "Khyati Bhaardwaj"],
  authors: [{ name: "Khyati Bhaardwaj", url: "https://github.com/bhaardwajkhyati-cell" }],
  creator: "Khyati Bhaardwaj",
  publisher: "Khyati Bhaardwaj",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Grief Cartographer | made by Khyati Bhaardwaj",
    description: "A quiet space for reflection, expression, and navigating grief through drawing, memory, and release. Created and designed by Khyati Bhaardwaj.",
    url: "https://griefcartographer.vercel.app/",
    siteName: "Grief Cartographer",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Grief Cartographer logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grief Cartographer | made by Khyati Bhaardwaj",
    description: "A quiet space for reflection, expression, and navigating grief through drawing, memory, and release. Created and designed by Khyati Bhaardwaj.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "9DVIdJQ2B32dn42Q9d8_J9JocoNLUWG2P98c-RzlBhM",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Grief Cartographer",
  description: "A quiet space for reflection, expression, and navigating grief through drawing, memory, and release.",
  url: "https://griefcartographer.vercel.app/",
  creator: {
    "@type": "Person",
    name: "Khyati Bhaardwaj",
    url: "https://github.com/bhaardwajkhyati-cell",
  },
};

export default function RootLayout({children}){
  return(
    <html 
      lang = "en"
      className={`${cormorant.variable} ${dancing.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
