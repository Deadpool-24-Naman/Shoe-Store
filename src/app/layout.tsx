import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import SpinWheelWidget from "@/components/SpinWheelWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KICKS. Streetwear Sneaker Store",
  description: "Your ultimate destination for premium Gen-Z footwear & limited streetwear drops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <SpinWheelWidget />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
