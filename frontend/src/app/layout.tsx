import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Crusoe Tech",
    template: "%s | Crusoe Tech",
  },
  description: "Professional technology solutions and services.",
  keywords: ["technology", "services", "consulting"],
  openGraph: {
    title: "Crusoe Tech",
    description: "Professional technology solutions and services.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="font-sans antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
        <ToastProvider />
      </body>
    </html>
  );
}
