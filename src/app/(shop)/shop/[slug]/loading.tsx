export default function Loading() {
  return (
    <div className="shell grid gap-16 pb-24 pt-32 lg:grid-cols-12" aria-busy="true" aria-label="Product wordt geladen">
      <div className="aspect-square bg-champagne/60 lg:col-span-7" />
      <div className="space-y-5 lg:col-span-5">
        <div className="h-3 w-32 bg-champagne" />
        <div className="h-16 w-3/4 bg-champagne/70" />
        <div className="h-4 w-1/2 bg-champagne/60" />
      </div>
    </div>
  );
}
