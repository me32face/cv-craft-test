"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import CVBuilder from "@/components/cvbuilder/CVBuilder";
import { templates } from "@/components/templates";

export default function TemplatePage({ params }) {
  const { id } = use(params);
  const templateKey = id.toLowerCase();
  
  if (!templates[templateKey]) {
    notFound();
  }

  return <CVBuilder initialTemplate={templateKey} />;
}
