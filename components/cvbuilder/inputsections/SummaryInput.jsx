"use client";
import React from "react";

export default function SummaryInput({ summary, setSummary }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">Professional Summary</label>
      <textarea
        className="w-full border p-2 rounded"
        rows="6"
        value={summary || ""}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Write a brief summary about yourself..."
      />
    </div>
  );
}