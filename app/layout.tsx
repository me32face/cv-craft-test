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
    default: "CVCraft – Create Professional CVs in Minutes",
    template: "%s | CVCraft",
  },

  description:
    "Build stunning professional CVs using AI-powered templates. Fast, simple, modern resume builder with export options.",

  keywords: [
    "resume builder",
    "cvmaker",
    "cvcraft",
    "cv-craft",
    "professional resume",
    "cvtemplates",
    "free resume builder",
    "online cv generator",
  ],

  openGraph: {
    title: "CVCraft – Professional Resume Builder",
    description:
      "Create professional CVs instantly using modern templates with AI assistance.",
    url: "https://cvcraft.in",
    siteName: "CVCraft",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
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
