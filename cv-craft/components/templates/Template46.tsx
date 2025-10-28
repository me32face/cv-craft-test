'use client'
import React from 'react'
import PrintToPdf from '@/components/PrintToPdf'
import ImageUploader from '@/components/ImageUploader'

export default function Template46() {
  return (
    <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
      <div className='w-full max-w-4xl'>
<div id="resume-root" className="bg-white rounded p-6 shadow">
  <div className="flex gap-4 items-center">
    <div className="w-28 h-28 rounded-full overflow-hidden border"><div className="w-full h-full"><ImageUploader keyName="photo46" initial="/profile-placeholder.png" className="w-full h-full" /></div></div>
    <div><h1 contentEditable suppressContentEditableWarning className="text-2xl font-bold font-serif">Jordan Bennett</h1><p contentEditable suppressContentEditableWarning className="text-sm text-gray-600">Systems Designer — Architecting resilient and scalable systems</p></div>
    <div className="ml-auto text-sm text-gray-600">
      <div contentEditable suppressContentEditableWarning>+123-456-7890</div>
      <div contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</div>
    </div>
  </div>
  <div className="mt-4 grid md:grid-cols-2 gap-4 font-serif">
    <div>
      <h4 className="font-semibold text-violet-700">Summary</h4>
      <p contentEditable suppressContentEditableWarning className="mt-2 text-sm">Systems Design Professional with extensive experience in architecture and cloud.</p>
      <h4 className="mt-4 font-semibold text-violet-700">Experience</h4>
      <div className="mt-2" contentEditable suppressContentEditableWarning>Senior Systems Engineer — The IT Company (2030–2035)</div>
    </div>
    <aside className="bg-gray-50 p-3 rounded">
      <h4 className="font-semibold text-violet-700">Skills</h4>
      <ul className="mt-2 text-sm" contentEditable suppressContentEditableWarning>
        <li>System Architecture</li>
        <li>Cloud</li>
      </ul>
      <h4 className="mt-4 font-semibold text-violet-700">Education</h4>
      <div contentEditable suppressContentEditableWarning className="text-sm mt-2">Master — North State University (2025–2027)</div>
    </aside>
  </div>
</div>
        <div className='mt-4 flex justify-end gap-2 print:hidden'>
          <PrintToPdf rootId='resume-root' fileName='Template46.pdf' />
        </div>
      </div>
    </div>
  )
}
