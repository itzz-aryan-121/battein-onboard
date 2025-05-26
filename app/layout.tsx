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
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Baatein - Voice Calling App",
  description: "Join Baatein as a partner and earn ₹40,000-₹80,000 monthly",
  keywords: "voice calling, partner program, earn money, Baatein, voice platform",
  authors: [{ name: "Baatein Team" }],
  creator: "Baatein",
  publisher: "Baatein",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/assets/Baaten Logo 6.ico',
    apple: '/assets/Baaten Logo 6.png',
    shortcut: '/assets/Baaten Logo 6.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Baatein - Voice Calling App",
    description: "Join Baatein as a partner and earn ₹40,000-₹80,000 monthly",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: "#F5BC1C",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Import animations.css from public directory */}
        <link rel="stylesheet" href="/animations.css" />
        {/* Add preconnect for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Prevent zoom on input focus for iOS */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-gray-900 overflow-x-hidden`}
      >
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#F5BC1C',
                secondary: '#fff',
              },
            },
          }}
        />
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