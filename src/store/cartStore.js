// src/store/cartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          const updatedItems = state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
          return { items: updatedItems };
        } else {
          // --- Add a 'comments' field when a new item is added ---
          return { items: [...state.items, { ...item, quantity: 1, comments: '' }] };
        }
      }),
      
      // --- New function to update comments for a specific item ---
      updateItemComments: (itemId, comments) => set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, comments: comments } : item
        ),
      })),

      increaseQuantity: (itemId) => set((state) => ({
        items: state.items.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      })),
      
      decreaseQuantity: (itemId) => set((state) => ({
        items: state.items
          .map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      })),

      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((i) => i.id !== itemId),
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'mereb-cart-storage',
    }
  )
)