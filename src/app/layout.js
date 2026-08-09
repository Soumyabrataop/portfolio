import { GeistSans } from "geist/font/sans";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroller from "@/components/SmoothScroller";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GrainOverlay from "@/components/GrainOverlay";
import MobileBottomNav from "@/components/MobileBottomNav";
import CarLoader from "@/components/CarLoader";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});

export const metadata = {
  title: "Soumyabrata Mukherjee | Portfolio",
  description: "Open Source Contributor & AI Developer",
  other: {
    "msapplication-navbutton-color": "#0a0a0a",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-capable": "true",
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="msapplication-navbutton-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="true" />
      </head>
      <body className={`${GeistSans.variable} ${instrumentSerif.variable} antialiased`} suppressHydrationWarning>
        <CarLoader />
        <GrainOverlay />
        <SmoothScroller>
          <Nav />
          {children}
          <Footer />
          <MobileBottomNav />
        </SmoothScroller>
      </body>
    </html>
  );
}
