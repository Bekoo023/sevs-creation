"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="shell grid min-h-[85vh] place-items-center pt-24 text-center">
      <div>
        <h1 className="display t-1">Er ging iets mis.</h1>
        <p className="mx-auto mt-5 max-w-sm text-mocha">Probeer het opnieuw. Blijft het misgaan, neem dan contact met ons op.</p>
        <button type="button" onClick={reset} className="btn btn-primary mt-10">
          Opnieuw proberen
        </button>
      </div>
    </section>
  );
}
