import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
        <ToastProvider />
      </body>
    </html>
  );
}
