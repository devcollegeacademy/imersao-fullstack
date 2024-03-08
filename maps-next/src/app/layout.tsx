import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

declare global {
    interface Window {
        google: any;
    }
}

export const metadata: Metadata = {
  title: "Guia Local",
  description: "Explore o mundo com um sorisso!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIBkZEexyq3td0QPGZHb9B_-s7-wm6y6I&libraries=places"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
