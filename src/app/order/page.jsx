// src/app/order/page.jsx
import { createServerClient } from '@supabase/ssr' // Updated import
import { cookies } from 'next/headers'
import OrderMenu from '@/components/menu/OrderMenu'

export default async function OrderPage() {
  const cookieStore = cookies() // Updated client creation
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('*, sections(*)')
    .order('position', { referencedTable: 'sections', ascending: true })
    .order('position', { ascending: true })

  if (error) {
    return <p className="text-center p-8">Could not load the menu. Please try again later.</p>
  }

  return <OrderMenu menuItems={menuItems} />
}