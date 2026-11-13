const eur = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" });

export const formatPrice = (cents: number) => eur.format(cents / 100);

/** 2026-03-12 -> 12 maart 2026 */
export function formatBirthDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
  ];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");
