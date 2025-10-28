'use client'
import React from 'react'
import PrintToPdf from '@/components/PrintToPdf'
import ImageUploader from '@/components/ImageUploader'

export default function Template42() {
  return (
    <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
      <div className='w-full max-w-4xl'>
<div id="resume-root" className="bg-white rounded p-4 shadow font-sans">
  <div className="flex items-center gap-3">
    <div className="w-16 h-16 rounded-full overflow-hidden border">
      <ImageUploader keyName="photo42" initial="/profile-placeholder.png" className="w-full h-full" />
    </div>
    <div>
      <h1 contentEditable suppressContentEditableWarning className="text-xl font-semibold">Jordan Bennett</h1>
      <div contentEditable suppressContentEditableWarning className="text-xs text-gray-600">Systems Designer</div>
    </div>
  </div>
  <div className="mt-3 text-xs" contentEditable suppressContentEditableWarning>
    Brief summary — skilled in systems and architecture.
  </div>
  <div className="mt-3" contentEditable suppressContentEditableWarning>
    Experience: Senior Systems Engineer — The IT Company
  </div>
</div>
        <div className='mt-4 flex justify-end gap-2 print:hidden'>
          <PrintToPdf rootId='resume-root' fileName='Template42.pdf' />
        </div>
      </div>
    </div>
  )
}
