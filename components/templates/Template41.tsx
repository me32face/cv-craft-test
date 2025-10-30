'use client'
import React from 'react'
import PrintToPdf from '@/components/PrintToPdf'
import ImageUploader from '@/components/ImageUploader'

export default function Template41() {
  return (
    <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
      <div className='w-full max-w-4xl'>
<div id="resume-root" className="bg-white rounded p-6 shadow font-mono">
  <div className="grid md:grid-cols-3 gap-4">
    <div className="md:col-span-2">
      <div className="flex gap-4 items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden border"><div className="w-full h-full"><ImageUploader keyName="photo41" initial="/profile-placeholder.png" className="w-full h-full" /></div></div>
        <div>
          <h1 contentEditable suppressContentEditableWarning className="text-2xl font-serif font-bold">Jordan Bennett</h1>
          <p contentEditable suppressContentEditableWarning className="text-sm text-gray-600">Systems Designer</p>
        </div>
      </div>
      <div className="mt-4" contentEditable suppressContentEditableWarning>
        <h4 className="font-semibold">Experience</h4>
        Senior Systems Engineer — The IT Company (2030–2035)
      </div>
    </div>
    <aside className="p-3 border-l">
      <h4 className="font-semibold text-indigo-700">Skills</h4>
      <ul className="mt-2 text-sm" contentEditable suppressContentEditableWarning>
        <li>System Architecture</li>
        <li>Cloud</li>
      </ul>
    </aside>
  </div>
</div>
        <div className='mt-4 flex justify-end gap-2 print:hidden'>
          <PrintToPdf rootId='resume-root' fileName='Template41.pdf' />
        </div>
      </div>
    </div>
  )
}
