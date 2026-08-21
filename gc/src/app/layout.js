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
  title: "Grief Cartographer",
  description: "Grief is not loss that can be seen.It is everything that makes you sad and cry"
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