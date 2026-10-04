import "./globals.css";

export const metadata = { title: "Luxebites Rider", description: "Delivery operations workspace", icons: { icon: "/luxe-bites-admin-mark.svg" } };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
