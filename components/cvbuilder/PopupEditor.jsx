'use client';
import React from "react";
import PersonalInfo from "./inputsections/PersonalInfo";
import ImageUploader from "./inputsections/ImageUploader";
import LanguagesInput from "./inputsections/LanguagesInput";
import ExperienceInput from "./inputsections/ExperienceInput";
import EducationInput from "./inputsections/EducationInput";
import CertificatesInput from "./inputsections/CertificatesInput";
import ProjectInput from "./inputsections/ProjectInput";
import SocialLinks from "./inputsections/SocialLinks";
import SkillsInput from "./inputsections/SkillsInput"

export default function PopupEditor({ visible, section, onClose, data, update, onNext  }) {
  if (!visible || !section) return null;

  const renderContent = () => {
    switch (section) {
      case "personal":
        return <PersonalInfo data={data} update={update} onClose={onClose} onNext={() => onNext("image")} />;

      case "image":
        return (
          <ImageUploader
            image={data.profileImage}
            setImage={(v) => update("profileImage", v)}
            setShape={(v) => update("imageShape", v)}
            setAlign={(v) => update("imageAlign", v)}
            onClose={onClose} 
            onNext={() => onNext("sociallinks")}
          />
        );

      // case "summary":
      //   return <SummaryInput summary={data.summary} setSummary={(v) => update("summary", v)} />;

      case "skills":
        return <SkillsInput skills={data.skills} setSkills={(v) => update("skills", v)} />;

      case "languages":
        return <LanguagesInput languages={data.languages} setLanguages={(v) => update("languages", v)} />;

      case "experience":
        return (
          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={data.visibleSections?.experience !== false}
                onChange={(e) =>
                  update("visibleSections", {
                    ...data.visibleSections,
                    experience: e.target.checked,
                  })
                }
              />
              <span className="text-sm font-medium">Show Experience</span>
            </label>

            <ExperienceInput
              experiences={data.experiences}
              setExperiences={(v) => update("experiences", v)}
            />
          </div>
        );

      case "education":
        return (
          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={data.visibleSections?.education !== false}
                onChange={(e) =>
                  update("visibleSections", {
                    ...data.visibleSections,
                    education: e.target.checked,
                  })
                }
              />
              <span className="text-sm font-medium">Show Education</span>
            </label>

            <EducationInput
              education={data.education}
              setEducation={(v) => update("education", v)}
            />
          </div>
        );

      case "certificates":
        return (
          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={data.visibleSections?.certificates !== false}
                onChange={(e) =>
                  update("visibleSections", {
                    ...data.visibleSections,
                    certificates: e.target.checked,
                  })
                }
              />
              <span className="text-sm font-medium">Show Certificates</span>
            </label>

            <CertificatesInput
              certificates={data.certificates}
              setCertificates={(v) => update("certificates", v)}
            />
          </div>
        );


      case "projects":
        return (
          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={data.visibleSections?.projects !== false}
                onChange={(e) =>
                  update("visibleSections", {
                    ...data.visibleSections,
                    projects: e.target.checked,
                  })
                }
              />
              <span className="text-sm font-medium">Show Projects</span>
            </label>

            <ProjectInput
              projects={data.projects}
              setProjects={(v) => update("projects", v)}
            />
          </div>
        );


      case "sociallinks":
        return (
          <div>
            <SocialLinks
              data={data.socialLinks}
              setSocialLinks={(v) => update("socialLinks", v)}
              onClose={onClose} onNext={() => onNext("skills")}
            />
            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={data.visibleSections?.sociallinks !== false}
                onChange={(e) =>
                  update("visibleSections", {
                    ...data.visibleSections,
                    sociallinks: e.target.checked,
                  })
                }
              />
              <span className="text-sm font-medium">Show Social Links</span>
            </label>
          </div>
        );


      default:
        return <div className="text-gray-500">Select a section to edit</div>;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[90vw] sm:max-w-2xl rounded-2xl shadow-2xl overflow-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CONTENT */}
        <div className="p-8 overflow-y-auto">
            {renderContent(onClose)}
        </div>
      </div>
    </div>
  );
}
