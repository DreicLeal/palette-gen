import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ColorsProvider from "@/context/colorsContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Palette Generation",
  description: "Create a palette color for your business with AI",
  icons: {
    icon: "/favicon.png",
  },
  other: {
    "google-adsense-account": "ca-pub-2263727171319959",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ColorsProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Script
            async
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2263727171319959"
            crossOrigin="anonymous"
          />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2263727171319959"
            crossOrigin="anonymous"
          ></script>
          <ins
            className="adsbygoogle"
            style={{display:"block"}}
            data-ad-client="ca-pub-2263727171319959"
            data-ad-slot="7265914799"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          {children}
        </body>
      </ColorsProvider>
    </html>
  );
}
