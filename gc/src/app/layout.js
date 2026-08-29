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
  title: "Grief Cartographer",
  description: "Grief Cartographer is a quiet space for reflection, expression, and navigating grief.",
  keywords: ["Grief Cartographer", "grief support", "grief reflection", "emotional healing"],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Grief Cartographer",
    description: "A quiet space for reflection, expression, and navigating grief.",
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
    title: "Grief Cartographer",
    description: "A quiet space for reflection, expression, and navigating grief.",
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

export default function RootLayout({children}){
  return(
    <html 
      lang = "en"
      className={`${cormorant.variable} ${dancing.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}