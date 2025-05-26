import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./animations.css"; 
import { LanguageProvider } from "./context/LanguageContext";
import { UserDataProvider } from "./context/UserDataContext";
import { Toaster } from 'react-hot-toast';
import ResumeLastPage from './ResumeLastPage';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baatein - Voice Calling App",
  description: "Join Baatein as a partner and earn ₹40,000-₹80,000 monthly",
  icons: {
    icon: '/assets/Baaten Logo 6.ico',
    apple: '/assets/Baaten Logo 6.png',
    shortcut: '/assets/Baaten Logo 6.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#F5BC1C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Import animations.css from public directory */}
        <link rel="stylesheet" href="/animations.css" />
        {/* Add preconnect for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        <UserDataProvider>
          <LanguageProvider>
            <ResumeLastPage />
            <div className="page-fade">{children}</div>
          </LanguageProvider>
        </UserDataProvider>
      </body>
    </html>
  );
}