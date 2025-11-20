"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";

/**
 * Props:
 * - skills: Array (could be strings or objects depending on format)
 * - setSkills: function(updatedArray)
 *
 * Supported display formats:
 * - "bullet"     -> skills = ["React", "HTML"]
 * - "percentage" -> skills = [{ name: "React", proficiency: 80 }, ...]
 * - "category"   -> skills = [{ category: "Frontend", items: ["React","Vue"] }, ...]
 */

export default function SkillsInput({ skills = [], setSkills }) {
  // Normalize input
  const normalized = Array.isArray(skills) ? skills : [];

  // determine initial format to avoid hydration mismatch
  const detectFormat = () => {
    if (!normalized || normalized.length === 0) return "bullet";
    const first = normalized[0];
    if (typeof first === "string") return "bullet";
    if (first && first.proficiency !== undefined) return "percentage";
    if (first && first.category && Array.isArray(first.items)) return "category";
    return "bullet";
  };

  const [format, setFormat] = useState(detectFormat);
  const [localSkills, setLocalSkills] = useState(normalized);

  // Add area states
  const [newSkillText, setNewSkillText] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Intermediate"); // maps to a default %
  const levelToPercent = {
    Beginner: 40,
    Intermediate: 60,
    Advanced: 80,
    Expert: 100,
  };

  // UI helpers
  useEffect(() => setLocalSkills(normalized), [skills]);
  useEffect(() => setSkills(localSkills), /* eslint-disable-line react-hooks/exhaustive-deps */ [localSkills]);

  // Switch display format, convert existing data gracefully
  const switchFormat = (next) => {
    if (next === format) return;
    let converted = [];
    if (next === "bullet") {
      converted = localSkills.map((s) => {
        if (typeof s === "string") return s;
        if (s && s.name) return s.name;
        if (s && s.category) return s.items && s.items.length ? s.items[0] : s.category;
        return "";
      });
    } else if (next === "percentage") {
      converted = localSkills.map((s) => {
        if (typeof s === "string") return { name: s, proficiency: levelToPercent.Intermediate };
        if (s && s.proficiency !== undefined) return { name: s.name || s.category || "", proficiency: s.proficiency || 60 };
        if (s && s.items) return { name: s.category || "General", proficiency: 60 };
        return { name: "", proficiency: 60 };
      });
    } else if (next === "category") {
      converted = localSkills.map((s) => {
        if (typeof s === "string") return { category: "General", items: [s] };
        if (s && s.category) return { ...s };
        if (s && s.name) return { category: "General", items: [s.name] };
        return { category: "General", items: [""] };
      });
    }
    setFormat(next);
    setLocalSkills(converted);
    // update parent
    setSkills(converted);
  };

  // add new item based on format
  const addNew = () => {
    const text = newSkillText.trim();
    if (!text) return;

    let updated = [...localSkills];

    if (format === "bullet") {
      updated.push(text);
    } else if (format === "percentage") {
      updated.push({ name: text, proficiency: levelToPercent[newSkillLevel] || 60 });
    } else {
      // category - add as a new category if not exists, otherwise push into last category
      updated.push({ category: text, items: [""] });
    }

    setLocalSkills(updated);
    setNewSkillText("");
    setNewSkillLevel("Intermediate");
  };

  // remove skill
  const removeSkill = (i) => {
    const updated = localSkills.filter((_, idx) => idx !== i);
    setLocalSkills(updated);
  };

  // update for bullet -> just replace string
  const updateBullet = (i, value) => {
    const updated = [...localSkills];
    updated[i] = value;
    setLocalSkills(updated);
  };

  // update percentage skill {name, proficiency}
  const updatePercentage = (i, field, value) => {
    const updated = [...localSkills];
    updated[i] = { ...updated[i], [field]: value };
    setLocalSkills(updated);
  };

  // category functions
  const updateCategoryName = (i, value) => {
    const updated = [...localSkills];
    updated[i] = { ...updated[i], category: value };
    setLocalSkills(updated);
  };
  const addCategoryItem = (i) => {
    const updated = [...localSkills];
    updated[i] = { ...updated[i], items: [...(updated[i].items || []), ""] };
    setLocalSkills(updated);
  };
  const updateCategoryItem = (i, j, value) => {
    const updated = [...localSkills];
    const items = [...(updated[i].items || [])];
    items[j] = value;
    updated[i] = { ...updated[i], items };
    setLocalSkills(updated);
  };
  const removeCategoryItem = (i, j) => {
    const updated = [...localSkills];
    updated[i] = { ...updated[i], items: updated[i].items.filter((_, idx) => idx !== j) };
    setLocalSkills(updated);
  };

  // small UI pieces
  const formatPill = (key, label) => (
    <button
      onClick={() => switchFormat(key)}
      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
        format === key ? "bg-purple-700 text-white" : "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-purple-700">Skills</h3>
          <p className="text-sm text-gray-500 mt-1">
            List your technical and professional skills with proficiency levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {formatPill("bullet", "Bullet")}
          {formatPill("percentage", "Percentage")}
          {formatPill("category", "Categories")}
        </div>
      </div>

      {/* List / Cards */}
      <div className="space-y-3 mb-6">
        {localSkills.length === 0 && (
          <div className="text-sm text-gray-400 italic p-4 border border-dashed rounded">No skills added yet</div>
        )}

        {format === "bullet" &&
          localSkills.map((s, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full ml-1" />
              <input
                className="flex-1 bg-transparent outline-none text-gray-800"
                value={s}
                onChange={(e) => updateBullet(idx, e.target.value)}
                placeholder="e.g., React"
              />
              <button onClick={() => removeSkill(idx)} className="p-2 rounded-full hover:bg-gray-100">
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          ))}

        {format === "percentage" &&
          localSkills.map((s, idx) => {
            const skill = typeof s === "string" ? { name: s, proficiency: 60 } : s;
            return (
              <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <input
                    className="flex-1 text-gray-800 px-3 py-2 rounded-lg border border-gray-100"
                    value={skill.name}
                    onChange={(e) => updatePercentage(idx, "name", e.target.value)}
                    placeholder="Skill name (e.g., React)"
                  />
                  <button onClick={() => removeSkill(idx)} className="p-2 rounded-full hover:bg-gray-50">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12 text-right">{skill.proficiency || 0}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.proficiency || 0}
                    onChange={(e) => updatePercentage(idx, "proficiency", parseInt(e.target.value || 0))}
                    className="flex-1"
                  />
                </div>

                <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${skill.proficiency || 0}%` }}
                  />
                </div>
              </div>
            );
          })}

        {format === "category" &&
          localSkills.map((c, idx) => {
            const cat = typeof c === "string" ? { category: c, items: [""] } : c;
            return (
              <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-2 gap-3">
                  <input
                    className="flex-1 font-medium px-3 py-2 border rounded-lg"
                    value={cat.category}
                    onChange={(e) => updateCategoryName(idx, e.target.value)}
                    placeholder="Category (e.g., Frontend)"
                  />
                  <button onClick={() => removeSkill(idx)} className="p-2 rounded-full hover:bg-gray-50">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>

                <div className="space-y-2">
                  {(cat.items || []).map((it, j) => (
                    <div key={j} className="flex items-center gap-2 ml-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <input
                        className="flex-1 px-3 py-2 border rounded-lg"
                        value={it}
                        onChange={(e) => updateCategoryItem(idx, j, e.target.value)}
                        placeholder="e.g., React, Vue"
                      />
                      <button
                        onClick={() => removeCategoryItem(idx, j)}
                        className="p-2 rounded-full hover:bg-gray-50"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => addCategoryItem(idx)}
                    className="px-3 py-1 text-xs rounded-full bg-green-500 text-white"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-4" />

      {/* Add new row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="md:col-span-2 flex gap-3">
          <input
            className="flex-1 px-4 py-3 rounded-full border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200"
            placeholder={format === "category" ? "New category name" : "e.g., React, JavaScript, Project Management"}
            value={newSkillText}
            onChange={(e) => setNewSkillText(e.target.value)}
          />

          {/* Proficiency dropdown shown when Percentage format */}
          {format === "percentage" && (
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="px-3 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-purple-200"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          
          <button
            onClick={addNew}
            className="px-4 py-2 rounded-full bg-purple-700 text-white"
            title="Add skill/category"
          >
            <div className="flex items-center gap-2"><Plus size={14} /> Add</div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Cancel</button>
          <button
            onClick={() => setSkills(localSkills)}
            className="px-4 py-2 rounded-lg bg-white border border-purple-200 text-purple-700"
          >
            Save Changes
          </button>
        </div>

        <button
          className="px-5 py-2 rounded-lg bg-purple-700 text-white flex items-center gap-2"
          onClick={() => {
            // Next behaviour handled by popup parent
            // If needed, emit an event or call parent callback
            // In Popup flow, parent passes `onNext` so keep that there if used
            const evt = new CustomEvent("skills:next");
            window.dispatchEvent(evt);
          }}
        >
          Next ↪
        </button>
      </div>
    </div>
  );
}
