import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell grid min-h-[85vh] place-items-center pt-24 text-center">
      <div>
        <p className="label text-mocha">404</p>
        <h1 className="display t-1 mt-5">Deze pagina bestaat niet.</h1>
        <p className="mx-auto mt-5 max-w-sm text-mocha">Misschien is de creatie verplaatst of niet meer te bestellen.</p>
        <Link href="/shop" className="btn btn-primary mt-10">
          Naar de collectie
        </Link>
      </div>
    </section>
  );
}
