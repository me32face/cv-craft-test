'use client';
import React from "react";
import PersonalInfo from "./inputsections/PersonalInfo";
import ImageUploader from "./inputsections/ImageUploader";
import LanguagesInput from "./inputsections/LanguagesInput";
import ExperienceModal from "./inputsections/ExperienceInput";
import EducationModal from "./inputsections/EducationInput";
import CertificatesModal from "./inputsections/CertificatesInput";

export default function PopupEditor({ visible, section, onClose, data, update, setArrayField }) {
  if (!visible) return null;

  const renderContent = () => {
    switch (section) {
      case "personal":
        return <PersonalInfo data={data} update={update} />;

      case "image":
        return (
          <ImageUploader
            image={data.profileImage}
            setImage={(v) => update("profileImage", v)}
            setShape={(v) => update("imageShape", v)}
            setAlign={(v) => update("imageAlign", v)}
          />
        );

      case "languages":
        return <LanguagesInput languages={data.languages} setLanguages={(arr) => setArrayField("languages", arr)} />;

      case "experience":
        return <ExperienceModal experiences={data.experiences} setExperiences={(arr) => setArrayField("experiences", arr)} />;

      case "education":
        return <EducationModal education={data.education} setEducation={(arr) => setArrayField("education", arr)} />;

      case "certificates":
        return <CertificatesModal certificates={data.certificates} setCertificates={(arr) => setArrayField("certificates", arr)} />;

      default:
        return <div>Select a section to edit</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-left bg-black/80 p-4">
      <div className="bg-white w-full max-w-3xl rounded shadow-lg overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{section ? section.toUpperCase() : "Edit"}</h3>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Close</button>
          </div>
        </div>
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
}
