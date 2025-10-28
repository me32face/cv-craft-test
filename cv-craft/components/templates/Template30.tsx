'use client'
import React from 'react'
import PrintToPdf from '@/components/PrintToPdf'
import ImageUploader from '@/components/ImageUploader'

export default function Template30() {
  return (
    <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
      <div className='w-full max-w-4xl'>
<div id="resume-root" className="bg-white rounded shadow overflow-hidden">
  <div className="h-36 bg-gradient-to-r from-violet-700 to-white flex items-center p-6">
    <div className="flex items-center gap-4">
      <div className="w-28 h-28 rounded-full overflow-hidden border"><div className="w-full h-full"><ImageUploader keyName="photo30" initial="/profile-placeholder.png" className="w-full h-full" /></div></div>
      <div className="font-sans text-white">
        <h1 contentEditable suppressContentEditableWarning className="text-2xl font-bold">Jordan Bennett</h1>
        <div contentEditable suppressContentEditableWarning className="text-sm">Systems Designer</div>
      </div>
    </div>
  </div>
  <div className="p-6 grid md:grid-cols-3 gap-4">
    <div className="md:col-span-2">
      <h4 className="font-semibold text-violet-700">Summary</h4>
      <p contentEditable suppressContentEditableWarning className="mt-2 text-sm">Skilled in architecture and documentation.</p>
      <div className="mt-4">
        <h4 className="font-semibold">Experience</h4>
        <div contentEditable suppressContentEditableWarning className="mt-2">Senior Systems Engineer — The IT Company</div>
      </div>
    </div>
    <aside className="bg-gray-50 p-3 rounded">
      <h4 className="font-semibold text-violet-700">Contact</h4>
      <div className="mt-2 text-sm" contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</div>
    </aside>
  </div>
</div>
        <div className='mt-4 flex justify-end gap-2 print:hidden'>
          <PrintToPdf rootId='resume-root' fileName='Template30.pdf' />
        </div>
      </div>
    </div>
  )
}
