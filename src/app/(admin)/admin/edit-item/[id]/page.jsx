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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditItemPage() {
  const router = useRouter()
  const { id } = useParams() // Get the item ID from the URL

  // State for form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [sectionId, setSectionId] = useState('') // State for the selected section ID
  const [isSpecial, setIsSpecial] = useState(false)
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [isVegan, setIsVegan] = useState(false)
  const [isGlutenFree, setIsGlutenFree] = useState(false)
  const [containsNuts, setContainsNuts] = useState(false)

  const [sections, setSections] = useState([]) // State to hold the list of all sections
  const [isLoading, setIsLoading] = useState(true)

  // Fetch both the item and the list of sections when the page loads
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setIsLoading(true)
      
      // Fetch the specific item to edit
      const { data: itemData, error: itemError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single()
      
      // Fetch all available sections for the dropdown
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('id, name')
        .order('position')
      
      if (itemError || sectionsError) {
        console.error('Error fetching data:', itemError || sectionsError)
        alert("Error: Could not load data for editing.")
        router.push('/admin')
      } else {
        // Pre-fill the form with the item's data
        setName(itemData.name)
        setDescription(itemData.description)
        setPrice(itemData.price)
        setSectionId(itemData.section_id) // Set the current section ID
        setIsSpecial(itemData.is_special)
        setIsVegetarian(itemData.is_vegetarian)
        setIsVegan(itemData.is_vegan)
        setIsGlutenFree(itemData.is_gluten_free)
        setContainsNuts(itemData.contains_nuts)
        
        // Save the list of sections for the dropdown
        setSections(sectionsData)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Update the item in the database
    const { error } = await supabase
      .from('menu_items')
      .update({
        name,
        description,
        price,
        section_id: sectionId, // Save the updated section ID
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
        
        {/* Updated Section Dropdown */}
        <div>
          <Label>Menu Section</Label>
          <Select onValueChange={setSectionId} value={sectionId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        {/* Checkboxes... */}
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