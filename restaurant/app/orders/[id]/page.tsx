import { RouteShell } from "@/components/route-shell";
import { SectionPage } from "@/components/section-page";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RouteShell><SectionPage eyebrow={`Order #${id}`} title="Order details" description="Inspect items, payment, delivery information, and the order status timeline." actions={[{ href: "/orders", label: "Back to orders" }]} /></RouteShell>;
}
