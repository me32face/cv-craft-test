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


export const metadata: Metadata = {
  metadataBase: new URL("https://cvcraft.in"),

  title: {
    default: "CVCraft – Create Professional CVs in Minutes",
    template: "%s | CVCraft",
  },

  description:
    "Build stunning professional CVs using AI-powered templates. Fast, simple, modern resume builder with export options.",

  keywords: [
    "cv builder online",
    "resume maker",
    "ats resume builder",
    "free cv builder",
    "professional cv templates",
    "cv generator",
    "modern resume templates",
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
        url: "https://cvcraft.in/og-image.png",
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
    images: ["https://cvcraft.in/og-image.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CV Craft",
              url: "https://cvcraft.in",
              applicationCategory: "ResumeBuilderApplication",
              operatingSystem: "All",
              description: "AI-powered CV & Resume builder.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              url: "https://cvcraft.in",
              logo: "https://cvcraft.in/mainlogo.png",
              name: "CV Craft",
              sameAs: [
                "https://www.instagram.com/",
                "https://www.linkedin.com/",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is CV Craft free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, CV Craft allows you to build professional CVs for free.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does CV Craft support ATS-friendly resumes?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, all CV Craft templates are optimized to pass ATS scans.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I download my CV as PDF?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, CV Craft allows instant PDF download.",
                  },
                },
              ],
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
