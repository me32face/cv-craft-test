// app/blog/[slug]/page.jsx
// Server component – NO "use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/page";
import Footer from "@/components/footer/page";
import { blogData } from "../blogData";

// Small helper to create ids for headings (for the TOC)
const slugifyHeading = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Optional: dynamic metadata (SEO)
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const post =
    (blogData && blogData[slug]) ||
    (blogData && Object.values(blogData).find((p) => p.slug === slug));

  if (!post) {
    return {
      title: "CV Craft Blog",
      description: "Resume tips, cover letter guides, and job search strategies.",
    };
  }

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description,
    keywords: post.seo?.keywords,
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogInnerPage({ params }) {
  // Next 15/16: params is a Promise
  const { slug } = await params;

  const post =
    (blogData && blogData[slug]) ||
    (blogData && Object.values(blogData).find((p) => p.slug === slug));

  // Collect headings for TOC
  const headings = Array.isArray(post?.content)
    ? post.content.filter((block) => block.type === "heading")
    : [];

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-[#EDF2FD] to-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#342D4C] mb-3">
              Article not found
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              We couldn&apos;t find any blog article for this link.
            </p>

            <Link
              href="/blog"
              aria-label="Back to all blog articles"
              className="inline-flex mt-6 text-sm sm:text-base text-white font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4D72F4] to-[#7444EE] hover:opacity-95"
            >
              ← Back to all articles
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Use inner image if present, otherwise fallback to cover image
  const heroImage =
    post.innerImages && post.innerImages.length > 0
      ? post.innerImages[0]
      : post.image;

  // Build related posts (same category)
  const allPosts = Object.values(blogData);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  // Previous / next post (based on insertion order in blogData)
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Share URLs (replace NEXT_PUBLIC_SITE_URL in env for production)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  const encodedUrl = encodeURIComponent(canonicalUrl);
  const encodedTitle = encodeURIComponent(post.title);

  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const whatsappShare = `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-[#EDF2FD] via-white to-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5 flex flex-wrap items-center gap-1">
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate inline-block max-w-[70%] align-bottom">
              {post.title}
            </span>
          </div>

          {/* Main card */}
          <section className="bg-white rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-[#4D72F4] via-[#8A3FFC] to-[#F97316]" />

            {/* Header: category + title + meta + description */}
            <header className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <p className="inline-flex items-center text-[11px] sm:text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                  {post.category}
                </p>

                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-400">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                    Guide • 2025
                  </span>
                  <span>CV Craft Blog</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E1635] leading-tight mb-3">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-500 items-center">
                <span className="flex items-center gap-1">
                  <span className="inline-flex h-6 w-6 rounded-full bg-gradient-to-tr from-[#4D72F4] to-[#8A3FFC] text-[10px] text-white items-center justify-center font-semibold">
                    {post.author?.charAt(0) ?? "C"}
                  </span>
                  <span>By {post.author}</span>
                </span>
                <span>•</span>
                <time dateTime={post.date}>{post.date}</time>
                <span>•</span>
                <span>{post.readTime}</span>

                {/* Simple share row */}
                <span className="hidden sm:inline mx-1 text-slate-300">|</span>
                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                  <span className="text-[11px] sm:text-xs text-slate-500">
                    Share:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={linkedinShare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:border-[#4D72F4] hover:text-[#4D72F4]"
                    >
                      in
                    </Link>
                    <Link
                      href={twitterShare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:border-[#4D72F4] hover:text-[#4D72F4]"
                    >
                      X
                    </Link>
                    <Link
                      href={whatsappShare}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:border-[#4D72F4] hover:text-[#4D72F4]"
                    >
                      WA
                    </Link>
                  </div>
                </div>
              </div>

              {post.seo?.description && (
                <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-3xl">
                  {post.seo.description}
                </p>
              )}
            </header>

            {/* Hero Image */}
            <div className="relative w-full h-52 sm:h-64 lg:h-80 bg-slate-100 overflow-hidden sm:rounded-2xl sm:mx-4 sm:mt-3 sm:mb-6 sm:shadow-[0_18px_40px_rgba(15,23,42,0.20)]">
              <Image
                src={heroImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 80vw,
                       800px"
                className="object-contain"
                priority
              />
            </div>

            {/* Article body + sidebar */}
            <div className="px-4 sm:px-8 lg:px-10 py-8 sm:py-10">
              {/* Mobile TOC */}
              {headings.length > 0 && (
                <div className="lg:hidden mb-6">
                  <details className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <summary className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                      Jump to section
                    </summary>
                    <ul className="mt-3 space-y-1.5 text-xs sm:text-sm text-slate-700">
                      {headings.map((h, index) => {
                        const id = slugifyHeading(h.text);
                        return (
                          <li key={index}>
                            <a
                              href={`#${id}`}
                              className="block hover:text-[#4D72F4]"
                            >
                              {h.text}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
                {/* MAIN ARTICLE */}
                <article
                  className="
                    blog-article
                    prose prose-sm sm:prose-base lg:prose-lg
                    max-w-none sm:max-w-3xl lg:max-w-3xl lg:flex-1
                    prose-headings:text-[#1E1635]
                    prose-headings:font-semibold
                    prose-h2:text-xl sm:prose-h2:text-2xl
                    prose-h2:mt-10 prose-h2:mb-2
                    prose-p:text-gray-700
                    prose-p:leading-[1.8]
                    prose-li:text-gray-700
                    prose-li:leading-[1.8]
                    prose-ul:list-disc
                    prose-ul:pl-5
                    prose-ul:space-y-1.5
                    prose-ul:marker:text-[#4D72F4]
                    prose-strong:text-[#1E1635]
                    prose-a:text-[#4D72F4]
                    prose-a:no-underline
                    hover:prose-a:underline
                  "
                >
                {post.content?.map((block, index) => {
                if (block.type === "heading") {
                    const id = slugifyHeading(block.text);

                    // Try to highlight leading number like "1." or "2."
                    const match = block.text.match(/^(\d+)\.\s*(.*)$/);
                    const hasNumber = !!match;
                    const number = match?.[1];
                    const label = match?.[2] || block.text;

                    return (
                    <div key={index} className="mt-10 first:mt-0">
                        <h2 id={id} className="pb-3">
                        {hasNumber && (
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/5 text-xs font-semibold text-[#4D72F4]">
                            {number}
                            </span>
                        )}

                        {/* This span only wraps the text, and the underline sits on it */}
                        <span className="relative inline-block">
                            {label}
                            <span
                            className="
                                absolute
                                left-0
                                -bottom-2   /* pushes the line a bit below the text = gap */
                                h-[4px]
                                w-40
                                rounded-full
                                bg-gradient-to-r from-[#4D72F4] via-[#8A3FFC] to-[#F97316]
                            "
                            />
                        </span>
                        </h2>
                    </div>
                    );
                }

                if (block.type === "paragraph") {
                    return <p key={index}>{block.text}</p>;
                }

                if (block.type === "list") {
                    return (
                    <ul key={index}>
                        {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                        ))}
                    </ul>
                    );
                }

                if (block.type === "example") {
                    return (
                    <div
                        key={index}
                        className="not-prose my-6 rounded-xl border border-purple-100 bg-purple-50/70 px-4 sm:px-5 py-3 sm:py-4 shadow-[0_12px_30px_rgba(148,163,184,0.4)]"
                    >
                        <p className="text-[11px] sm:text-xs font-semibold text-purple-700 mb-1 uppercase tracking-wide">
                        {block.label}
                        </p>
                        <p className="text-sm sm:text-base text-[#1E1635] leading-relaxed">
                        {block.text}
                        </p>
                    </div>
                    );
                }

                // Optional: tips callout
                if (block.type === "tip") {
                    return (
                    <div
                        key={index}
                        className="not-prose my-6 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 sm:px-5 py-3 sm:py-4"
                    >
                        <p className="text-[11px] sm:text-xs font-semibold text-emerald-700 mb-1 uppercase tracking-wide">
                        {block.label || "Tip"}
                        </p>
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                        {block.text}
                        </p>
                    </div>
                    );
                }

                // Optional: neutral note callout
                if (block.type === "note") {
                    return (
                    <div
                        key={index}
                        className="not-prose my-6 rounded-xl border border-sky-100 bg-sky-50 px-4 sm:px-5 py-3 sm:py-4"
                    >
                        <p className="text-[11px] sm:text-xs font-semibold text-sky-700 mb-1 uppercase tracking-wide">
                        {block.label || "Note"}
                        </p>
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                        {block.text}
                        </p>
                    </div>
                    );
                }

                if (block.type === "image") {
                    return (
                    <div
                        key={index}
                        className="not-prose relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden my-8 shadow-sm border border-gray-100 bg-gray-100"
                    >
                        <Image
                        src={block.src}
                        alt={block.alt || post.title}
                        fill
                        className="object-contain"
                        />
                    </div>
                    );
                }

                return null;
                })}
                </article>

                {/* SIDEBAR */}
                <aside className="mt-8 lg:mt-1 lg:w-64 shrink-0 space-y-6 lg:sticky lg:top-28">
                  {/* Article details card */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-5 sm:py-5">
                    <h3 className="text-xs font-semibold tracking-wide text-[#8A3FFC] uppercase mb-3">
                      Article details
                    </h3>
                    <dl className="space-y-2 text-xs sm:text-sm text-slate-700">
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Category</dt>
                        <dd className="text-right font-medium">
                          {post.category}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Published</dt>
                        <dd className="text-right">
                          <time dateTime={post.date}>{post.date}</time>
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Read time</dt>
                        <dd className="text-right">{post.readTime}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">Author</dt>
                        <dd className="text-right">{post.author}</dd>
                      </div>
                    </dl>

                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <p className="text-[11px] sm:text-xs text-slate-500 mb-2">
                        Tip: Save this guide so you can update your resume
                        before each new application.
                      </p>
                    </div>
                  </div>

                  {/* Table of contents – desktop */}
                  {headings.length > 0 && (
                    <div className="hidden lg:block">
                      <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4 sm:px-5 sm:py-5 shadow-[0_10px_30px_rgba(148,163,184,0.35)]">
                        <h3 className="text-xs font-semibold tracking-wide  uppercase mb-3 text-[#8A3FFC]">
                          In this article
                        </h3>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                          {headings.map((h, index) => {
                            const id = slugifyHeading(h.text);
                            return (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-slate-300" />
                                <a
                                  href={`#${id}`}
                                  className="flex-1 hover:text-[#4D72F4] hover:translate-x-0.5 transition-transform"
                                >
                                  {h.text}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Related articles */}
                  {relatedPosts.length > 0 && (
                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4 sm:px-5 sm:py-5">
                      <h3 className="text-xs font-semibold tracking-wide uppercase mb-3 text-[#8A3FFC]">
                        Related articles
                      </h3>
                      <ul className="space-y-3 text-xs sm:text-sm">
                        {relatedPosts.map((rp) => (
                          <li key={rp.slug}>
                            <Link
                              href={`/blog/${rp.slug}`}
                              className="font-medium text-slate-800 hover:text-[#4D72F4]"
                            >
                              {rp.title}
                            </Link>
                            <p className="text-[11px] text-slate-500">
                              {rp.readTime} • {rp.category}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </aside>
              </div>

              {/* Author box */}
              <div className="mt-10 max-w-3xl mx-auto rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-6 sm:py-5 flex gap-3 sm:gap-4 items-center">
                <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-tr from-[#4D72F4] to-[#8A3FFC] text-white text-lg font-semibold shrink-0">
                  {post.author?.charAt(0) ?? "C"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E1635]">
                    {post.author}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Part of the CV Craft team helping job seekers build
                    clean, ATS-friendly resumes and cover letters.
                  </p>
                </div>
              </div>

              {/* Bottom CTA + back link + prev/next */}
              <div className="mt-10 max-w-3xl mx-auto border-t border-slate-100 pt-6 space-y-6">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1E1635]">
                      Ready to apply what you learned?
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Use CV Craft to turn these tips into a clean, ATS-friendly
                      resume in minutes.
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-white px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#4D72F4] to-[#7444EE] hover:opacity-95"
                  >
                    Build my resume
                  </Link>
                </div>

                {/* Previous / Next navigation */}
                {(previousPost || nextPost) && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-sm">
                    {previousPost ? (
                      <Link
                        href={`/blog/${previousPost.slug}`}
                        className="sm:max-w-[45%] text-purple-600 hover:text-purple-700"
                      >
                        ← {previousPost.title}
                      </Link>
                    ) : (
                      <span />
                    )}
                    {nextPost && (
                      <Link
                        href={`/blog/${nextPost.slug}`}
                        className="sm:max-w-[45%] sm:text-right text-purple-600 hover:text-purple-700"
                      >
                        {nextPost.title} →
                      </Link>
                    )}
                  </div>
                )}

                <Link
                  href="/blog"
                  aria-label="Back to all blog articles"
                  className="inline-flex items-center text-sm sm:text-base font-semibold text-purple-600 hover:text-purple-700"
                >
                  ← Back to all articles
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}