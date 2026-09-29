"use client";

import Link from "next/link";
import { useState } from "react";

import { CartProvider, useCart } from "@/contexts/cart-context";

function CheckoutPageContent() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("Guest user");
  const [address, setAddress] = useState("12 Garden Avenue, Bengaluru");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!items.length && !orderNumber) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 text-[#28241f] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[700px] rounded-[2rem] border border-[#e8e0d4] bg-[#fffdf9] p-10 text-center shadow-[0_16px_40px_rgba(40,36,31,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d97732]">Checkout</p>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.04em]">Your cart is empty.</h1>
          <Link href="/restaurants" className="mt-8 inline-flex rounded-full bg-[#273b32] px-5 py-3 text-sm font-semibold text-[#fffaf1]">
            Start shopping
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async () => {
    if (!items.length) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          restaurantName: items[0]?.restaurantName ?? "LuxeBites",
          customerName,
          address,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message ?? "Unable to place order.");
      }

      setOrderNumber(payload.data.orderNumber);
      clearCart();
    } catch (submitError) {
      console.error(submitError);
      setError(submitError instanceof Error ? submitError.message : "Unable to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 text-[#28241f] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[700px] rounded-[2rem] border border-[#e8e0d4] bg-[#fffdf9] p-10 text-center shadow-[0_16px_40px_rgba(40,36,31,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d97732]">Order confirmed</p>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.04em]">{orderNumber}</h1>
          <p className="mt-3 text-base leading-7 text-[#665d55]">Your food is being prepared and your rider is on the way.</p>
          <Link href="/restaurants" className="mt-8 inline-flex rounded-full bg-[#273b32] px-5 py-3 text-sm font-semibold text-[#fffaf1]">
            Order more food
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 text-[#28241f] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1100px] grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-[#e8e0d4] bg-[#fffdf9] p-6 shadow-[0_16px_40px_rgba(40,36,31,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d97732]">Delivery details</p>
          <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">Checkout</h1>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#4e493f]">Name</span>
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="w-full rounded-xl border border-[#ded7cb] bg-[#f8f4ef] px-4 py-3 text-sm outline-none focus:border-[#d97732]" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#4e493f]">Delivery address</span>
              <textarea value={address} onChange={(event) => setAddress(event.target.value)} rows={4} className="w-full rounded-xl border border-[#ded7cb] bg-[#f8f4ef] px-4 py-3 text-sm outline-none focus:border-[#d97732]" />
            </label>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-[#e8e0d4] bg-[#fffdf9] p-6 shadow-[0_16px_40px_rgba(40,36,31,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d97732]">Order summary</p>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-sm text-[#5b554e]">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 border-t border-[#efe7dc] pt-4 text-sm text-[#5b554e]">
            <div className="flex items-center justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex items-center justify-between"><span>Delivery fee</span><span>₹{deliveryFee}</span></div>
            <div className="flex items-center justify-between text-base font-bold text-[#273b32]">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {error ? <p className="mt-4 rounded-xl border border-[#f2d4d4] bg-[#fff6f5] p-3 text-sm text-[#8b1f1f]">{error}</p> : null}

          <button type="button" disabled={isSubmitting} onClick={handleSubmit} className="mt-6 inline-flex w-full justify-center rounded-full bg-[#273b32] px-5 py-3 text-sm font-semibold text-[#fffaf1] disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
        </aside>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutPageContent />
    </CartProvider>
  );
}
