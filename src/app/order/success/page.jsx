// src/app/order/success/page.jsx
'use client' // 1. Convert to a Client Component

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore' // 2. Import the cart store

export default function SuccessPage() {
  const { clearCart } = useCartStore() // 3. Get the clearCart function

  // 4. Use useEffect to clear the cart once when the page loads
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-4xl font-bold">Thank You!</h1>
      <p className="mt-4 text-lg">Your order has been placed successfully.</p>
      <Link href="/" className="mt-8 inline-block bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">
        Back to Homepage
      </Link>
    </div>
  )
}