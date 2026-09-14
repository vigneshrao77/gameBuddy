import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const baloo = Baloo_2({ 
  subsets: ["latin"],
  variable: '--font-display',
  weight: ['500', '600', '700', '800']
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body',
  weight: ['400', '500', '600']
});

export const metadata: Metadata = {
  title: "GameHub — quick games, zero setup",
  description: "Tiny browser games you can start in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${baloo.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
