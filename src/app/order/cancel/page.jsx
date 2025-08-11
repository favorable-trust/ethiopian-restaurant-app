// src/app/order/cancel/page.jsx
import Link from 'next/link'
export default function CancelPage() {
  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-4xl font-bold">Order Canceled</h1>
      <p className="mt-4 text-lg">Your order was canceled. You have not been charged.</p>
      <Link href="/order" className="mt-8 inline-block bg-gray-800 text-white px-6 py-2 rounded">
        Return to Order Page
      </Link>
    </div>
  )
}