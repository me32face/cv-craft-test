'use client';
import React from "react";
import { templateInputs } from "../templates";
import PersonalInfo from "./inputsections/PersonalInfo";
import ImageUploader from "./inputsections/ImageUploader";
import LanguagesInput from "./inputsections/LanguagesInput";
import ExperienceInput from "./inputsections/ExperienceInput";
import EducationInput from "./inputsections/EducationInput";
import CertificatesInput from "./inputsections/CertificatesInput";
import ProjectInput from "./inputsections/ProjectInput";
import SocialLinks from "./inputsections/SocialLinks";
import SkillsInput from "./inputsections/SkillsInput";
import ReferenceInput from "./inputsections/ReferenceInput";
import AwardInput from "./inputsections/AwardInput";
import MaritalStatusInput from "./inputsections/MaritalStatusInput";
export default function PopupEditor({ visible, section, onClose, data, update, onNext, selectedTemplate }) {
  if (!visible) return null;

  const mainSections = [
    "personal",
    "image",
    "sociallinks",
    "skills",
    "education",
    "experience",
    "languages",
    "projects"
  ];

  const additionalSections = [
    "certificates",
    "references",
    "awards",
    "maritalStatus"
  ];


  const sectionKeyMap = {
    personal: "personal",
    image: "profileImage",
    sociallinks: "socialLinks",
    skills: "skills",
    education: "education",
    experience: "experiences",
    languages: "languages",
    certificates: "certificates",
    projects: "project",
    references: "references",
    awards: "awards",
    maritalStatus: "maritalStatus"
  };

  const templateKey = selectedTemplate;
  const allowedSections = templateInputs[templateKey] || {};


  const getNextAvailableSection = (current) => {
    const sections = additionalSections.includes(current)
      ? additionalSections
      : mainSections;

    const currentIndex = sections.indexOf(current);

    for (let i = currentIndex + 1; i < sections.length; i++) {
      const sec = sections[i];
      const mappedKey = sectionKeyMap[sec];

      if (allowedSections[mappedKey] === false) continue;
      if (data.visibleSections?.[mappedKey] === false) continue;

      return sec;
    }

    return null;
  };


  const renderSectionWithToggle = (component, sec, label) => (
    <div>
      {component}
      <label className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={data.visibleSections?.[sec] ?? true}
          onChange={(e) =>
            update("visibleSections", {
              ...data.visibleSections,
              [sec]: e.target.checked,
            })
          }
        />
        <span className="text-sm font-medium">{label}</span>
      </label>
    </div>
  );

  const renderContent = () => {
    if (!section) {
      return <div className="text-gray-500">No sections available to edit</div>;
    }


    switch (section) {
      case "personal":
        return (
          <PersonalInfo
            data={data}
            update={update}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("personal"))}
          />
        );

      case "image":
        return (
          <ImageUploader
            image={data.profileImage}
            setImage={(v) => update("profileImage", v)}
            setShape={(v) => update("imageShape", v)}
            setAlign={(v) => update("imageAlign", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("image"))}
          />
        );

      case "sociallinks":
        return renderSectionWithToggle(
          <SocialLinks
            data={data.socialLinks}
            setSocialLinks={(v) => update("socialLinks", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("sociallinks"))}
          />,
          "sociallinks",
          "Show Social Links"
        );

      case "skills":
        return renderSectionWithToggle(
          <SkillsInput
            skills={data.skills}
            setSkills={(v) => update("skills", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("skills"))}
          />,
          "skills",
          "Show Skills"
        );

      case "education":
        return renderSectionWithToggle(
          <EducationInput
            education={data.education}
            setEducation={(v) => update("education", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("education"))}
          />,
          "education",
          "Show Education"
        );

      case "experience":
        return renderSectionWithToggle(
          <ExperienceInput
            experiences={data.experiences}
            setExperiences={(v) => update("experiences", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("experience"))}
          />,
          "experience",
          "Show Experience"
        );

      case "languages":
        return renderSectionWithToggle(
          <LanguagesInput
            languages={data.languages}
            setLanguages={(v) => update("languages", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("languages"))}
          />,
          "languages",
          "Show Languages"
        );

      case "certificates":
        return renderSectionWithToggle(
          <CertificatesInput
            certificates={data.certificates}
            setCertificates={(v) => update("certificates", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("certificates"))}
          />,
          "certificates",
          "Show Certificates"
        );

      case "projects":
        return renderSectionWithToggle(
          <ProjectInput
            projects={data.projects}
            setProjects={(v) => update("projects", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("projects"))}
          />,
          "projects",
          "Show Projects"
        );

      case "references":
        return renderSectionWithToggle(
          <ReferenceInput
            references={data.references}
            setReferences={(v) => update("references", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("references"))}
          />,
          "references",
          "Show References"
        );

      case "awards":
        return renderSectionWithToggle(
          <AwardInput
            awards={data.awards}
            setAwards={(v) => update("awards", v)}
            onClose={onClose}
            onNext={() => onNext(getNextAvailableSection("awards"))}
          />,
          "awards",
          "Show Awards"
        );

     case "maritalstatus":
  return renderSectionWithToggle(
    <MaritalStatusInput
      maritalStatus={data.maritalStatus}
      setMaritalStatus={(v) => update("maritalStatus", v)}
      onClose={onClose}
      onNext={() => onNext(getNextAvailableSection("maritalstatus"))}
    />,
    "maritalStatus",
    "Show Marital Status"
  );

      default:
        return <div className="text-gray-500">No sections available to edit</div>;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[90vw] sm:max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 overflow-y-auto flex-1">{renderContent()}</div>
      </div>
    </div>
  );
}
