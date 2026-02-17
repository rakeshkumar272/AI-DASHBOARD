import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusDash | AI-Powered Analytics",
  description: "Modern glassmorphism dashboard for AI insights",
};

import ExtensionSafety from "@/components/ExtensionSafety";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <ExtensionSafety />
        <div className="h-[100dvh] flex flex-col">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
