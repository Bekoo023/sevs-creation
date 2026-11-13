"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "@/components/cart/store";
import { siteConfig } from "@/config/site";
import { cx, formatBirthDate, formatPrice } from "@/lib/format";
import { BACKGROUNDS, FRAMES } from "@/lib/options";
import type { BackgroundId, FrameId, Product } from "@/lib/types";
import { formatWeight, personalizationSchema } from "@/lib/validation";
import { FramePreview } from "./FramePreview";
import { FavoriteButton } from "./ProductCard";
import { BackgroundSwatches, FrameToggle } from "./Swatches";

const EASE = [0.22, 1, 0.36, 1] as const;

type Fields = {
  naam: string;
  geboortedatum: string;
  geboortetijd: string;
  gewicht: string;
  lengte: string;
  opmerking: string;
};
const EMPTY: Fields = { naam: "", geboortedatum: "", geboortetijd: "", gewicht: "", lengte: "", opmerking: "" };

export function ProductDetail({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const personal = product.personalizable && product.animal !== null;

  // Voorkeuze vanaf de homepage: /shop/slug?lijst=wit&kleur=lila
  const search = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  const query = new URLSearchParams(search);
  const presetFrame = product.frames.find((f) => f === query.get("lijst"));
  const presetBackground = product.backgrounds.find((b) => b === query.get("kleur"));

  const [frameChoice, setFrame] = useState<FrameId | null>(null);
  const [backgroundChoice, setBackground] = useState<BackgroundId | null>(null);
  const frame: FrameId = frameChoice ?? presetFrame ?? product.frames[0] ?? "zwart";
  const background: BackgroundId = backgroundChoice ?? presetBackground ?? product.backgrounds[0] ?? "roze";
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [quantity, setQuantity] = useState(1);
  const [slide, setSlide] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Dia's: eerst de live preview (bij gepersonaliseerde producten), dan de atelierfoto's.
  const offset = personal ? 1 : 0;
  const slideCount = Math.max(1, product.images.length + offset);

  const goTo = useCallback((index: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  const showMatch = useCallback(
    (f: FrameId, b: BackgroundId) => {
      const match = product.images.findIndex((i) => i.frame === f && i.background === b);
      goTo(match >= 0 ? match + offset : 0);
    },
    [product.images, goTo, offset],
  );

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    const io = new IntersectionObserver(([e]) => setButtonVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(button);
    return () => io.disconnect();
  }, []);

  const onScroll = () => {
    const track = trackRef.current;
    if (track) setSlide(Math.round(track.scrollLeft / track.clientWidth));
  };

  const update = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (key !== "opmerking" && slide !== 0) goTo(0);
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (personal) {
      const parsed = personalizationSchema.safeParse({
        ...fields,
        opmerking: fields.opmerking || undefined,
      });
      if (!parsed.success) {
        const next: Partial<Record<keyof Fields, string>> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as keyof Fields;
          next[key] ??= issue.message;
        }
        setErrors(next);
        const first = Object.keys(next)[0];
        const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
        el?.focus({ preventScroll: true });
        return;
      }
      const match = product.images.find((i) => i.frame === frame && i.background === background);
      add({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        image: (match ?? product.images[0])?.src ?? null,
        unitPriceCents: product.priceCents,
        quantity,
        frame,
        background,
        personalization: parsed.data,
      });
      return;
    }
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      image: product.images[0]?.src ?? null,
      unitPriceCents: product.priceCents,
      quantity,
      note: fields.opmerking.trim() || undefined,
    });
  };

  const soldOut = product.stock !== null && product.stock <= 0;
  const input = (key: keyof Fields) => ({
    id: `veld-${key}`,
    name: key,
    value: fields[key],
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `fout-${key}` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(key, e.target.value),
    className: "field",
  });
  const error = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`fout-${key}`} className="field-error" role="alert">
        {errors[key]}
      </p>
    ) : null;

  return (
    <div className="shell pb-24 pt-24 lg:pt-32">
      <nav aria-label="Kruimelpad" className="label flex flex-wrap gap-2 text-mocha">
        <Link href="/shop" className="link-line">
          Shop
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/shop?categorie=${product.category.slug}`} className="link-line">
          {product.category.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-x-16 gap-y-10 lg:grid-cols-12">
        {/* Galerij */}
        <div className="min-w-0 lg:col-span-7">
          <div className="lg:sticky lg:top-28 lg:max-w-[calc(100svh-14.5rem)]">
            <div className="relative -mx-[clamp(1.25rem,4vw,4rem)] lg:mx-0">
              <div
                ref={trackRef}
                onScroll={onScroll}
                className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
                tabIndex={0}
                role="region"
                aria-roledescription="carrousel"
                aria-label={`Beelden van ${product.name}`}
              >
                {personal && (
                  <div className="relative grid aspect-square w-full shrink-0 snap-center place-items-center bg-[#efe6db]">
                    <div className="w-[76%] shadow-[0_50px_90px_-45px_rgba(52,43,41,0.6)]">
                      <FramePreview
                        className="block h-auto w-full"
                        frame={frame}
                        background={background}
                        animal={product.animal!}
                        naam={fields.naam.trim() || undefined}
                        datum={fields.geboortedatum ? formatBirthDate(fields.geboortedatum) : undefined}
                        tijd={fields.geboortetijd || undefined}
                        gewicht={/^\d{3,4}$/.test(fields.gewicht) ? formatWeight(fields.gewicht) : undefined}
                        lengte={fields.lengte || undefined}
                      />
                    </div>
                    <p className="absolute inset-x-0 bottom-3 px-4 text-center text-xs text-mocha">
                      Illustratieve preview. Elke lijst is handwerk en wijkt in details af.
                    </p>
                  </div>
                )}
                {product.images.map((image, i) => (
                  <div key={image.src} className="relative aspect-square w-full shrink-0 snap-center bg-champagne">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      priority={i === 0 && !personal}
                      quality={85}
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
                {slideCount === 1 && !personal && product.images.length === 0 && (
                  <div className="relative aspect-square w-full shrink-0 bg-champagne">
                    <div className="absolute inset-6 flex flex-col items-center justify-center gap-4 border border-espresso/15 text-center">
                      <span className="display t-2">{product.name}</span>
                      <span className="h-px w-12 bg-gold" />
                      <span className="label text-mocha">Foto volgt</span>
                    </div>
                  </div>
                )}
              </div>
              <FavoriteButton product={product} className="absolute right-4 top-4" />
              {slideCount > 1 && (
                <p className="label absolute left-4 top-4 bg-ivory/90 px-2.5 py-1 lg:hidden" aria-hidden>
                  {slide + 1} / {slideCount}
                </p>
              )}
            </div>

            {slideCount > 1 && (
              <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
                {personal && (
                  <li>
                    <button
                      type="button"
                      onClick={() => goTo(0)}
                      aria-label="Toon jouw ontwerp"
                      aria-current={slide === 0}
                      className={cx(
                        "relative block size-16 shrink-0 border bg-[#efe6db] p-2 transition-colors lg:size-20",
                        slide === 0 ? "border-espresso" : "border-transparent",
                      )}
                    >
                      <FramePreview
                        className="h-full w-full"
                        frame={frame}
                        background={background}
                        animal={product.animal!}
                        title="Jouw ontwerp"
                      />
                    </button>
                  </li>
                )}
                {product.images.map((image, i) => (
                  <li key={image.src}>
                    <button
                      type="button"
                      onClick={() => goTo(i + offset)}
                      aria-label={`Toon foto ${i + 1}`}
                      aria-current={slide === i + offset}
                      className={cx(
                        "relative block size-16 shrink-0 overflow-hidden border transition-colors lg:size-20",
                        slide === i + offset ? "border-espresso" : "border-transparent",
                      )}
                    >
                      <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Informatie en personalisatie */}
        <div className="min-w-0 lg:col-span-5">
          <p className="label text-mocha">{product.category.name}</p>
          <h1 className="display t-1 mt-3">{product.name}</h1>
          <p className="mt-2 text-mocha">{product.subtitle}</p>
          <p className="mt-6 font-serif text-[2rem] leading-none tabular-nums">{formatPrice(product.priceCents)}</p>
          <p className="mt-1 text-xs text-mocha">Inclusief btw, exclusief verzending</p>
          <p className="mt-7 max-w-md text-[1.0625rem] leading-relaxed text-mocha">{product.description}</p>

          <form ref={formRef} onSubmit={submit} noValidate className="mt-10">
            {personal && (
              <>
                <section className="border-t border-espresso/15 py-7">
                  <div className="flex items-baseline justify-between">
                    <h2 className="label">
                      <span className="mr-3 text-gold">01</span>Fotolijst
                    </h2>
                    <p className="text-sm text-mocha">{FRAMES[frame].label}</p>
                  </div>
                  <div className="mt-4">
                    <FrameToggle
                      options={product.frames}
                      value={frame}
                      onChange={(f) => {
                        setFrame(f);
                        showMatch(f, background);
                      }}
                    />
                  </div>
                </section>

                <section className="border-t border-espresso/15 py-7">
                  <div className="flex items-baseline justify-between">
                    <h2 className="label">
                      <span className="mr-3 text-gold">02</span>Achtergrondkleur
                    </h2>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={background}
                        className="text-sm text-mocha"
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                      >
                        {BACKGROUNDS[background].label}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="mt-4">
                    <BackgroundSwatches
                      options={product.backgrounds}
                      value={background}
                      size="size-12"
                      onChange={(b) => {
                        setBackground(b);
                        showMatch(frame, b);
                      }}
                    />
                  </div>
                </section>

                <section className="border-t border-espresso/15 py-7">
                  <h2 className="label">
                    <span className="mr-3 text-gold">03</span>Geboortegegevens
                  </h2>
                  <p className="mt-2 text-sm text-mocha">
                    Controleer de spelling goed. We nemen de gegevens precies zo over op de lijst.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
                    <div className="col-span-2">
                      <label htmlFor="veld-naam" className="field-label">
                        Naam baby
                      </label>
                      <input {...input("naam")} type="text" maxLength={30} autoComplete="off" placeholder="Elara" required />
                      {error("naam")}
                    </div>
                    <div>
                      <label htmlFor="veld-geboortedatum" className="field-label">
                        Geboortedatum
                      </label>
                      <input {...input("geboortedatum")} type="date" required />
                      {error("geboortedatum")}
                    </div>
                    <div>
                      <label htmlFor="veld-geboortetijd" className="field-label">
                        Geboortetijd
                      </label>
                      <input {...input("geboortetijd")} type="time" required />
                      {error("geboortetijd")}
                    </div>
                    <div>
                      <label htmlFor="veld-gewicht" className="field-label">
                        Gewicht in gram
                      </label>
                      <input {...input("gewicht")} type="text" inputMode="numeric" maxLength={4} placeholder="3420" required />
                      {error("gewicht")}
                    </div>
                    <div>
                      <label htmlFor="veld-lengte" className="field-label">
                        Lengte in cm
                      </label>
                      <input {...input("lengte")} type="text" inputMode="numeric" maxLength={2} placeholder="51" required />
                      {error("lengte")}
                    </div>
                  </div>
                </section>
              </>
            )}

            <section className="border-t border-espresso/15 py-7">
              <label htmlFor="veld-opmerking" className="field-label">
                Persoonlijke opmerking <span className="normal-case tracking-normal">(optioneel)</span>
              </label>
              <textarea
                {...input("opmerking")}
                rows={2}
                maxLength={300}
                placeholder={personal ? "Bijvoorbeeld een wens voor de kleur van de strik" : "Bijvoorbeeld een kleurwens"}
              />
              {error("opmerking")}
            </section>

            <div className="flex items-stretch gap-3 border-t border-espresso/15 pt-7">
              <div className="flex items-center border border-espresso/25">
                <button
                  type="button"
                  className="grid h-full w-11 place-items-center disabled:opacity-30"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Aantal verlagen"
                >
                  <Minus size={14} strokeWidth={1.5} />
                </button>
                <span className="w-6 text-center tabular-nums" aria-live="polite" aria-label={`Aantal: ${quantity}`}>
                  {quantity}
                </span>
                <button
                  type="button"
                  className="grid h-full w-11 place-items-center disabled:opacity-30"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  aria-label="Aantal verhogen"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>
              <button ref={buttonRef} type="submit" className="btn btn-primary flex-1 !px-4" disabled={soldOut}>
                {soldOut ? "Uitverkocht" : `In winkelwagen · ${formatPrice(product.priceCents * quantity)}`}
              </button>
            </div>
          </form>

          {/* Specificaties, gezet zoals de gegevens op de lijst: regels met een haarlijn ertussen */}
          <dl className="mt-12">
            {product.details.map((d, i) => (
              <div key={d} className="flex gap-5 border-t border-espresso/15 py-3.5 last:border-b">
                <dt className="label w-6 pt-1 text-gold">0{i + 1}</dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-mocha">
            {siteConfig.shipping.leadTime ? `${siteConfig.shipping.leadTime} ` : ""}
            Meer over bezorgen en retourneren lees je bij{" "}
            <Link href="/verzending-retourneren" className="link-line is-drawn !py-0 text-espresso">
              Verzending & Retourneren
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Vaste bestelknop op mobiel zodra de gewone knop uit beeld is */}
      <AnimatePresence>
        {!buttonVisible && !soldOut && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-espresso/15 bg-ivory px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <button type="button" onClick={() => submit()} className="btn btn-primary w-full">
              In winkelwagen · {formatPrice(product.priceCents * quantity)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
