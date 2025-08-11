// src/app/(admin)/admin/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const router = useRouter()
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const fetchMenuItems = async () => {
      // Change this line in your useEffect hook
const { data, error } = await supabase
  .from('menu_items')
  .select('*')
  .order('position', { ascending: true }) // Changed from 'created_at'

      if (error) {
        console.error('Error fetching menu items:', error)
      } else {
        setMenuItems(data)
      }
    }

    fetchMenuItems()
  }, [])

  // --- New Delete Function ---
  const handleDelete = async (itemId) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId)

      if (error) {
        alert('Error deleting item: ' + error.message)
      } else {
        // Remove the item from the local state to update the UI instantly
        setMenuItems(menuItems.filter((item) => item.id !== itemId))
        alert('Item deleted successfully.')
      }
    }
  }
  // --- End New Delete Function ---

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Log Out</Button>
      </div>
      <p className="mt-2">Welcome to the protected admin area.</p>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            <div className="space-x-2">
                {/* Add this new Link */}
                <Link href="/admin/sections">
                <Button variant="outline">Reorder Sections</Button>
                </Link>
                <Link href="/admin/reorder">
                <Button variant="outline">Reorder Items</Button>
                </Link>
                <Link href="/admin/add-item">
                <Button>+ Add New Item</Button>
                </Link>
            </div>
            </div>
        <div className="p-4 border rounded-md">
          {menuItems.length > 0 ? (
            <ul>
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="py-2 border-b flex justify-between items-center"
                >
                  <span>
                    {item.name} - ${item.price}
                  </span>
                  {/* --- New Edit and Delete Buttons --- */}
                  <div className="space-x-2">
                    <Link href={`/admin/edit-item/${item.id}`}>
                        <Button variant="outline" size="sm">
                            Edit
                        </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  {/* --- End New Buttons --- */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No menu items found. Add one!</p>
          )}
        </div>
      </div>
    </div>
  )
}