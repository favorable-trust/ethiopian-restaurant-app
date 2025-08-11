// src/components/menu/OrderMenu.jsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { Check } from 'lucide-react'

export default function OrderMenu({ menuItems }) {
  const { addItem } = useCartStore()
  const [justAddedItemId, setJustAddedItemId] = useState(null)

  const handleAddItem = (item) => {
    addItem(item)
    setJustAddedItemId(item.id)
    setTimeout(() => {
      setJustAddedItemId(null)
    }, 1500)
  }

  const groupedMenu = menuItems.reduce((acc, item) => {
    const section = item.sections?.name || 'Uncategorized'
    if (!acc[section]) {
      acc[section] = []
    }
    acc[section].push(item)
    return acc
  }, {})

  const sortedSections = Object.keys(groupedMenu).sort((a, b) => {
    const posA = groupedMenu[a][0].sections?.position ?? Infinity;
    const posB = groupedMenu[b][0].sections?.position ?? Infinity;
    return posA - posB;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Order Online</h1>

      {sortedSections.map((section) => (
        <div key={section} className="mb-12">
          <h2 className="text-3xl font-semibold border-b-2 border-yellow-500 pb-2 mb-6">
            {section}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedMenu[section].map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden shadow-lg flex flex-col">
                {item.image_url && (
                  <div className="relative w-full h-48">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-lg font-semibold text-gray-800">${item.price}</p>
                  </div>
                  {item.is_special && (
                    <Badge variant="destructive" className="w-fit mb-2">Special</Badge>
                  )}
                  <p className="text-gray-600 flex-grow mb-4">{item.description}</p>

                  {/* --- Updated Button Logic --- */}
                  {justAddedItemId === item.id ? (
                    <Button className="mt-auto bg-green-500 hover:bg-green-500 animate-[pop-in_0.5s_ease-out]">
                      <Check className="mr-2 h-4 w-4" /> Added!
                    </Button>
                  ) : (
                    <Button onClick={() => handleAddItem(item)} className="mt-auto">
                      Add to Order
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}