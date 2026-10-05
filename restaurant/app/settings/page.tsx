import { RouteShell } from "@/components/route-shell";
import { SectionPage } from "@/components/section-page";

export default function SettingsPage() {
  return <RouteShell><SectionPage eyebrow="Workspace" title="Settings" description="Manage account preferences, notifications, and restaurant workspace configuration." /></RouteShell>;
}
