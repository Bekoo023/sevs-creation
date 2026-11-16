import "server-only";
import { siteConfig } from "@/config/site";
import type { Order, OrderItem } from "@/generated/prisma/client";
import { formatBirthDate, formatPrice } from "@/lib/format";
import { backgroundLabel, frameLabel } from "@/lib/options";
import type { Personalization } from "@/lib/types";
import { formatWeight } from "@/lib/validation";

/**
 * E-mail via Resend (https://resend.com), aangeroepen met fetch.
 *
 * Zonder RESEND_API_KEY en EMAIL_FROM wordt er niets verzonden. Een mislukte
 * e-mail breekt nooit een bestelling af; de fout komt in de serverlog.
 */
type OrderWithItems = Order & { items: OrderItem[] };

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

async function send(message: { to: string; subject: string; html: string; text: string; replyTo?: string | null }) {
  if (!emailConfigured()) {
    console.warn(`[e-mail] Niet verzonden, RESEND_API_KEY of EMAIL_FROM ontbreekt: "${message.subject}"`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`[e-mail] Resend weigerde "${message.subject}": ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[e-mail] Verzenden mislukt: "${message.subject}"`, e);
    return false;
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function itemSpecs(item: OrderItem) {
  const p = item.personalization as Partial<Personalization> | null;
  const rows: [string, string | null | undefined | false][] = [
    ["Lijst", frameLabel(item.frame)],
    ["Achtergrond", backgroundLabel(item.background)],
    ["Naam", p?.naam],
    ["Geboortedatum", p?.geboortedatum && formatBirthDate(p.geboortedatum)],
    ["Geboortetijd", p?.geboortetijd && `${p.geboortetijd} uur`],
    ["Gewicht", p?.gewicht && formatWeight(p.gewicht)],
    ["Lengte", p?.lengte && `${p.lengte} cm`],
    ["Opmerking", p?.opmerking],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

const addressLines = (o: Order) => [
  `${o.firstName} ${o.lastName}`,
  `${o.street} ${o.houseNumber}`,
  `${o.postalCode} ${o.city}`,
  o.country === "BE" ? "België" : "Nederland",
];

const companyLine = () => {
  const c = siteConfig.company;
  return [c.legalName ?? siteConfig.name, c.address, c.kvk && `KvK ${c.kvk}`, c.btw && `Btw ${c.btw}`]
    .filter(Boolean)
    .join(" · ");
};

/** Tekstversie van de bestelling: regels, bedragen en bezorgadres. */
function orderText(o: OrderWithItems) {
  const lines = o.items.flatMap((item) => [
    `${item.quantity}× ${item.name}: ${formatPrice(item.unitPriceCents * item.quantity)}`,
    ...itemSpecs(item).map(([k, v]) => `   ${k}: ${v}`),
  ]);
  return [
    ...lines,
    "",
    `Subtotaal: ${formatPrice(o.subtotalCents)}`,
    `Verzending: ${o.shippingCents === 0 ? "Gratis" : formatPrice(o.shippingCents)}`,
    `Totaal incl. btw: ${formatPrice(o.totalCents)}`,
    "",
    "Bezorgadres:",
    ...addressLines(o),
  ].join("\n");
}

function orderHtml(o: OrderWithItems) {
  const items = o.items
    .map((item) => {
      const specs = itemSpecs(item)
        .map(([k, v]) => `${esc(k)}: ${esc(v)}`)
        .join("<br>");
      return `<tr>
        <td style="padding:12px 0;border-top:1px solid #e6ddd0;vertical-align:top">
          <strong>${item.quantity}× ${esc(item.name)}</strong>
          ${specs ? `<div style="margin-top:4px;font-size:14px;color:#6b5a4b">${specs}</div>` : ""}
        </td>
        <td style="padding:12px 0;border-top:1px solid #e6ddd0;vertical-align:top;text-align:right;white-space:nowrap">${formatPrice(item.unitPriceCents * item.quantity)}</td>
      </tr>`;
    })
    .join("");
  const total = (label: string, value: string, bold = false) =>
    `<tr><td style="padding:4px 0${bold ? ";font-weight:bold" : ""}">${label}</td><td style="padding:4px 0;text-align:right${bold ? ";font-weight:bold" : ""}">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">${items}
    <tr><td colspan="2" style="border-top:1px solid #e6ddd0;padding-top:8px"></td></tr>
    ${total("Subtotaal", formatPrice(o.subtotalCents))}
    ${total("Verzending", o.shippingCents === 0 ? "Gratis" : formatPrice(o.shippingCents))}
    ${total("Totaal incl. btw", formatPrice(o.totalCents), true)}
  </table>
  <p style="margin:24px 0 4px;font-weight:bold">Bezorgadres</p>
  <p style="margin:0">${addressLines(o).map(esc).join("<br>")}</p>`;
}

function layout(title: string, bodyHtml: string) {
  return `<!doctype html><html lang="nl"><body style="margin:0;background:#f7f2ea;font-family:Georgia,'Times New Roman',serif;color:#2e241c">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;font-size:16px;line-height:1.55">
    <p style="margin:0 0 24px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#6b5a4b">${esc(siteConfig.name)}</p>
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;font-weight:normal">${esc(title)}</h1>
    ${bodyHtml}
    <p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #e6ddd0;font-size:12px;color:#6b5a4b">${esc(companyLine())}</p>
  </div></body></html>`;
}

const paragraphs = (lines: string[]) => lines.map((l) => `<p style="margin:0 0 14px">${l}</p>`).join("");

const contactSentence = () =>
  siteConfig.contact.email
    ? `Heb je een vraag? Beantwoord deze e-mail of schrijf naar ${siteConfig.contact.email}.`
    : "Heb je een vraag? Je vindt onze gegevens op de contactpagina.";

/** Bevestiging aan de klant zodra de betaling binnen is. */
export function sendOrderConfirmation(o: OrderWithItems) {
  const hasPersonal = o.items.some((i) => {
    const p = i.personalization as Partial<Personalization> | null;
    return Boolean(p?.naam);
  });
  const intro = [
    `Dank je wel voor je bestelling, ${o.firstName}. Je betaling is ontvangen en we gaan voor je aan de slag.`,
    siteConfig.shipping.leadTime,
    "Zodra je bestelling onderweg is, krijg je daarover nog een e-mail.",
  ].filter((l): l is string => Boolean(l));
  const outro = [
    hasPersonal &&
      "Controleer de gegevens hierboven goed. Zie je een fout, laat het ons dan zo snel mogelijk weten: zolang we nog niet zijn begonnen, passen we het aan. Een gepersonaliseerd product wordt speciaal voor jou gemaakt en kan daarom niet worden geretourneerd.",
    `Voor niet-gepersonaliseerde producten heb je 14 dagen bedenktijd na ontvangst. Alle informatie over bezorgen, retourneren en onze voorwaarden lees je op ${siteConfig.url}/verzending-retourneren en ${siteConfig.url}/algemene-voorwaarden.`,
    contactSentence(),
  ].filter((l): l is string => Boolean(l));

  return send({
    to: o.email,
    replyTo: siteConfig.contact.email,
    subject: `Je bestelling ${o.number} bij ${siteConfig.name}`,
    text: [`Bestelling ${o.number}`, "", ...intro, "", orderText(o), "", ...outro, "", companyLine()].join("\n"),
    html: layout(
      "Dank je wel voor je bestelling",
      `<p style="margin:0 0 14px;font-size:14px;color:#6b5a4b">Bestelling ${esc(o.number)}</p>` +
        paragraphs(intro.map(esc)) +
        `<div style="margin:24px 0">${orderHtml(o)}</div>` +
        paragraphs(outro.map(esc)),
    ),
  });
}

/** Melding aan de shop dat er een betaalde bestelling is. */
export function sendNewOrderNotification(o: OrderWithItems) {
  const to = siteConfig.contact.email;
  if (!to) return Promise.resolve(false);
  const adminUrl = `${siteConfig.url}/admin/bestellingen/${o.id}`;
  const customer = [`E-mail: ${o.email}`, o.phone && `Telefoon: ${o.phone}`].filter((l): l is string => Boolean(l));
  return send({
    to,
    replyTo: o.email,
    subject: `Nieuwe bestelling ${o.number} (${formatPrice(o.totalCents)})`,
    text: [`Nieuwe betaalde bestelling ${o.number}.`, "", orderText(o), "", ...customer, "", `Beheer: ${adminUrl}`].join("\n"),
    html: layout(
      `Nieuwe bestelling ${o.number}`,
      paragraphs(["Er is een nieuwe bestelling betaald."]) +
        `<div style="margin:24px 0">${orderHtml(o)}</div>` +
        paragraphs([customer.map(esc).join("<br>"), `<a href="${esc(adminUrl)}" style="color:#2e241c">Open de bestelling in het beheer</a>`]),
    ),
  });
}

/** Verzendbevestiging aan de klant, met track-en-trace als die is ingevuld. */
export function sendShippedEmail(o: OrderWithItems) {
  const tracking = o.tracking?.trim() || null;
  const isLink = tracking !== null && /^https?:\/\/\S+$/.test(tracking);
  const intro = `Goed nieuws, ${o.firstName}: je bestelling ${o.number} is verzonden.`;
  const trackingText = tracking ? (isLink ? `Volg je pakket: ${tracking}` : `Track-en-tracecode: ${tracking}`) : null;
  const trackingHtml = tracking
    ? isLink
      ? `<a href="${esc(tracking)}" style="color:#2e241c">Volg je pakket</a>`
      : `Track-en-tracecode: <strong>${esc(tracking)}</strong>`
    : null;
  const outro = [
    "Is je bestelling beschadigd of niet compleet aangekomen? Stuur ons een foto en je bestelnummer, dan lossen we het op.",
    contactSentence(),
  ];
  return send({
    to: o.email,
    replyTo: siteConfig.contact.email,
    subject: `Je bestelling ${o.number} is onderweg`,
    text: [intro, ...(trackingText ? ["", trackingText] : []), "", "Bezorgadres:", ...addressLines(o), "", ...outro, "", companyLine()].join("\n"),
    html: layout(
      "Je bestelling is onderweg",
      paragraphs([esc(intro), ...(trackingHtml ? [trackingHtml] : [])]) +
        `<p style="margin:24px 0 4px;font-weight:bold">Bezorgadres</p><p style="margin:0 0 24px">${addressLines(o).map(esc).join("<br>")}</p>` +
        paragraphs(outro.map(esc)),
    ),
  });
}
