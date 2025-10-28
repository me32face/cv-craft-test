'use client'
import React from 'react'
import Template01 from '@/components/templates/Template01'
import Template02 from '@/components/templates/Template02'
import Template03 from '@/components/templates/Template03'
import Template04 from '@/components/templates/Template04'
import Template05 from '@/components/templates/Template05'
import Template06 from '@/components/templates/Template06'
import Template07 from '@/components/templates/Template07'
import Template08 from '@/components/templates/Template08'

export default async function TemplatePage({ params }) {
  // ✅ Await the params before accessing it
  const { id } = await params

  const templates = {
    Template01: <Template01 />,
    Template02: <Template02 />,
    Template03: <Template03 />,
    Template04: <Template04 />,
    Template05: <Template05 />,
    Template06: <Template06 />,
    Template07: <Template07 />,
    Template08: <Template08 />
  }

  return templates[id] || <div className="p-10 text-center">Template not found</div>
}
