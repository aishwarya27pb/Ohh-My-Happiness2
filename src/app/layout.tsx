/** Root Layout - Ohh My Happiness */
import type { Metadata } from "next";
import { Geist, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { ScrollAnimationManager } from "@/components/ScrollAnimationManager";
import PageTransition from "@/components/ui/PageTransition";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Ohh My Happiness — Your requirement is our responsibility.",
    template: "%s | Ohh My Happiness",
  },
  description:
    "India's most trusted corporate & personal gifting brand. Premium hampers, customized gifts, and bulk corporate gifting solutions. Your requirement is our responsibility.",
  keywords: [
    "corporate gifting",
    "personal gifting",
    "gift hampers",
    "customized gifts",
    "diwali gifts",
    "onboarding kits",
    "bulk gifting",
    "India",
  ],
  openGraph: {
    title: "Ohh My Happiness — Your requirement is our responsibility.",
    description: "India's most trusted corporate & personal gifting brand.",
    type: "website",
    locale: "en_IN",
    siteName: "Ohh My Happiness",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ohh My Happiness",
    description: "India's most trusted corporate & personal gifting brand.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ChatWidget } from "@/components/chat/ChatWidget";
import Analytics from "@/components/Analytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} ${playfair.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FFF9EE]">
        <CartProvider>
          <WishlistProvider>
            <Suspense fallback={null}>
              <ScrollAnimationManager />
            </Suspense>
            <PageTransition>
              {children}
            </PageTransition>
            <Toaster position="top-center" />
            <ChatWidget />
            <Analytics />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
