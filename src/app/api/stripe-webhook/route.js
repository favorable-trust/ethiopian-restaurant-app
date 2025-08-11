// src/app/api/stripe-webhook/route.js
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr' // Ensure this is the correct import
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const cookieStore = cookies() // Updated client creation
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        { cookies: { get: (name) => cookieStore.get(name)?.value } }
    )

    try {
      // Fetch line items to get menu item details
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      // You need a way to map Stripe price/product IDs back to your menu_item IDs.
      // For now, we'll assume the product name is unique and use that.
      // A more robust solution would be to pass metadata during checkout creation.
      const { data: menuItems } = await supabase.from('menu_items').select('id, name, price')

      // 1. Create the Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: session.amount_total / 100, // Convert from cents
          stripe_payment_intent_id: session.payment_intent,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create the Order Items
      const orderItemsData = lineItems.data.map(item => {
        const menuItem = menuItems.find(mi => mi.name === item.description)
        return {
          order_id: order.id,
          menu_item_id: menuItem?.id,
          quantity: item.quantity,
          price: item.price.unit_amount / 100,
        }
      }).filter(Boolean) // Filter out any items that couldn't be matched

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData)

      if (itemsError) throw itemsError

    } catch (error) {
      console.error("Error saving order to Supabase:", error)
      return new NextResponse(`Webhook Handler Error: ${error.message}`, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}