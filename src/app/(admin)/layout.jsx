// src/app/(admin)/layout.jsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // --- DEBUGGING STEP ---
  // This will print the session details to your VS Code terminal
  console.log('SESSION ON SERVER:', session)
  // --- END DEBUGGING STEP ---

  if (!session) {
    // This is a protected route - redirect to login if no session.
    redirect('/login')
  }

  return <>{children}</>
}