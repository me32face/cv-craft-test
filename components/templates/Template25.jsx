'use client'
import React from 'react'
import PrintToPdf from '@/components/PrintToPdf'
import ImageUploader from '@/components/ImageUploader'

export default function Template25() {
  return (
    <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
      <div className='w-full max-w-4xl'>
        <div id="resume-root" className="bg-slate-900 text-slate-100 rounded p-6 shadow font-serif">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-md overflow-hidden border border-slate-700">
              <ImageUploader keyName="photo25" initial="/profile-placeholder.png" className="w-full h-full" />
            </div>
            <div>
              <h1 contentEditable suppressContentEditableWarning className="text-2xl font-semibold">Jordan Bennett</h1>
              <div contentEditable suppressContentEditableWarning className="text-sm text-slate-300">Systems Designer</div>
            </div>
            <div className="ml-auto text-sm text-slate-400" contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</div>
          </div>
          <div className="mt-4" contentEditable suppressContentEditableWarning>
            <h4 className="font-semibold text-indigo-700">Summary</h4>
            Skilled in system design, cloud, and infra.
          </div>
        </div>
        <div className='mt-4 flex justify-end gap-2 print:hidden'>
          <PrintToPdf rootId='resume-root' fileName='Template25.pdf' />
        </div>
      </div>
    </div>
  )
}
