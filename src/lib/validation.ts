import { z } from "zod";

export const personalizationSchema = z.object({
  naam: z.string().trim().min(1, "Vul de naam in").max(30, "Maximaal 30 tekens"),
  geboortedatum: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Kies de geboortedatum")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Ongeldige datum"),
  geboortetijd: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Vul de tijd in, bijvoorbeeld 08:15"),
  gewicht: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, "Gewicht in gram, bijvoorbeeld 3420")
    .refine((v) => Number(v) >= 300 && Number(v) <= 7000, "Controleer het gewicht"),
  lengte: z
    .string()
    .trim()
    .regex(/^\d{2}$/, "Lengte in centimeter, bijvoorbeeld 51")
    .refine((v) => Number(v) >= 20 && Number(v) <= 70, "Controleer de lengte"),
  opmerking: z.string().trim().max(300, "Maximaal 300 tekens").optional(),
});

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
  frame: z.string().optional(),
  background: z.string().optional(),
  personalization: personalizationSchema.optional(),
  note: z.string().trim().max(300).optional(),
});

export const customerSchema = z.object({
  email: z.email("Vul een geldig e-mailadres in"),
  firstName: z.string().trim().min(1, "Vul je voornaam in").max(60),
  lastName: z.string().trim().min(1, "Vul je achternaam in").max(60),
  phone: z.string().trim().max(20).optional(),
  street: z.string().trim().min(1, "Vul je straat in").max(100),
  houseNumber: z.string().trim().min(1, "Vul je huisnummer in").max(12),
  postalCode: z
    .string()
    .trim()
    .regex(/^(\d{4}\s?[A-Za-z]{2}|\d{4})$/, "Vul een geldige postcode in"),
  city: z.string().trim().min(1, "Vul je woonplaats in").max(80),
  country: z.enum(["NL", "BE"]),
});

export const checkoutSchema = z.object({
  customer: customerSchema,
  items: z.array(cartLineSchema).min(1, "Je winkelwagen is leeg").max(20),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;

/** 3420 -> "3,420 kg" zoals het op de lijst komt te staan. */
export const formatWeight = (grams: string) =>
  /^\d{3,4}$/.test(grams) ? `${(Number(grams) / 1000).toFixed(3).replace(".", ",")} kg` : grams;
