// src/app/actions.js
'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function checkout(cartItems) {
  const line_items = cartItems.map((item) => {
    let description = item.description || '' 
    if (item.comments) {
      description += `\n\nSpecial Instructions: ${item.comments}`
    }

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image_url],
          description: description,
        },
        unit_amount: Math.round(item.price * 100),
        tax_behavior: 'exclusive', // Specify that tax is added on top
      },
      quantity: item.quantity,
      // --- Add the Tax Rate to each item ---
      tax_rates: [process.env.STRIPE_TAX_RATE_ID],
    }
  })

  const success_url = `${process.env.NEXT_PUBLIC_SITE_URL}/order/success`
  const cancel_url = `${process.env.NEXT_PUBLIC_SITE_URL}/order/cancel`

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url,
    cancel_url,
  })

  redirect(session.url)
}