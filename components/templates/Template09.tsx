'use client'
import React from 'react'
import PrintToPdf from '@/components/PrintToPdf'
import ImageUploader from '@/components/ImageUploader'

export default function Template09() {
  return (
    <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
      <div className='w-full max-w-4xl'>
<div id="resume-root" className="bg-[rgb(247,239,230)] rounded p-6 shadow font-sans">
  <div className="flex gap-4 items-center">
    <div className="w-28 h-28 rounded-full overflow-hidden border"><div className="w-full h-full"><ImageUploader keyName="photo9" initial="/profile-placeholder.png" className="w-full h-full" /></div></div>
    <div>
      <h1 contentEditable suppressContentEditableWarning className="text-2xl font-serif text-amber-800">Jordan Bennett</h1>
      <div contentEditable suppressContentEditableWarning className="text-sm text-amber-700">Systems Designer</div>
    </div>
    <div className="ml-auto text-sm text-amber-700" contentEditable suppressContentEditableWarning>GPA: 3.8</div>
  </div>
  <div className="mt-4 grid md:grid-cols-2 gap-4">
    <div contentEditable suppressContentEditableWarning>
      <h4 className="font-semibold">Summary</h4>
      Experienced systems designer focused on architecture and documentation.
    </div>
    <aside>
      <h4 className="font-semibold">Education</h4>
      Master — North State University (2025–2027)
    </aside>
  </div>
</div>
        <div className='mt-4 flex justify-end gap-2 print:hidden'>
          <PrintToPdf rootId='resume-root' fileName='Template09.pdf' />
        </div>
      </div>
    </div>
  )
}
