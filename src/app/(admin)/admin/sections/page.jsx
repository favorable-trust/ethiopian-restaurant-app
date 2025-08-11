// src/app/(admin)/admin/sections/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function SortableSection({ section }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })
  const style = { transform: CSS.Transform.toString(transform), transition, touchAction: 'none' }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 bg-white border rounded-md shadow-sm flex items-center justify-between">
      <span className="font-medium">{section.name}</span>
      <span className="text-gray-500">Drag Handle</span>
    </div>
  )
}

export default function ManageSectionsPage() {
  const [sections, setSections] = useState([])
  const [newSectionName, setNewSectionName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchSections = async () => {
      const { data } = await supabase.from('sections').select('*').order('position')
      if (data) setSections(data)
    }
    fetchSections()
  }, [])

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    const updates = sections.map((section, index) => ({
      id: section.id,
      position: index,
    }))
    const { error } = await supabase.from('sections').upsert(updates)
    if (error) alert('Error saving order: ' + error.message)
    else alert('Section order saved successfully!')
    setIsSaving(false)
  }

  const handleAddSection = async (e) => {
    e.preventDefault()
    if (!newSectionName.trim()) return
    const { data, error } = await supabase
      .from('sections')
      .insert({ name: newSectionName, position: sections.length })
      .select()

    if (error) {
      alert('Error adding section: ' + error.message)
    } else if (data) {
      setSections([...sections, data[0]])
      setNewSectionName('')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage & Reorder Sections</h1>
      <div className="mb-8 p-4 border rounded-md">
        <form onSubmit={handleAddSection} className="flex gap-2">
          <Input 
            placeholder="New section name (e.g., Drinks)" 
            value={newSectionName} 
            onChange={(e) => setNewSectionName(e.target.value)}
          />
          <Button type="submit">Add Section</Button>
        </form>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Section Order'}
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section) => (
              <SortableSection key={section.id} section={section} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}