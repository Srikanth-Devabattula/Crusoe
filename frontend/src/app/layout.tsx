import type { Metadata } from "next";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { SITE_NAME } from "@/constants";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  FAVICON_PATH,
  GOOGLE_SITE_VERIFICATION,
  HOME_SEO_TITLE,
  SITE_OG_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_SEO_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_OG_NAME,
  icons: {
    icon: [{ url: FAVICON_PATH, type: "image/png" }],
    shortcut: FAVICON_PATH,
    apple: FAVICON_PATH,
  },
  openGraph: {
    title: HOME_SEO_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    locale: "en_IN",
    siteName: SITE_OG_NAME,
    url: "/",
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_OG_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
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
