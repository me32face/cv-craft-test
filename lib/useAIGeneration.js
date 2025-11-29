import { geminiService } from './gemini';

export const useAIGeneration = () => {
  const handleAIGenerate = async (section, keywords) => {
    if (!geminiService.genAI) {
      const apiKey = prompt('Please enter your Gemini API key:');
      if (!apiKey) return;
      geminiService.initialize(apiKey);
    }

    let generatedContent = '';

    try {
      generatedContent = await geminiService.generateContent(section, keywords);

      switch (section.toLowerCase()) {
        case 'profile':
        case 'summary': {
          const profileElement = document.getElementById('profile-text');
          if (profileElement) {
            let cleanedContent = generatedContent
              .replace(/^#{1,6}\s+.+$/gm, '') // remove markdown headers
              .replace(/\*\*(.+?)\*\*/g, '$1') // remove bold
              .replace(/\*(.+?)\*/g, '$1') // remove italic
              .trim();

            const paragraphs = cleanedContent
              .split('\n\n')
              .filter((p) => p.trim().length > 50);

            const actualSummary = paragraphs.find(
              (p) =>
                !p.toLowerCase().includes('here are') &&
                !p.toLowerCase().includes('of course') &&
                !p.toLowerCase().includes('choose the option') &&
                !p.toLowerCase().includes('pro-tip') &&
                p.length > 100
            );

            const finalContent =
              actualSummary?.trim() || paragraphs[0]?.trim() || cleanedContent;

            profileElement.textContent = finalContent;

            // return cleaned text to React component
            return finalContent;
          } else {
            console.error('Profile element not found');
          }
          break;
        }

        case 'skills': {
          const skillsElement = document.querySelector(
            '[data-section="skills"] ul'
          );
          if (skillsElement) {
            const skills = generatedContent
              .split('\n')
              .filter((skill) => skill.trim());

            skillsElement.innerHTML = skills
              .map(
                (skill) => `
              <li class="text-xs flex items-start relative group text-gray-700">
                <span class="mr-2">•</span>
                <span contentEditable suppressContentEditableWarning>${skill.trim()}</span>
                <div class="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <button data-action="duplicate" class="text-gray-600 rounded p-1 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </button>
                  <button data-action="delete" class="text-gray-600 rounded p-1 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </li>
            `
              )
              .join('');
          }
          break;
        }

        case 'work experience': {
          const workExpElement = document.querySelector(
            '[data-section="work-experience"] .space-y-4'
          );
          if (workExpElement) {
            const experiences = generatedContent
              .split('---')
              .filter((exp) => exp.trim());
            workExpElement.innerHTML = experiences
              .map((exp) => {
                const lines = exp.trim().split('\n').filter((line) => line.trim());
                const company = lines[0] || 'Company Name';
                const position = lines[1] || 'Position';
                const period = lines[2] || '2020 - Present';
                const duties = lines.slice(3).filter((duty) => duty.trim());

                return `
                <div>
                  <div class="flex justify-between items-start mt-4">
                    <div>
                      <h3 class="text-sm font-bold text-gray-800">${company}</h3>
                      <p class="text-xs text-gray-600">${position}</p>
                    </div>
                    <span class="text-xs text-gray-500 whitespace-nowrap">${period}</span>
                  </div>
                  <ul class="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1">
                    ${duties.map((duty) => `<li>${duty.trim()}</li>`).join('')}
                  </ul>
                </div>
              `;
              })
              .join('');
          }
          break;
        }

        default:
          console.log('Generated content:', generatedContent);
      }
    } catch (error) {
      alert('Failed to generate content. Please check your API key and try again.');
    }

    //  Always return the generated text (clean or raw)
    return generatedContent;
  };

  //  Return function so components can call it
  return { handleAIGenerate };
};
