// src/app/order/page.jsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import OrderMenu from '@/components/menu/OrderMenu' // We are using the existing client component

// This is the main server component for the page
export default async function OrderPage() {
  const supabase = createServerComponentClient({ cookies })

  // --- Updated Query ---
  // Fetches menu items AND their related section data.
  // Orders first by the section's position, then by the item's position.
  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('*, sections(*)') // Join with the sections table
    .order('position', { referencedTable: 'sections', ascending: true })
    .order('position', { ascending: true })

  if (error) {
    console.error('Error fetching menu items for order page:', error)
    return <p className="text-center p-8">Could not load the menu. Please try again later.</p>
  }

  // Pass the fully-sorted menu items to the client component for display
  return <OrderMenu menuItems={menuItems} />
}