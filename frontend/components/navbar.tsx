"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { logout } from "@/lib/firebase";

export function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  async function handleLogout() {
    await logout();
    closeMenu();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e8e0d4] bg-[#fffdf9]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-sm font-bold tracking-[0.16em] text-[#273b32] uppercase">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5a524] text-xl tracking-normal">L</span>
          <span className="hidden sm:inline">LuxeBites</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#81786c] md:flex" aria-label="Main navigation">
          <Link href="/" className="transition hover:text-[#273b32]">Home</Link>
          <Link href="/restaurants" className="transition hover:text-[#273b32]">Discover</Link>
          {!loading && user ? (
            <button type="button" onClick={handleLogout} className="transition hover:text-[#273b32]">Logout</button>
          ) : (
            <Link href="/login" className="transition hover:text-[#273b32]">Login</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="hidden rounded-full bg-[#273b32] px-5 py-2.5 text-sm font-semibold text-[#fffaf1] transition hover:bg-[#1f2d26] sm:inline-flex">
            Cart
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ded7cb] text-[#273b32] md:hidden"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-[#e8e0d4] bg-[#fffdf9] px-5 py-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1 text-sm font-semibold text-[#81786c]" aria-label="Mobile navigation">
            <Link href="/" onClick={closeMenu} className="rounded-xl px-4 py-3 hover:bg-[#f2eee6] hover:text-[#273b32]">Home</Link>
            <Link href="/restaurants" onClick={closeMenu} className="rounded-xl px-4 py-3 hover:bg-[#f2eee6] hover:text-[#273b32]">Discover</Link>
            <Link href="/cart" onClick={closeMenu} className="rounded-xl px-4 py-3 hover:bg-[#f2eee6] hover:text-[#273b32]">Cart</Link>
            {!loading && user ? (
              <button type="button" onClick={handleLogout} className="rounded-xl px-4 py-3 text-left hover:bg-[#f2eee6] hover:text-[#273b32]">Logout</button>
            ) : (
              <Link href="/login" onClick={closeMenu} className="rounded-xl px-4 py-3 hover:bg-[#f2eee6] hover:text-[#273b32]">Login</Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}