import type { Metadata } from "next";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { SITE_NAME } from "@/constants";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  FAVICON_PATH,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: FAVICON_PATH, type: "image/png" }],
    shortcut: FAVICON_PATH,
    apple: FAVICON_PATH,
  },
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
        <ToastProvider />
      </body>
    </html>
  );
}
