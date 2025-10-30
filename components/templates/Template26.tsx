'use client'
import React from 'react'
import PrintToPdf from '@/components/PrintToPdf'
import ImageUploader from '@/components/ImageUploader'

export default function Template26() {
  return (
    <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
      <div className='w-full max-w-4xl'>
<div id="resume-root" className="bg-gradient-to-r from-teal-600/10 to-white rounded p-6 shadow font-mono">
  <div className="flex items-center gap-4">
    <div className="w-full h-28 overflow-hidden rounded-md border"><ImageUploader keyName="photo26" initial="/profile-placeholder.png" className="w-full h-full" /></div>
    <div>
      <h1 contentEditable suppressContentEditableWarning className="text-2xl font-bold">Jordan Bennett</h1>
      <div contentEditable suppressContentEditableWarning className="text-sm text-gray-700">Systems Designer</div>
    </div>
  </div>
  <div className="mt-4 grid md:grid-cols-2 gap-4">
    <div contentEditable suppressContentEditableWarning>
      <h4 className="font-semibold text-teal-600">Experience</h4>
      Senior Systems Engineer — The IT Company
    </div>
    <aside contentEditable suppressContentEditableWarning className="bg-white p-3 rounded">
      <h4 className="font-semibold text-teal-600">Contact</h4>
      hello@reallygreatsite.com
    </aside>
  </div>
</div>
        <div className='mt-4 flex justify-end gap-2 print:hidden'>
          <PrintToPdf rootId='resume-root' fileName='Template26.pdf' />
        </div>
      </div>
    </div>
  )
}
