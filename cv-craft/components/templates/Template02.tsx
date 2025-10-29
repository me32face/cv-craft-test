import React from 'react'
import PrintToPdf from '@/components/PrintToPdf'
import ImageUploader from '@/components/ImageUploader'

export default function Template02() {
  return (
    <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
      <div className='w-full max-w-4xl'>
<div id="resume-root" className="md:flex bg-white rounded overflow-hidden shadow">
  <aside className="md:w-1/3 p-6 bg-gradient-to-b from-teal-600/10">
    <div className="w-28 h-28 rounded-full overflow-hidden border"><div className="w-full h-full"><ImageUploader keyName="photo2" initial="/profile-placeholder.png" className="w-full h-full" /></div></div>
    <div className="mt-3 font-mono">
      <h2 contentEditable suppressContentEditableWarning className="text-lg font-bold">Jordan Bennett</h2>
      <div contentEditable suppressContentEditableWarning className="text-sm text-gray-600 mt-1">Systems Designer</div>
    </div>
    <div className="mt-4 text-sm text-gray-700" contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</div>
  </aside>
  <main className="p-6 md:flex-1 font-mono">
    <h4 className="font-semibold text-teal-600">Professional Summary</h4>
    <p contentEditable suppressContentEditableWarning className="mt-2 text-sm">Experienced in system analysis and requirement gathering.</p>
    <div className="mt-4">
      <h4 className="font-semibold text-teal-600">Experience</h4>
      <div contentEditable suppressContentEditableWarning className="mt-2">Senior Systems Engineer — The IT Company</div>
    </div>
  </main>
</div>
        <div className='mt-4 flex justify-end gap-2 print:hidden'>
          <PrintToPdf rootId='resume-root' fileName='Template02.pdf' />
        </div>
      </div>
    </div>
  )
}
