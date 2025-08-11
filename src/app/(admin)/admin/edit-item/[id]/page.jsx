// src/app/(admin)/admin/edit-item/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export default function EditItemPage() {
  const router = useRouter()
  const { id } = useParams()

  // State for form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [section, setSection] = useState('')
  const [isSpecial, setIsSpecial] = useState(false)
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [isVegan, setIsVegan] = useState(false)
  const [isGlutenFree, setIsGlutenFree] = useState(false)
  const [containsNuts, setContainsNuts] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  // Fetch the existing item data when the page loads
  useEffect(() => {
    if (!id) return

    const fetchItem = async () => {
      setIsLoading(true) // Set loading to true when starting fetch
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching item:', error)
        alert("Error: Could not find the item you're trying to edit.")
        // --- THE FIX IS HERE ---
        setIsLoading(false) // Stop loading even if there's an error
        router.push('/admin') // Redirect if item not found
      } else {
        // Pre-fill the form with the item's data
        setName(data.name)
        setDescription(data.description)
        setPrice(data.price)
        setSection(data.section)
        setIsSpecial(data.is_special)
        setIsVegetarian(data.is_vegetarian)
        setIsVegan(data.is_vegan)
        setIsGlutenFree(data.is_gluten_free)
        setContainsNuts(data.contains_nuts)
        setIsLoading(false) // Stop loading on success
      }
    }

    fetchItem()
  }, [id, router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('menu_items')
      .update({
        name,
        description,
        price,
        section,
        is_special: isSpecial,
        is_vegetarian: isVegetarian,
        is_vegan: isVegan,
        is_gluten_free: isGlutenFree,
        contains_nuts: containsNuts,
      })
      .eq('id', id)

    if (error) {
      alert('Error updating menu item: ' + error.message)
    } else {
      alert('Menu item updated successfully!')
      router.push('/admin')
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Menu Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="section">Menu Section</Label>
          <Input id="section" value={section} onChange={(e) => setSection(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="is_special" checked={isSpecial} onCheckedChange={setIsSpecial} />
          <Label htmlFor="is_special">Mark as a Weekly Special</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="is_vegetarian" checked={isVegetarian} onCheckedChange={setIsVegetarian} />
          <Label htmlFor="is_vegetarian">Vegetarian</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="is_vegan" checked={isVegan} onCheckedChange={setIsVegan} />
          <Label htmlFor="is_vegan">Vegan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="is_gluten_free" checked={isGlutenFree} onCheckedChange={setIsGlutenFree} />
          <Label htmlFor="is_gluten_free">Gluten-Free</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="contains_nuts" checked={containsNuts} onCheckedChange={setContainsNuts} />
          <Label htmlFor="contains_nuts">Contains Nuts</Label>
        </div>
        <Button type="submit">Update Item</Button>
      </form>
    </div>
  )
}