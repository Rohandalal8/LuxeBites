import "./globals.css";

export const metadata = { title: "Luxebites Admin", description: "Platform administration workspace" };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
