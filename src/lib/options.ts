import type { BackgroundId, FrameId } from "./types";

export const FRAMES: Record<FrameId, { label: string; color: string; edge: string }> = {
  zwart: { label: "Zwart", color: "#1d1a19", edge: "#0f0d0c" },
  wit: { label: "Wit", color: "#f7f4ef", edge: "#d9d2c8" },
};

/**
 * `roses` zijn de tinten van de papieren roosjes in de illustratieve preview:
 * hoofdtint, lichte tint en crème.
 */
export const BACKGROUNDS: Record<
  BackgroundId,
  { label: string; color: string; roses: [string, string, string] }
> = {
  roze: { label: "Pastelroze", color: "#e3b9bd", roses: ["#cf8f9a", "#efd3d5", "#fbf3ea"] },
  blauw: { label: "Babyblauw", color: "#bccfe5", roses: ["#8aa6c8", "#cfdcec", "#fbf7ee"] },
  beige: { label: "Beige", color: "#e4d1bc", roses: ["#c4a084", "#dcbfa9", "#fbf3e6"] },
  lila: { label: "Lila", color: "#cbb9dc", roses: ["#a487c2", "#dccfe9", "#fbf5ee"] },
  salie: { label: "Saliegroen", color: "#b7c1aa", roses: ["#8a987c", "#cbd2bf", "#fbf6ea"] },
  zwart: { label: "Zwart", color: "#1f1c1b", roses: ["#d9a7a0", "#cdb9a6", "#f3e6da"] },
};

export const ANIMALS = { olifant: "Olifant", beer: "Beertje", konijn: "Konijntje" } as const;

export const frameLabel = (id?: string | null) =>
  id && id in FRAMES ? FRAMES[id as FrameId].label : null;
export const backgroundLabel = (id?: string | null) =>
  id && id in BACKGROUNDS ? BACKGROUNDS[id as BackgroundId].label : null;
