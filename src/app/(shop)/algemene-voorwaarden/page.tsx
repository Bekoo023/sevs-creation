import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Algemene Voorwaarden", alternates: { canonical: "/algemene-voorwaarden" } };

export default function Page() {
  return <LegalPage doc="voorwaarden" />;
}
