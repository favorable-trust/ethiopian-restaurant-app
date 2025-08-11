// src/app/menu/page.jsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

export default async function MenuPage() {
  const supabase = createServerComponentClient({ cookies })

  // --- This is the correct, updated query ---
  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('*, sections(*)') // Join with the sections table
    .order('position', { referencedTable: 'sections', ascending: true })
    .order('position', { ascending: true })

  if (error) {
    console.error('Error fetching menu items:', error)
    return <p>Could not load the menu. Please try again later.</p>
  }

  // --- This is the correct, updated grouping logic ---
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Our Menu</h1>
      
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
                  <p className="text-gray-600 flex-grow">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}