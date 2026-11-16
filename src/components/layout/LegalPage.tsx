import { legal } from "@/content/legal";

export function LegalPage({ doc }: { doc: keyof typeof legal }) {
  const { title, intro, sections } = legal[doc];
  return (
    <article className="shell pb-28 pt-36 lg:pt-48">
      <h1 className="display t-1 max-w-[14ch]">{title}</h1>
      <p className="mt-6 max-w-lg text-[1.0625rem] text-mocha">{intro}</p>
      <div className="mt-16 max-w-4xl">
        {sections.map((s, i) => (
          <section key={s.title} className="grid gap-4 border-t border-espresso/15 py-9 md:grid-cols-12">
            <h2 className="font-serif text-2xl leading-tight md:col-span-4">
              <span className="label mr-4 align-middle text-gold">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <div className="space-y-3 text-mocha md:col-span-7 md:col-start-6">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
