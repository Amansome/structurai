import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { type Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Nextjs Authentication",
  description: "Create Nextjs app with Google and Credential Authentication",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>{children}
      <Toaster />

      </body>
    </html>
  );
}
