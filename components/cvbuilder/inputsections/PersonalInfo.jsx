"use client";
import React from "react";

export default function PersonalInfo({ data, update }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold">Full name</label>
        <input className="w-full border p-2 rounded" value={data.name || ""} onChange={(e) => update("name", e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-semibold">Title</label>
        <input className="w-full border p-2 rounded" value={data.title || ""} onChange={(e) => update("title", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold">Phone</label>
          <input className="w-full border p-2 rounded" value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input className="w-full border p-2 rounded" value={data.email || ""} onChange={(e) => update("email", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold">Address</label>
        <input className="w-full border p-2 rounded" value={data.address || ""} onChange={(e) => update("address", e.target.value)} />
      </div>
    </div>
  );
}
