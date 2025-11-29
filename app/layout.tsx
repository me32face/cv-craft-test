import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import "../styles/hover-styles.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* ---------------------------------------------
   ⭐ FULL SEO CONFIG FOR CV-CRAFT
----------------------------------------------*/
export const metadata: Metadata = {
  metadataBase: new URL("https://cvcraft.in"),

  title: {
    default: "CV Craft – Create Professional CVs in Minutes",
    template: "%s | CV Craft",
  },

  description:
    "Build stunning professional CVs using AI-powered templates. Fast, simple, modern resume builder with export options.",

  keywords: [
    "resume builder",
    "cv maker",
    "cvcraft",
    "cv-craft",
    "professional resume",
    "cv templates",
    "free resume builder",
    "online cv generator",
  ],

  openGraph: {
    title: "CV Craft – Professional Resume Builder",
    description:
      "Create professional CVs instantly using modern templates with AI assistance.",
    url: "https://cvcraft.in",
    siteName: "CV Craft",
    images: [
      {
        url: "/mainlogo.png",
        width: 1200,
        height: 630,
        alt: "CV Craft Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CV Craft – Build a Professional CV",
    description:
      "Design beautiful CVs instantly using ready-made templates.",
    images: ["/mainlogo.png"],
  },

  alternates: {
    canonical: "https://cvcraft.in",
  },

  robots: {
    index: true,
    follow: true,
  },
};

/* ---------------------------------------------
   ROOT LAYOUT
----------------------------------------------*/
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* ⭐ JSON-LD SCHEMA FOR GOOGLE SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CV Craft",
              url: "https://cvcraft.in",
              description:
                "Create stunning professional CVs easily using AI-powered resume builder tools.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://cvcraft.in/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
