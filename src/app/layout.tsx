import type { Metadata } from "next";
import StoreProvider from "@/app/StoreProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "iTribe - Your E-commerce Platform",
    template: "%s | iTribe",
  },
  description: "Your trusted e-commerce platform for quality products",
  openGraph: {
    title: "iTribe - Your E-commerce Platform",
    description: "Your trusted e-commerce platform for quality products",
    images: [
      {
        url: "/assets/images/i-Tribe-logo.png",
        width: 1200,
        height: 630,
        alt: "iTribe Platform",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="root" className={`${roboto.className} bg-black`}>
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
