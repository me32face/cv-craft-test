"use client";
import React from "react";
import { Linkedin, Github, Twitter, Globe } from "lucide-react";

const detectPlatformKey = (url) => {
  const lower = url.toLowerCase();
  if (lower.includes("linkedin")) return "linkedin";
  if (lower.includes("github")) return "github";
  if (lower.includes("twitter") || lower.includes("x.com")) return "twitter";
  return "other";
};

const iconMap = {
  linkedin: <Linkedin size={16} />,
  github: <Github size={16} />,
  twitter: <Twitter size={16} />,
  other: <Globe size={16} />
};

export default function SocialLinkDisplay({ link }) {
  const platform = detectPlatformKey(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      data-link={link.url}
      className="social-link flex items-center gap-1 text-blue-600"
      style={{
        display: "",
        alignItems: "center",
        verticalAlign: "middle",
        whiteSpace: "nowrap",
        lineHeight: "1.2"
      }}
    >
      {link.useIcon && (
        <span
          style={{
            width: "14px",
            height: "14px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          {iconMap[platform]}
        </span>
      )}
      <span style={{ fontSize: "12px", display: "inline-block", lineHeight: "16px"  }}>
        {link.label}
      </span>
    </a>
  );
}

