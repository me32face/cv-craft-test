"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import CVBuilder from "@/components/cvbuilder/CVBuilder";
import { templates } from "@/components/templates";

export default function TemplatePage({ params }) {
  const resolvedParams = use(params);
  const templateKey = resolvedParams.id?.toLowerCase() || "template30";

  if (!templates[templateKey]) {
    notFound();
  }

  return <CVBuilder initialTemplate={templateKey} />;
}
