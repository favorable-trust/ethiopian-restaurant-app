// src/app/(admin)/admin/add-item/page.jsx
'use client'

import { useState, useEffect } from 'react' // Import useEffect
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
// Import the 'select' components from shadcn/ui
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function AddItemPage() {
  const router = useRouter()
  
  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [sectionId, setSectionId] = useState('') // Changed from section to sectionId
  const [isSpecial, setIsSpecial] = useState(false)
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [isVegan, setIsVegan] = useState(false)
  const [isGlutenFree, setIsGlutenFree] = useState(false)
  const [containsNuts, setContainsNuts] = useState(false)
  
  const [isUploading, setIsUploading] = useState(false)
  const [sections, setSections] = useState([]) // New state to hold the list of sections

  // --- New: Fetch sections when the page loads ---
  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await supabase.from('sections').select('id, name').order('position');
      if (data) {
        setSections(data);
      }
    };
    fetchSections();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!sectionId) {
      alert('Please select a menu section.');
      return;
    }
    setIsUploading(true)
    
    let imageUrl = ''
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message)
        setIsUploading(false)
        return
      }
      
      const { data: urlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName)
      imageUrl = urlData.publicUrl
    }
    
    // --- Updated: Save the section_id to the database ---
    const { error: insertError } = await supabase
      .from('menu_items')
      .insert([
        {
          name,
          description,
          price,
          image_url: imageUrl,
          section_id: sectionId, // Use sectionId
          is_special: isSpecial,
          is_vegetarian: isVegetarian,
          is_vegan: isVegan,
          is_gluten_free: isGlutenFree,
          contains_nuts: containsNuts,
        },
      ])

    if (insertError) {
      alert('Error saving menu item: ' + insertError.message)
    } else {
      alert('Menu item added successfully!')
      router.push('/admin')
    }
    setIsUploading(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Menu Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        
        {/* --- Updated: Section input is now a dropdown --- */}
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
        <div>
          <Label htmlFor="image">Image</Label>
          <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
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
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Add Item'}
        </Button>
      </form>
    </div>
  )
}