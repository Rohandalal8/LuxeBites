import { SectionPage } from "@/components/section-page";

export default function OnboardingSuccessPage() {
  return <SectionPage eyebrow="Setup complete" title="You are ready to go" description="Your restaurant workspace is ready. Continue to the dashboard to start managing operations." actions={[{ href: "/dashboard", label: "Open dashboard" }]} />;
}
