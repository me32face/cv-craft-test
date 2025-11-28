"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/navbar/page"; // <- normal import (no lazy)

// Lazy-load ONLY the Footer (code-splitting)
const Footer = dynamic(() => import("@/components/footer/page"), {
  loading: () => null,
});

const blogPosts = [
  {
    slug: "how-to-write-a-job-winning-resume",
    title: "How to Write a Job-Winning Resume in 2025",
    excerpt:
      "Learn the exact structure recruiters expect, from summary to skills, so your resume passes both humans and ATS.",
    category: "Resume Tips",
    readTime: "7 min read",
    date: "Jan 12, 2025",
    tag: "Featured",
    image: "/blog/resume-writing-2025.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "ats-friendly-resume-checklist",
    title: "ATS-Friendly Resume Checklist (Step-by-Step)",
    excerpt:
      "Make sure your CV is readable by Applicant Tracking Systems with this simple, practical checklist.",
    category: "ATS & Optimization",
    readTime: "5 min read",
    date: "Feb 02, 2025",
    tag: "ATS",
    image: "/blog/ats-checklist.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "cover-letter-that-gets-interviews",
    title: "Write a Cover Letter That Actually Gets Interviews",
    excerpt:
      "Stop reusing the same generic cover letter. Use this simple 3-part structure that hiring managers love.",
    category: "Cover Letter",
    readTime: "6 min read",
    date: "Feb 18, 2025",
    tag: "Cover Letter",
    image: "/blog/cover-letter.jpg",
    author: "Career Coach Nisha",
  },
  {
    slug: "linkedin-optimisation-for-jobseekers",
    title: "LinkedIn Optimization for Serious Job Seekers",
    excerpt:
      "Turn your LinkedIn profile into a magnet for recruiters using keywords, headlines, and custom sections.",
    category: "Job Search",
    readTime: "8 min read",
    date: "Mar 02, 2025",
    tag: "LinkedIn",
    image: "/blog/linkedin-optimization.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "fresher-resume-guide-india",
    title: "Fresher Resume Guide for India (With Examples)",
    excerpt:
      "No experience? No problem. Learn how students and freshers can still build a strong, clean resume.",
    category: "Fresher Guide",
    readTime: "9 min read",
    date: "Mar 10, 2025",
    tag: "Fresher",
    image: "/blog/fresher-guide.jpg",
    author: "HR Recruiter Anjali",
  },
  {
    slug: "resume-summary-examples-it-professionals",
    title: "Resume Summary Examples for IT Professionals",
    excerpt:
      "Powerful summary examples for software engineers, testers, and IT leads to grab recruiter attention in seconds.",
    category: "Resume Tips",
    readTime: "6 min read",
    date: "Mar 18, 2025",
    tag: "IT",
    image: "/blog/it-resume-summary.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "resume-summary-examples-non-it-professionals",
    title: "Resume Summary Examples for Non-IT Professionals",
    excerpt:
      "From teachers to sales reps, use these real-world summary examples to position your experience clearly.",
    category: "Resume Tips",
    readTime: "6 min read",
    date: "Mar 25, 2025",
    tag: "Non-IT",
    image: "/blog/non-it-resume-summary.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "common-resume-mistakes-to-avoid",
    title: "10 Common Resume Mistakes to Avoid Immediately",
    excerpt:
      "Typos, wrong format, bad fonts, and overdesign — fix these quick mistakes before sending your next CV.",
    category: "Resume Tips",
    readTime: "5 min read",
    date: "Apr 01, 2025",
    tag: "Checklist",
    image: "/blog/resume-mistakes.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "action-verbs-for-resume-bullets",
    title: "70+ Powerful Action Verbs for Resume Bullet Points",
    excerpt:
      "Replace weak words like 'did' and 'helped' with strong action verbs that prove impact and ownership.",
    category: "Resume Tips",
    readTime: "7 min read",
    date: "Apr 05, 2025",
    tag: "Words",
    image: "/blog/action-verbs-resume.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "customize-resume-for-each-job",
    title: "How to Customize Your Resume for Each Job in 10 Minutes",
    excerpt:
      "A simple workflow to adapt your resume to any job description without rewriting everything from scratch.",
    category: "Resume Tips",
    readTime: "8 min read",
    date: "Apr 10, 2025",
    tag: "Customization",
    image: "/blog/customize-resume-job.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "resume-format-guide-chronological-vs-functional",
    title: "Chronological vs Functional Resume: Which Format to Use?",
    excerpt:
      "Understand the pros and cons of each format and when to choose them based on your experience level.",
    category: "Resume Tips",
    readTime: "6 min read",
    date: "Apr 14, 2025",
    tag: "Format",
    image: "/blog/resume-format-guide.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "resume-tips-career-change",
    title: "Resume Tips for Career Changers (Without Relevant Experience)",
    excerpt:
      "Learn how to highlight transferable skills and projects so hiring managers take your career switch seriously.",
    category: "Resume Tips",
    readTime: "8 min read",
    date: "Apr 18, 2025",
    tag: "Career Change",
    image: "/blog/career-change-resume.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "resume-tips-women-returning-to-work",
    title: "Resume Tips for Women Returning to Work After a Career Break",
    excerpt:
      "Use projects, freelance work, and upskilling to present your break confidently on your resume.",
    category: "Resume Tips",
    readTime: "7 min read",
    date: "Apr 22, 2025",
    tag: "Career Break",
    image: "/blog/women-returning-work.jpg",
    author: "Career Coach Nisha",
  },
  {
    slug: "resume-tips-kerala-jobseekers",
    title: "Resume Tips for Job Seekers from Kerala Applying Globally",
    excerpt:
      "From language choices to address format, make your resume ready for international opportunities.",
    category: "Resume Tips",
    readTime: "6 min read",
    date: "Apr 25, 2025",
    tag: "Kerala",
    image: "/blog/kerala-jobseekers.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "linkedin-headline-examples-jobseekers",
    title: "20 LinkedIn Headline Examples for Active Job Seekers",
    excerpt:
      "Stop using 'Looking for opportunities'. Use focused, keyword-rich headlines that attract recruiters.",
    category: "Job Search",
    readTime: "6 min read",
    date: "Apr 28, 2025",
    tag: "LinkedIn",
    image: "/blog/linkedin-headline.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "linkedin-about-section-guide",
    title: "How to Write a Strong LinkedIn About Section",
    excerpt:
      "Tell your career story in a way that feels human but still optimized for keywords and recruiter search.",
    category: "Job Search",
    readTime: "7 min read",
    date: "May 01, 2025",
    tag: "LinkedIn",
    image: "/blog/linkedin-about-section.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "build-portfolio-website-for-job-search",
    title: "Do You Need a Portfolio Website for Your Job Search?",
    excerpt:
      "When a portfolio helps, what to include, and how to build one quickly using no-code tools.",
    category: "Job Search",
    readTime: "8 min read",
    date: "May 04, 2025",
    tag: "Portfolio",
    image: "/blog/portfolio-website.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "answer-tell-me-about-yourself",
    title: "How to Answer “Tell Me About Yourself” in Interviews",
    excerpt:
      "Use a simple 3-part story formula that works for freshers and experienced professionals.",
    category: "Job Search",
    readTime: "6 min read",
    date: "May 07, 2025",
    tag: "Interview",
    image: "/blog/tell-me-about-yourself.jpg",
    author: "HR Recruiter Anjali",
  },
  {
    slug: "prepare-for-hr-round-interview",
    title: "How to Prepare for the HR Round of Your Interview",
    excerpt:
      "Typical HR questions, what they really test, and how to answer confidently without sounding scripted.",
    category: "Job Search",
    readTime: "7 min read",
    date: "May 10, 2025",
    tag: "Interview",
    image: "/blog/hr-round-interview.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "phone-screen-interview-tips",
    title: "Phone Screen Interview Tips to Get to the Next Round",
    excerpt:
      "Checklist to prepare your space, script, and questions before your first call with recruiters.",
    category: "Job Search",
    readTime: "5 min read",
    date: "May 13, 2025",
    tag: "Phone Screen",
    image: "/blog/phone-screen-interview.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "follow-up-email-after-interview",
    title: "3 Simple Follow-Up Email Templates After an Interview",
    excerpt:
      "Polite, professional follow-up templates you can copy-paste and customize in minutes.",
    category: "Job Search",
    readTime: "5 min read",
    date: "May 16, 2025",
    tag: "Email",
    image: "/blog/follow-up-email.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "salary-negotiation-tips-india",
    title: "Salary Negotiation Tips for Job Seekers in India",
    excerpt:
      "Research, timing, and phrases you can use to negotiate confidently without sounding demanding.",
    category: "Job Search",
    readTime: "8 min read",
    date: "May 20, 2025",
    tag: "Salary",
    image: "/blog/salary-negotiation.jpg",
    author: "Career Coach Nisha",
  },
  {
    slug: "use-ai-for-resume-writing",
    title: "How to Use AI Tools Like ChatGPT to Improve Your Resume",
    excerpt:
      "Prompts you can use to generate bullet points, summaries, and achievement-focused content.",
    category: "ATS & Optimization",
    readTime: "7 min read",
    date: "May 24, 2025",
    tag: "AI",
    image: "/blog/ai-resume-writing.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "software-engineer-resume-keywords",
    title: "35+ Resume Keywords for Software Engineers",
    excerpt:
      "Technical and soft-skill keywords that help your developer resume show up in recruiter searches.",
    category: "ATS & Optimization",
    readTime: "6 min read",
    date: "May 28, 2025",
    tag: "Keywords",
    image: "/blog/software-engineer-keywords.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "marketing-resume-keywords",
    title: "Marketing Resume Keywords Recruiters Actually Search For",
    excerpt:
      "From campaign metrics to tools, add the right keywords without turning your resume into a buzzword list.",
    category: "ATS & Optimization",
    readTime: "6 min read",
    date: "Jun 01, 2025",
    tag: "Keywords",
    image: "/blog/marketing-resume-keywords.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "ats-friendly-resume-layout-guide",
    title: "ATS-Friendly Resume Layout: Fonts, Sections, and File Types",
    excerpt:
      "The safest fonts, headings, bullet styles, and file formats for passing through ATS filters.",
    category: "ATS & Optimization",
    readTime: "7 min read",
    date: "Jun 05, 2025",
    tag: "Layout",
    image: "/blog/ats-layout-guide.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "how-recruiters-read-resumes",
    title: "How Recruiters Read Resumes in Under 10 Seconds",
    excerpt:
      "Peek inside a recruiter’s mind and learn what they scan first — and what they ignore.",
    category: "ATS & Optimization",
    readTime: "8 min read",
    date: "Jun 09, 2025",
    tag: "Recruiter View",
    image: "/blog/recruiter-reading-resume.jpg",
    author: "HR Recruiter Anjali",
  },
  {
    slug: "pass-resume-screening-big-companies",
    title: "How to Pass Resume Screening in Big Companies",
    excerpt:
      "Tweak your resume for large-company hiring pipelines without losing your authentic story.",
    category: "ATS & Optimization",
    readTime: "8 min read",
    date: "Jun 13, 2025",
    tag: "MNC",
    image: "/blog/resume-screening-big-company.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "cover-letter-format-for-freshers",
    title: "Cover Letter Format for Freshers With No Experience",
    excerpt:
      "Step-by-step template freshers can use to introduce themselves confidently to hiring managers.",
    category: "Cover Letter",
    readTime: "6 min read",
    date: "Jun 17, 2025",
    tag: "Fresher",
    image: "/blog/fresher-cover-letter.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "short-cover-letter-examples",
    title: "Short Cover Letter Examples You Can Send in Under 200 Words",
    excerpt:
      "When recruiters are busy, a concise, targeted cover letter can stand out more than a long essay.",
    category: "Cover Letter",
    readTime: "5 min read",
    date: "Jun 21, 2025",
    tag: "Short",
    image: "/blog/short-cover-letter.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "cold-email-cover-letter-template",
    title: "Cold Email Cover Letter Template for Hidden Job Opportunities",
    excerpt:
      "Reach hiring managers directly with a clear, respectful email that highlights your value.",
    category: "Cover Letter",
    readTime: "7 min read",
    date: "Jun 25, 2025",
    tag: "Cold Email",
    image: "/blog/cold-email-cover-letter.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "cover-letter-mistakes-to-avoid",
    title: "7 Cover Letter Mistakes That Make Recruiters Skip You",
    excerpt:
      "Avoid generic openings, overuse of buzzwords, and simple format mistakes that hurt your chances.",
    category: "Cover Letter",
    readTime: "5 min read",
    date: "Jun 29, 2025",
    tag: "Mistakes",
    image: "/blog/cover-letter-mistakes.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "cover-letter-vs-resume-difference",
    title: "Cover Letter vs Resume: What’s the Real Difference?",
    excerpt:
      "Understand the role of each document and how they should work together for a stronger application.",
    category: "Cover Letter",
    readTime: "6 min read",
    date: "Jul 03, 2025",
    tag: "Guide",
    image: "/blog/cover-letter-vs-resume.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "how-to-show-gap-year-on-resume",
    title: "How to Show a Gap Year on Your Resume Without Hiding It",
    excerpt:
      "Turn your gap into a positive by highlighting learning, caregiving, or projects you did in that time.",
    category: "Resume Tips",
    readTime: "7 min read",
    date: "Jul 07, 2025",
    tag: "Gap Year",
    image: "/blog/gap-year-resume.jpg",
    author: "Career Coach Nisha",
  },
  {
    slug: "internship-resume-guide-students",
    title: "Internship Resume Guide for Students in College",
    excerpt:
      "Focus on projects, coursework, and skills instead of experience you don’t yet have.",
    category: "Fresher Guide",
    readTime: "8 min read",
    date: "Jul 11, 2025",
    tag: "Internship",
    image: "/blog/internship-resume.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "resume-for-diploma-students",
    title: "How to Write a Resume for Diploma Students",
    excerpt:
      "Highlight technical training, practical labs, and internships to stand out in entry-level roles.",
    category: "Fresher Guide",
    readTime: "7 min read",
    date: "Jul 15, 2025",
    tag: "Diploma",
    image: "/blog/diploma-student-resume.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "resume-for-career-break-moms",
    title: "Resume Guide for Moms Returning to Work After a Break",
    excerpt:
      "Showcase volunteering, freelance projects, and skills you kept active during your break.",
    category: "Resume Tips",
    readTime: "8 min read",
    date: "Jul 19, 2025",
    tag: "Career Break",
    image: "/blog/mom-returning-work.jpg",
    author: "Career Coach Nisha",
  },
  {
    slug: "one-page-vs-two-page-resume",
    title: "One-Page vs Two-Page Resume: Which One Should You Use?",
    excerpt:
      "Guidelines to decide when a single page is enough and when a second page actually helps.",
    category: "Resume Tips",
    readTime: "5 min read",
    date: "Jul 23, 2025",
    tag: "Length",
    image: "/blog/one-vs-two-page-resume.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "projects-section-for-freshers",
    title: "How to Write the Projects Section in a Fresher Resume",
    excerpt:
      "Turn your academic and personal projects into strong, result-focused bullet points.",
    category: "Fresher Guide",
    readTime: "7 min read",
    date: "Jul 27, 2025",
    tag: "Projects",
    image: "/blog/fresher-projects-section.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "skills-to-add-in-fresher-resume",
    title: "Top Skills to Add in a Fresher Resume (With Examples)",
    excerpt:
      "A mix of technical, behavioral, and tool-based skills recruiters look for in fresh graduates.",
    category: "Fresher Guide",
    readTime: "6 min read",
    date: "Jul 31, 2025",
    tag: "Skills",
    image: "/blog/skills-fresher-resume.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "data-analyst-resume-example-fresher",
    title: "Data Analyst Resume Example for Freshers",
    excerpt:
      "Sample layout and bullet points for entry-level data analysts and analytics enthusiasts.",
    category: "Fresher Guide",
    readTime: "8 min read",
    date: "Aug 04, 2025",
    tag: "Data Analyst",
    image: "/blog/data-analyst-fresher-resume.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "bcom-graduate-resume-example",
    title: "Resume Example for B.Com Graduates Applying for Finance Roles",
    excerpt:
      "Showcase internships, projects, and tools like Excel, Tally, or SAP effectively.",
    category: "Fresher Guide",
    readTime: "7 min read",
    date: "Aug 08, 2025",
    tag: "B.Com",
    image: "/blog/bcom-graduate-resume.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "resume-tips-government-job-exams",
    title: "Resume Tips for Government Job Exams and PSU Roles",
    excerpt:
      "Structure your resume for government, PSU, and public-sector applications in India.",
    category: "Job Search",
    readTime: "7 min read",
    date: "Aug 12, 2025",
    tag: "Government",
    image: "/blog/government-job-resume.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "how-to-write-achievements-in-resume",
    title: "How to Write Achievements in Your Resume (With Metrics)",
    excerpt:
      "Convert responsibilities into measurable achievements using numbers, percentages, and outcomes.",
    category: "Resume Tips",
    readTime: "7 min read",
    date: "Aug 16, 2025",
    tag: "Achievements",
    image: "/blog/achievements-resume.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "hobbies-and-interests-in-resume",
    title: "Should You Add Hobbies and Interests in Your Resume?",
    excerpt:
      "When hobbies help, when they hurt, and examples that actually add value to your profile.",
    category: "Resume Tips",
    readTime: "5 min read",
    date: "Aug 20, 2025",
    tag: "Hobbies",
    image: "/blog/hobbies-interests-resume.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "should-you-add-photo-to-resume-india",
    title: "Should You Add a Photo to Your Resume in India?",
    excerpt:
      "Understand when a photo is helpful, when it’s risky, and global standards for headshots on CVs.",
    category: "Resume Tips",
    readTime: "6 min read",
    date: "Aug 24, 2025",
    tag: "Photo",
    image: "/blog/photo-on-resume.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "how-to-email-your-resume-to-hr",
    title: "How to Email Your Resume to HR (Subject Lines + Templates)",
    excerpt:
      "Professional subject lines and email bodies that look clean and make it easy for HR to respond.",
    category: "Job Search",
    readTime: "6 min read",
    date: "Aug 28, 2025",
    tag: "Email",
    image: "/blog/email-resume-to-hr.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "build-linkedin-network-fast",
    title: "How to Build a Strong LinkedIn Network Without Spamming",
    excerpt:
      "Connection request templates, follow-up ideas, and content tips to attract the right people.",
    category: "Job Search",
    readTime: "8 min read",
    date: "Sep 01, 2025",
    tag: "Networking",
    image: "/blog/linkedin-networking.jpg",
    author: "CV Craft Experts",
  },
  {
    slug: "job-search-strategy-while-working",
    title: "Job Search Strategy When You’re Already Working Full-Time",
    excerpt:
      "Balance your current job with a discreet, effective search for your next opportunity.",
    category: "Job Search",
    readTime: "8 min read",
    date: "Sep 05, 2025",
    tag: "Strategy",
    image: "/blog/job-search-while-working.jpg",
    author: "CV Craft Team",
  },
  {
    slug: "checklist-before-submitting-resume",
    title: "Final Checklist Before Submitting Your Resume",
    excerpt:
      "A quick pre-send checklist to catch errors, broken links, and missing sections in under 5 minutes.",
    category: "Resume Tips",
    readTime: "5 min read",
    date: "Sep 09, 2025",
    tag: "Checklist",
    image: "/blog/resume-final-checklist.jpg",
    author: "CV Craft Team",
  },
];

const categories = [
  "All",
  "Resume Tips",
  "Job Search",
  "Cover Letter",
  "ATS & Optimization",
  "Fresher Guide",
];

// --- Lazy Blog Card (post + image lazy, rendering triggered when in view) ---
function LazyBlogCard({ post }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "150px", // start loading a bit before it appears
        threshold: 0.1,
      }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      {isVisible ? (
        <>
          <div className="relative w-full h-40 sm:h-44">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 50vw,
                     33vw"
              loading="lazy"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 sm:p-5 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                {post.category}
              </span>
              <span className="text-[11px] sm:text-xs text-gray-400">
                {post.readTime}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#342D4C] mb-1 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-3 mb-3">
              {post.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between text-[11px] sm:text-xs text-gray-400">
              <span>{post.date}</span>
              <span>{post.author}</span>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-3 inline-flex items-center text-xs sm:text-sm font-semibold text-purple-600 group-hover:text-purple-700"
            >
              Read more
              <span className="ml-1 group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </div>
        </>
      ) : (
        // Skeleton placeholder before the card becomes visible
        <div className="animate-pulse">
          <div className="w-full h-40 sm:h-44 bg-gray-200" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded-full" />
              <div className="h-4 w-10 bg-gray-200 rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-3 w-1/3 bg-gray-200 rounded mt-4" />
          </div>
        </div>
      )}
    </article>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;

      const search = searchTerm.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(search) ||
        post.excerpt.toLowerCase().includes(search) ||
        post.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const featuredPost = blogPosts[0];
  const isSearching = searchTerm.trim().length > 0;

  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <>
      {/* Navbar is NOT lazy-loaded */}
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-[#EDF2FD] to-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <section className="text-center mb-10 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#342D4C] mb-3">
              Career & Resume Advice
            </h1>
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Actionable tips on resumes, ATS optimization, LinkedIn, and
              job-search strategy — written for real job seekers like you.
            </p>
          </section>

          {/* Search + Filters */}
          <section className="mb-10 sm:mb-12">
            <div className="flex flex-col gap-4 sm:items-center sm:justify-between">
              {/* Search */}
              <div className="w-full sm:w-1/2 relative">
                <input
                  type="text"
                  placeholder="Search articles (e.g. ATS, fresher, LinkedIn)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  ref={searchInputRef}
                  className="w-full border border-gray-300 rounded-full px-4 py-2.5 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white shadow-sm"
                />

                {searchTerm ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ×
                  </button>
                ) : (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ⌕
                  </span>
                )}
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide sm:justify-end">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={
                      activeCategory === cat
                        ? "px-4 py-1.5 whitespace-nowrap rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#4F8DF9] to-[#8A3FFC]"
                        : "px-4 py-1.5 whitespace-nowrap rounded-full text-xs sm:text-sm border border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Post - HIDE WHEN SEARCHING */}
          {featuredPost && !isSearching && (
            <section className="mb-12 sm:mb-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center bg-white rounded-3xl shadow-md p-4 sm:p-6 lg:p-8 border border-gray-100">
                <div className="relative w-full h-56 sm:h-64 md:h-72 rounded-2xl overflow-hidden">
                  {/* Featured image: eager load (above the fold) */}
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 768px) 100vw,
                           (max-width: 1200px) 50vw,
                           50vw"
                    loading="eager"
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <span className="inline-flex items-center text-[11px] sm:text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                    ⭐ Featured · {featuredPost.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#342D4C]">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-gray-500">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                    <span>•</span>
                    <span>By {featuredPost.author}</span>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center text-sm sm:text-base font-semibold text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#4D72F4] to-[#7444EE] hover:opacity-95 mt-2"
                  >
                    Read Article
                    <svg
                      className="w-4 h-4 ml-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Blog Grid */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#342D4C] mb-4 sm:mb-6">
              Latest Articles
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="text-center text-gray-500 text-sm sm:text-base py-8 bg-white border border-dashed border-gray-300 rounded-2xl">
                No articles found. Try a different keyword or category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <LazyBlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer is lazy-loaded via dynamic import */}
      <Footer />
    </>
  );
}