import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Privacybeleid", alternates: { canonical: "/privacybeleid" } };

export default function Page() {
  return <LegalPage doc="privacy" />;
}
