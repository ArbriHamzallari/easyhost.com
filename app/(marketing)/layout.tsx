import { MarketingNav } from "@/frontend/components/marketing/nav";
import { MarketingFooter } from "@/frontend/components/marketing/footer";
import { ForceLightMode } from "@/frontend/components/theme/force-light-mode";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ForceLightMode />
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
