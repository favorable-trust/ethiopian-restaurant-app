// src/components/cart/CartSheet.jsx
'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import { checkout } from '@/app/actions'

export default function CartSheet({ open, setOpen }) {
  const { items, increaseQuantity, decreaseQuantity, removeItem, clearCart, updateItemComments } = useCartStore()
  const [isPending, startTransition] = useTransition()

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const taxRate = 0.10
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  const handleCheckout = () => {
    startTransition(async () => {
      await checkout(items)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* --- Updated Layout Structure --- */}
      <SheetContent className="grid w-full grid-rows-[auto_1fr_auto] gap-4 pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Your Cart ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="px-6">
          {items.length > 0 ? (
            <div className="flex flex-col gap-6 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  {item.image_url && (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      <Image src={item.image_url} alt={item.name} fill style={{objectFit: 'cover'}} />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500" onClick={() => removeItem(item.id)}>X</Button>
                    </div>
                    <p className="text-sm text-gray-500">${item.price}</p>
                    <div className="flex items-center gap-2 my-2">
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => decreaseQuantity(item.id)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => increaseQuantity(item.id)}>+</Button>
                    </div>
                    <Input
                      type="text"
                      placeholder="Add a note (e.g., extra spicy)"
                      className="h-8 mt-1"
                      value={item.comments}
                      onChange={(e) => updateItemComments(item.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-lg text-gray-500">Your cart is empty.</p>
            </div>
          )}
        </ScrollArea>
        
        {items.length > 0 && (
          <div className="border-t bg-white px-6 py-4 space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={handleCheckout} disabled={isPending} className="w-full">
                {isPending ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              <Button variant="outline" onClick={() => clearCart()} className="w-full">
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}