"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Restaurant = {
	name: string;
	cuisine: string;
	description: string;
	rating: string;
	price: string;
	time: string;
	location: string;
	image: string;
	featured?: boolean;
};

const restaurants: Restaurant[] = [
	{ name: "Aster & Rye", cuisine: "New American", description: "Seasonal plates, warm bread, and a dining room worth lingering in.", rating: "4.9", price: "$$$", time: "25-35 min", location: "West Village", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85", featured: true },
	{ name: "Mizu Table", cuisine: "Japanese", description: "Hand-cut sashimi and delicate bowls made with quietly perfect detail.", rating: "4.8", price: "$$$", time: "30-40 min", location: "SoHo", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=85" },
	{ name: "Cicchetti Club", cuisine: "Italian", description: "A little Venice in the city, with handmade pasta and generous pours.", rating: "4.7", price: "$$", time: "20-30 min", location: "Nolita", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=85" },
	{ name: "Saffron House", cuisine: "Indian", description: "Bright, fragrant cooking inspired by family recipes from across India.", rating: "4.8", price: "$$", time: "25-35 min", location: "Lower East Side", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=85" },
	{ name: "Banh & Butter", cuisine: "Vietnamese", description: "Crisp baguettes, slow-simmered broths, and the best kind of mess.", rating: "4.6", price: "$$", time: "15-25 min", location: "Chinatown", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1000&q=85" },
	{ name: "Juniper Café", cuisine: "Café & Bakery", description: "Coffee, flaky things, and an unhurried breakfast for any hour.", rating: "4.9", price: "$", time: "10-20 min", location: "Chelsea", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85" },
];

const cuisines = ["All cuisines", "New American", "Japanese", "Italian", "Indian", "Vietnamese", "Café & Bakery"];

export default function RestaurantsPage() {
	const [query, setQuery] = useState("");
	const [activeCuisine, setActiveCuisine] = useState("All cuisines");
	const [sort, setSort] = useState("Recommended");
	const [favorites, setFavorites] = useState<string[]>([]);

	const visibleRestaurants = useMemo(() => {
		const normalizedQuery = query.toLowerCase().trim();
		const filtered = restaurants.filter((restaurant) => {
			const matchesCuisine = activeCuisine === "All cuisines" || restaurant.cuisine === activeCuisine;
			const searchableText = `${restaurant.name} ${restaurant.cuisine} ${restaurant.location}`.toLowerCase();
			return matchesCuisine && searchableText.includes(normalizedQuery);
		});

		if (sort === "Top rated") return [...filtered].sort((a, b) => Number(b.rating) - Number(a.rating));
		if (sort === "Fastest delivery") return [...filtered].sort((a, b) => Number(a.time.split("-")[0]) - Number(b.time.split("-")[0]));
		return filtered;
	}, [activeCuisine, query, sort]);

	function toggleFavorite(name: string) {
		setFavorites((current) => current.includes(name) ? current.filter((favorite) => favorite !== name) : [...current, name]);
	}

	return (
		<main className="min-h-screen bg-[#f7f4ee] text-[#28241f]">
			<header className="border-b border-[#e8e0d4] bg-[#fffdf9]/95 px-5 py-5 sm:px-8 lg:px-12">
				<div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5">
					  <Link href="/" className="flex shrink-0 items-center gap-3 text-sm font-bold tracking-[0.16em] text-[#273b32] uppercase"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5a524] text-xl tracking-normal">L</span><span className="hidden sm:inline">LuxeBites</span></Link>
					<nav className="hidden items-center gap-8 text-sm font-semibold text-[#81786c] md:flex" aria-label="Main navigation"><a href="/restaurants" className="text-[#273b32]">Discover</a><a href="#favorites" className="transition hover:text-[#273b32]">Favorites</a><a href="#orders" className="transition hover:text-[#273b32]">Orders</a></nav>
					  <Link href="/login" className="rounded-full border border-[#ded7cb] px-4 py-2 text-sm font-bold text-[#273b32] transition hover:border-[#273b32]">Sign in</Link>
				</div>
			</header>

			<section className="border-b border-[#e8e0d4] bg-[#273b32] px-5 py-14 text-[#fffaf1] sm:px-8 lg:px-12 lg:py-20">
				<div className="mx-auto max-w-[1440px]"><div className="max-w-2xl"><p className="mb-4 text-xs font-bold tracking-[0.25em] text-[#f5c56b] uppercase">A better table awaits</p><h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">Good food is closer than you think.</h1><p className="mt-6 max-w-lg text-base leading-7 text-[#e7e2d7]/75">Thoughtful restaurants, memorable dishes, and a little inspiration for whatever you are craving tonight.</p></div><div className="mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row"><label className="flex min-h-14 flex-1 items-center gap-3 rounded-xl bg-[#fffdf9] px-5 text-[#81786c] shadow-lg shadow-[#14241d]/20"><span className="text-xl" aria-hidden="true">⌕</span><span className="sr-only">Search restaurants</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by restaurant, cuisine, or neighborhood" className="w-full bg-transparent text-sm text-[#28241f] outline-none placeholder:text-[#aaa196]" /></label><button type="button" className="min-h-14 rounded-xl bg-[#f5a524] px-7 text-sm font-bold text-[#273b32] transition hover:bg-[#ffc35a]">Search</button></div></div>
			</section>

			<section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12"><div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="mb-2 text-sm font-bold text-[#d97732]">Curated for you</p><h2 className="font-serif text-4xl tracking-[-0.035em] sm:text-5xl">Find your next favorite.</h2></div><label className="flex items-center gap-3 text-sm font-semibold text-[#81786c]"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-[#ded7cb] bg-[#fffdf9] px-3 py-2.5 text-[#28241f] outline-none focus:border-[#d97732]"><option>Recommended</option><option>Top rated</option><option>Fastest delivery</option></select></label></div>
				<div className="mb-9 flex gap-2 overflow-x-auto pb-2" aria-label="Filter by cuisine">{cuisines.map((cuisine) => <button key={cuisine} type="button" onClick={() => setActiveCuisine(cuisine)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${activeCuisine === cuisine ? "bg-[#273b32] text-[#fffaf1]" : "border border-[#ded7cb] bg-[#fffdf9] text-[#81786c] hover:border-[#273b32] hover:text-[#273b32]"}`}>{cuisine}</button>)}</div>
				{visibleRestaurants.length > 0 ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{visibleRestaurants.map((restaurant) => { const isFavorite = favorites.includes(restaurant.name); return <article key={restaurant.name} className="group overflow-hidden rounded-2xl border border-[#e7dfd2] bg-[#fffdf9] shadow-[0_10px_30px_rgba(51,42,29,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(51,42,29,0.1)]"><div className="relative h-56 overflow-hidden bg-[#ded7cb]"><div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${restaurant.image})` }} />{restaurant.featured && <span className="absolute left-4 top-4 rounded-full bg-[#f5a524] px-3 py-1.5 text-xs font-bold text-[#273b32]">Editor&apos;s pick</span>}<button type="button" aria-label={`${isFavorite ? "Remove" : "Add"} ${restaurant.name} ${isFavorite ? "from" : "to"} favorites`} onClick={() => toggleFavorite(restaurant.name)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#fffdf9]/90 text-xl text-[#d97732] shadow-sm transition hover:bg-white">{isFavorite ? "♥" : "♡"}</button></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-serif text-2xl tracking-[-0.02em]">{restaurant.name}</h3><p className="mt-1 text-sm font-semibold text-[#d97732]">{restaurant.cuisine}</p></div><span className="rounded-md bg-[#f2eee6] px-2 py-1 text-xs font-bold text-[#4e493f]">★ {restaurant.rating}</span></div><p className="mt-4 min-h-12 text-sm leading-6 text-[#81786c]">{restaurant.description}</p><div className="mt-5 flex items-center justify-between border-t border-[#eee7dc] pt-4 text-xs font-semibold text-[#81786c]"><span>{restaurant.location} · {restaurant.price}</span><span>{restaurant.time}</span></div></div></article>; })}</div> : <div className="rounded-2xl border border-dashed border-[#cfc5b6] bg-[#fffdf9] px-6 py-16 text-center"><h3 className="font-serif text-3xl">No tables found.</h3><p className="mt-2 text-sm text-[#81786c]">Try another cuisine, neighborhood, or search term.</p></div>}
			</section>

			<footer className="border-t border-[#e8e0d4] px-5 py-8 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col gap-3 text-sm text-[#81786c] sm:flex-row sm:items-center sm:justify-between"><span className="font-bold tracking-[0.12em] text-[#273b32] uppercase">LuxeBites</span><span>Food worth slowing down for · New York City</span></div></footer>
		</main>
	);
}
