import Link from "next/link";

export function Navbar() {
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
          <Link href="/cart" className="transition hover:text-[#273b32]">Cart</Link>
          <Link href="/login" className="transition hover:text-[#273b32]">Login</Link>
        </nav>

        <Link href="/cart" className="rounded-full bg-[#273b32] px-5 py-2.5 text-sm font-semibold text-[#fffaf1] transition hover:bg-[#1f2d26]">
          Cart
        </Link>
      </div>
    </header>
  );
}
