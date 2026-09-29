"use client";

import Link from "next/link";

import { CartProvider, useCart } from "@/contexts/cart-context";

function CartPageContent() {
  const { items, subtotal, deliveryFee, total, updateQuantity, removeItem, clearCart } = useCart();

  if (!items.length) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 text-[#28241f] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[700px] rounded-[2rem] border border-[#e8e0d4] bg-[#fffdf9] p-10 text-center shadow-[0_16px_40px_rgba(40,36,31,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d97732]">Your cart</p>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.04em]">No dishes in the cart yet.</h1>
          <p className="mt-3 text-base leading-7 text-[#665d55]">Add a few favorites and we’ll get them ready for delivery.</p>
          <Link href="/restaurants" className="mt-8 inline-flex rounded-full bg-[#273b32] px-5 py-3 text-sm font-semibold text-[#fffaf1]">
            Browse restaurants
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 text-[#28241f] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d97732]">Your basket</p>
            <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">Cart</h1>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-[#ded7cb] bg-[#fffdf9] px-4 py-2 text-sm font-semibold text-[#273b32]"
          >
            Clear cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            {items.map((item) => (
              <article key={item.id} className="flex gap-4 rounded-[1.5rem] border border-[#e8e0d4] bg-[#fffdf9] p-4 shadow-[0_10px_30px_rgba(40,36,31,0.04)]">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-[1rem] object-cover" />

                <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d97732]">{item.restaurantName}</p>
                    <h2 className="mt-1 font-serif text-2xl tracking-[-0.04em]">{item.name}</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-[#ded7cb] bg-[#f8f4ef] px-2 py-1.5">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 text-lg">−</button>
                      <span className="min-w-7 text-center text-sm font-semibold">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 text-lg">+</button>
                    </div>

                    <button type="button" onClick={() => removeItem(item.id)} className="text-sm font-semibold text-[#8b1f1f]">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end text-sm font-bold text-[#273b32]">
                  ₹{item.price * item.quantity}
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-[1.75rem] border border-[#e8e0d4] bg-[#fffdf9] p-6 shadow-[0_16px_40px_rgba(40,36,31,0.04)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97732]">Summary</p>
            <div className="mt-5 space-y-3 text-sm text-[#5b554e]">
              <div className="flex items-center justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex items-center justify-between"><span>Delivery fee</span><span>₹{deliveryFee}</span></div>
              <div className="flex items-center justify-between border-t border-[#efe7dc] pt-3 text-base font-bold text-[#273b32]">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <Link href="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-[#273b32] px-5 py-3 text-sm font-semibold text-[#fffaf1]">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageContent />
    </CartProvider>
  );
}
