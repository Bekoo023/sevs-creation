import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/great-vibes/400.css";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Handgemaakte geboortelijsten en satijnen boeketten`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: "/images/trio-daglicht.jpg", width: 1536, height: 1024, alt: "Drie handgemaakte geboortelijsten van Sevs Creations" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#faf7f2" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className="antialiased">
      <body className="min-h-dvh">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
