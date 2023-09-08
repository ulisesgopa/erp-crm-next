import "./globals.css";
import { Inter } from "next/font/google";
import {createTranslator, NextIntlClientProvider} from 'next-intl';

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SaasHQ",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + "h-screen overflow-hidden"}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
