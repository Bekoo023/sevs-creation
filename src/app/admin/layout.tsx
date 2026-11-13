import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Beheer", template: "%s | Beheer Sevs Creations" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-[#f6f3ee] text-[0.9375rem]">{children}</div>;
}
