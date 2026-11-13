import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "sevs_admin";
const MAX_AGE = 60 * 60 * 8;

const secret = () => process.env.AUTH_SECRET ?? "";
export const adminConfigured = () =>
  Boolean(process.env.ADMIN_PASSWORD && secret().length >= 32);

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string) {
  if (!adminConfigured()) return false;
  return safeEqual(input, process.env.ADMIN_PASSWORD!);
}

export async function createSession() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin() {
  // Eerst de cookie lezen: zo wordt deze controle altijd per verzoek uitgevoerd
  // en nooit tijdens de build vastgelegd.
  const value = (await cookies()).get(COOKIE)?.value;
  if (!adminConfigured() || !value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

/** Aanroepen bovenaan elke adminpagina en elke server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
