import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Verzending & Retourneren", alternates: { canonical: "/verzending-retourneren" } };

export default function Page() {
  return <LegalPage doc="verzending" />;
}
