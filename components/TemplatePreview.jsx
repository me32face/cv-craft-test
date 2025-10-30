import Image from 'next/image';

const templatePreviews = {
  Template01: '/previews/template01.jpg',
  Template02: '/previews/template02.jpg', 
  Template03: '/previews/template03.jpg',
  Template04: '/previews/template04.jpg',
  Template05: '/previews/template05.jpg',
};

export default function TemplatePreview({ templateId }) {
  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden relative">
      {templatePreviews[templateId] ? (
        <Image
          src={templatePreviews[templateId]}
          alt={`${templateId} Preview`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={templateId === 'Template01'}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-700">{templateId}</h3>
            <p className="text-sm text-gray-500 mt-1">Resume Template</p>
          </div>
        </div>
      )}
    </div>
  );
}