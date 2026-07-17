import type { Metadata } from "next";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

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
      <body className="font-sans antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
        <ToastProvider />
      </body>
    </html>
  );
}
