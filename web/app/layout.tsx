import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PolyglotProvider } from '@/providers/PolyglotProvider';

export const metadata = {
  description: "A simple navation panel.",
  keywords: "navigation, panel, react, typescript, nextjs, tailwindcss",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <PolyglotProvider>
          {children}
        </PolyglotProvider>
        <Toaster position="top-right" duration={3000} />
      </body>
    </html>
  );
}
