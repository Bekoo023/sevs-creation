"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ItemSpecs, ItemThumb } from "@/components/cart/CartDrawer";
import { cartSubtotal, useCart } from "@/components/cart/store";
import { formatPrice } from "@/lib/format";
import { shippingFor } from "@/lib/pricing";
import { customerSchema } from "@/lib/validation";

type Field = "email" | "firstName" | "lastName" | "phone" | "street" | "houseNumber" | "postalCode" | "city" | "country";

const FIELDS: { name: Field; label: string; type?: string; autoComplete: string; span?: string; optional?: boolean; inputMode?: "numeric" | "tel" | "email" }[] = [
  { name: "email", label: "E-mailadres", type: "email", autoComplete: "email", span: "col-span-6", inputMode: "email" },
  { name: "firstName", label: "Voornaam", autoComplete: "given-name", span: "col-span-6 sm:col-span-3" },
  { name: "lastName", label: "Achternaam", autoComplete: "family-name", span: "col-span-6 sm:col-span-3" },
  { name: "street", label: "Straat", autoComplete: "address-line1", span: "col-span-4" },
  { name: "houseNumber", label: "Huisnr.", autoComplete: "address-line2", span: "col-span-2" },
  { name: "postalCode", label: "Postcode", autoComplete: "postal-code", span: "col-span-2" },
  { name: "city", label: "Woonplaats", autoComplete: "address-level2", span: "col-span-4" },
  { name: "phone", label: "Telefoon", type: "tel", autoComplete: "tel", span: "col-span-6 sm:col-span-3", optional: true, inputMode: "tel" },
];

export function CheckoutForm({ paymentsLive }: { paymentsLive: boolean }) {
  const items = useCart((s) => s.items);
  // Pas tonen als de winkelwagen uit de browseropslag is geladen.
  const ready = useSyncExternalStore(
    (notify) => useCart.persist.onFinishHydration(notify),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
  const [values, setValues] = useState<Record<Field, string>>({
    email: "", firstName: "", lastName: "", phone: "", street: "", houseNumber: "", postalCode: "", city: "", country: "NL",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [accepted, setAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);
  const hasPersonal = items.some((i) => i.personalization);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = customerSchema.safeParse({ ...values, phone: values.phone || undefined });
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as Field] ??= issue.message;
      setErrors(next);
      document.getElementById(`co-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setErrors({});
    if (!accepted) {
      setTermsError(true);
      document.getElementById("co-terms")?.focus();
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: parsed.data,
          acceptedTerms: true,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            frame: i.frame,
            background: i.background,
            personalization: i.personalization,
            note: i.note,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
      window.location.assign(data.url);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Er ging iets mis. Probeer het opnieuw.");
      setPending(false);
    }
  }

  if (!ready) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-center">
        <div>
          <h1 className="display t-1">Je winkelwagen is leeg.</h1>
          <Link href="/shop" className="btn btn-outline mt-10">
            Naar de collectie
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-x-20 gap-y-14 lg:grid-cols-12">
      <form onSubmit={submit} noValidate className="lg:col-span-7">
        <h1 className="display t-1">Afrekenen</h1>
        {!paymentsLive && (
          <p className="mt-6 border border-gold/60 bg-champagne/40 px-4 py-3 text-sm" role="note">
            Ontwikkelmodus: Stripe is niet geconfigureerd. Er wordt geen betaling uitgevoerd.
          </p>
        )}
        <h2 className="label mt-12">
          <span className="mr-3 text-gold">01</span>Jouw gegevens
        </h2>
        <div className="mt-6 grid grid-cols-6 gap-x-6 gap-y-6">
          {FIELDS.map((f) => (
            <div key={f.name} className={f.span}>
              <label htmlFor={`co-${f.name}`} className="field-label">
                {f.label}
                {f.optional && <span className="normal-case tracking-normal"> (optioneel)</span>}
              </label>
              <input
                id={`co-${f.name}`}
                name={f.name}
                type={f.type ?? "text"}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                required={!f.optional}
                value={values[f.name]}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                aria-invalid={Boolean(errors[f.name])}
                aria-describedby={errors[f.name] ? `co-err-${f.name}` : undefined}
                className="field"
              />
              {errors[f.name] && (
                <p id={`co-err-${f.name}`} className="field-error" role="alert">
                  {errors[f.name]}
                </p>
              )}
            </div>
          ))}
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="co-country" className="field-label">
              Land
            </label>
            <select
              id="co-country"
              autoComplete="country"
              value={values.country}
              onChange={(e) => setValues((v) => ({ ...v, country: e.target.value }))}
              className="field"
            >
              <option value="NL">Nederland</option>
              <option value="BE">België</option>
            </select>
          </div>
        </div>

        <h2 className="label mt-14">
          <span className="mr-3 text-gold">02</span>Betalen
        </h2>
        <p className="mt-3 max-w-md text-mocha">
          Je rondt de betaling af in de beveiligde omgeving van Stripe. Daarna kom je terug op deze
          site voor de bevestiging.
        </p>

        {hasPersonal && (
          <p className="mt-6 max-w-md border-l-2 border-gold pl-4 text-sm text-mocha" role="note">
            Je bestelling bevat een gepersonaliseerd product. Dat maken we speciaal voor jou, en daarom
            kun je het niet retourneren: het herroepingsrecht van 14 dagen geldt hiervoor niet.
            Controleer je gegevens dus goed.
          </p>
        )}
        <div className="mt-6 flex max-w-md items-start gap-3">
          <input
            id="co-terms"
            type="checkbox"
            checked={accepted}
            onChange={(e) => {
              setAccepted(e.target.checked);
              if (e.target.checked) setTermsError(false);
            }}
            aria-invalid={termsError}
            aria-describedby={termsError ? "co-err-terms" : undefined}
            className="mt-1 size-4 shrink-0 accent-espresso"
          />
          <label htmlFor="co-terms" className="text-sm">
            Ik ga akkoord met de{" "}
            <Link href="/algemene-voorwaarden" target="_blank" className="underline underline-offset-4">
              algemene voorwaarden
            </Link>{" "}
            en heb de informatie over{" "}
            <Link href="/verzending-retourneren" target="_blank" className="underline underline-offset-4">
              verzending en retourneren
            </Link>{" "}
            gelezen.
          </label>
        </div>
        {termsError && (
          <p id="co-err-terms" className="field-error" role="alert">
            Ga akkoord met de algemene voorwaarden om te bestellen.
          </p>
        )}
        {formError && (
          <p className="field-error mt-6 text-[0.9375rem]" role="alert">
            {formError}
          </p>
        )}
        <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto" disabled={pending}>
          {pending ? "Een moment" : `Verder naar betalen · ${formatPrice(subtotal + shipping)}`}
        </button>
      </form>

      <aside className="lg:col-span-5" aria-label="Overzicht van je bestelling">
        <div className="bg-champagne/40 p-6 sm:p-9 lg:sticky lg:top-28">
          <h2 className="label">Jouw bestelling</h2>
          <ul className="mt-4">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 border-b border-espresso/10 py-5">
                <ItemThumb item={item} size="h-24 w-[4.75rem]" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <p className="font-serif text-xl leading-tight">
                      {item.name}
                      {item.quantity > 1 && <span className="text-mocha"> × {item.quantity}</span>}
                    </p>
                    <p className="shrink-0 text-sm tabular-nums">{formatPrice(item.unitPriceCents * item.quantity)}</p>
                  </div>
                  <ItemSpecs item={item} />
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-mocha">Subtotaal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mocha">Verzending</dt>
              <dd className="tabular-nums">{shipping === 0 ? "Gratis" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-espresso/15 pt-4">
              <dt className="label">Totaal incl. btw</dt>
              <dd className="font-serif text-[1.75rem] leading-none tabular-nums">{formatPrice(subtotal + shipping)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-mocha">
            Het definitieve bedrag wordt bij het afrekenen opnieuw berekend op basis van de actuele prijzen.
          </p>
        </div>
      </aside>
    </div>
  );
}
