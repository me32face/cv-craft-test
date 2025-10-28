'use client'
import React from 'react'
import PrintToPdf from '@/components/PrintToPdf'
import ImageUploader from '@/components/ImageUploader'

export default function Template04() {
  return (
    <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
      <div className='w-full max-w-4xl'>
<div id="resume-root" className="bg-white rounded p-6 shadow font-serif">
  <div className="flex items-center gap-4">
    <div className="w-28 h-28 rounded-full overflow-hidden border"><div className="w-full h-full"><ImageUploader keyName="photo4" initial="/profile-placeholder.png" className="w-full h-full" /></div></div>
    <div><h1 contentEditable suppressContentEditableWarning className="text-2xl font-bold font-serif">Jordan Bennett</h1><p contentEditable suppressContentEditableWarning className="text-sm text-gray-600">Systems Designer — Architecting resilient and scalable systems</p></div>
  </div>
  <div className="mt-6">
    <h4 className="font-semibold text-slate-800">Experience Timeline</h4>
    <div className="mt-4 space-y-4">
      <div className="flex gap-3 items-start">
        <div className="w-2 h-2 bg-slate-800 rounded mt-2"></div>
        <div contentEditable suppressContentEditableWarning>2030–2035: Senior Systems Engineer — The IT Company</div>
      </div>
      <div className="flex gap-3 items-start">
        <div className="w-2 h-2 bg-slate-800 rounded mt-2"></div>
        <div contentEditable suppressContentEditableWarning>2027–2030: Systems Architect — Cyber Tech Company</div>
      </div>
    </div>
  </div>
</div>
        <div className='mt-4 flex justify-end gap-2 print:hidden'>
          <PrintToPdf rootId='resume-root' fileName='Template04.pdf' />
        </div>
      </div>
    </div>
  )
}
