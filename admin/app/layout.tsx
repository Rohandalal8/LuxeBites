import "./globals.css";
import Providers from "./providers";

export const metadata = { title: "Luxebites Admin", description: "Platform administration workspace", icons: { icon: "/luxe-bites-admin-mark.svg" } };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
