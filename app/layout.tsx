import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import Navigation from '@/components/navigation'
import SplashScreen from '@/components/splash-screen'
import CursorSystem from '@/components/cursor-system';
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Gervin Lee Portfolio',
  description: 'Professional portfolio of Gervin Lee, a BSIT student specializing in web development, UI/UX design, and software engineering.',
  icons: {
    icon: [
      {
        url: '/assets/favicon.png',
        href: '/assets/favicon.png',
      }
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CursorSystem />
          <SplashScreen />
          <Navigation />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}