import { getSession } from '@/lib/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

async function layout({ children }) {
    const session = await getSession()
    if(session) redirect("/")
  return (
    <>
        {children}
    </>
  )
}

export default layout