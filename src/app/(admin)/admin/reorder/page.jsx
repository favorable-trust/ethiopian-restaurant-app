// src/app/(admin)/admin/reorder/page.jsx
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

function SortableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 bg-white border rounded-md shadow-sm flex items-center justify-between">
      <span className="font-medium">{item.name}</span>
      <span className="text-gray-500">Drag Handle</span>
    </div>
  )
}

export default function ReorderPage() {
  const [menuItems, setMenuItems] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      // --- Updated Query to fetch section data ---
      const { data, error } = await supabase
        .from('menu_items')
        .select('*, sections(*)')
        .order('position', { referencedTable: 'sections', ascending: true })
        .order('position', { ascending: true })
        
      if (data) setMenuItems(data)
    }
    fetchItems()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    const updates = menuItems.map((item, index) => ({
      id: item.id,
      position: index,
    }))

    const { error } = await supabase.from('menu_items').upsert(updates)
    if (error) {
      alert('Error saving order: ' + error.message)
    } else {
      alert('Order saved successfully!')
    }
    setIsSaving(false)
  }

  // --- Updated Grouping Logic ---
  const groupedMenu = menuItems.reduce((acc, item) => {
    const sectionName = item.sections?.name || 'Uncategorized';
    if (!acc[sectionName]) {
      acc[sectionName] = [];
    }
    acc[sectionName].push(item);
    return acc;
  }, {});

  const sortedSections = Object.keys(groupedMenu).sort((a, b) => {
      const posA = groupedMenu[a][0].sections?.position ?? Infinity;
      const posB = groupedMenu[b][0].sections?.position ?? Infinity;
      return posA - posB;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reorder Menu Items</h1>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      <p className="mb-6 text-gray-600">Drag and drop items within each section to change their order. Click "Save Changes" when you're done.</p>
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-8">
          {sortedSections.map((section) => (
            <div key={section}>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">{section}</h2>
              <SortableContext items={groupedMenu[section]} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {groupedMenu[section].map((item) => (
                    <SortableItem key={item.id} item={item} />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  )
}