import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { ActionForm, Submit } from "@/components/admin/ui";
import { login } from "../actions";

export const metadata: Metadata = { title: "Inloggen" };

async function LoginCard() {
  // Omgevingsvariabelen bij elk verzoek lezen, niet tijdens de build.
  await connection();
  const configured = Boolean(process.env.ADMIN_PASSWORD && (process.env.AUTH_SECRET ?? "").length >= 32);
  return (
      <div className="w-full max-w-sm bg-ivory p-8 shadow-[0_30px_60px_-40px_rgba(52,43,41,0.4)] sm:p-10">
        <p className="label text-mocha">Sevs Creations</p>
        <h1 className="display t-2 mt-3">Beheer</h1>
        {configured ? (
          <ActionForm action={login} className="mt-8 space-y-6">
            <div>
              <label htmlFor="password" className="field-label">
                Wachtwoord
              </label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
            </div>
            <Submit>Inloggen</Submit>
          </ActionForm>
        ) : (
          <p className="mt-6 text-mocha">
            Het beheer is nog niet ingesteld. Zet <code>ADMIN_PASSWORD</code> en een <code>AUTH_SECRET</code> van
            minstens 32 tekens in <code>.env</code> en start de server opnieuw.
          </p>
        )}
      </div>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <Suspense>
        <LoginCard />
      </Suspense>
    </main>
  );
}
