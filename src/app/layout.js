// src/app/layout.js
'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState, useEffect } from 'react' // Import useEffect
import CartSheet from '@/components/cart/CartSheet'

const inter = Inter({ subsets: ['latin'] })

function Navbar() {
  const { items } = useCartStore()
  const [isMounted, setIsMounted] = useState(false) // State to check if component has mounted

  useEffect(() => {
    setIsMounted(true) // Set to true after the component mounts on the client
  }, [])

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Mereb Restaurant & Lounge</Link>
          <div className="space-x-4 flex items-center">
            <Link href="/menu" className="hover:text-yellow-400">Menu</Link>
            <Link href="/about" className="hover:text-yellow-400">About Us</Link>
            <Link href="/order">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Order Online
              </Button>
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="relative">
              <ShoppingCart className="h-6 w-6" />
              {/* --- Updated Cart Count --- */}
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
      {isMounted && <CartSheet open={isCartOpen} setOpen={setIsCartOpen} />}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}