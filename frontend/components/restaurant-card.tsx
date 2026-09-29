import Link from "next/link";

import type { Restaurant } from "@/lib/restaurants";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const price = "$".repeat(Math.max(1, restaurant.priceLevel));

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-[#e7dfd2] bg-[#fffdf9] shadow-[0_12px_35px_rgba(40,36,31,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(40,36,31,0.10)]">
      <div className="relative h-56 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {restaurant.offer ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#fffaf1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#273b32]">
            {restaurant.offer}
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl tracking-[-0.04em] text-[#28241f]">{restaurant.name}</h3>
            <p className="mt-1 text-sm font-medium text-[#d97732]">{restaurant.cuisine}</p>
          </div>
          <span className="rounded-lg bg-[#f5efe7] px-2 py-1 text-xs font-bold text-[#4e493f]">
            ★ {restaurant.rating.toFixed(1)}
          </span>
        </div>

        <p className="text-sm leading-6 text-[#70675f]">{restaurant.description}</p>

        <div className="flex items-center justify-between border-t border-[#efe7dc] pt-4 text-sm text-[#6c625b]">
          <span>{restaurant.location}</span>
          <span>{restaurant.deliveryTime}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#273b32]">{price}</span>
          <Link
            href={`/restaurants/${restaurant.slug}`}
            className="rounded-full border border-[#d5cab7] bg-[#fffaf4] px-4 py-2 text-sm font-semibold text-[#273b32] transition hover:border-[#273b32]"
          >
            View menu
          </Link>
        </div>
      </div>
    </article>
  );
}
