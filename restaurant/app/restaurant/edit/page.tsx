import { RouteShell } from "@/components/route-shell";
import { SectionPage } from "@/components/section-page";

export default function RestaurantEditPage() {
  return <RouteShell><SectionPage eyebrow="Restaurant profile" title="Edit restaurant" description="Update the details guests see before they place an order." /></RouteShell>;
}
