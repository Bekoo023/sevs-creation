import { useId } from "react";
import { BACKGROUNDS, FRAMES } from "@/lib/options";
import type { AnimalId, BackgroundId, FrameId } from "@/lib/types";

/**
 * Illustratieve preview van een geboortelijst.
 *
 * Dit is bewust een getekende schets en geen fotorealistische weergave:
 * ze laat de gekozen lijst, kleur, vorm en tekst zien, niet het exacte eindresultaat.
 */

// Deterministische "willekeur", zodat server en client hetzelfde tekenen.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const ROSES = (() => {
  const rand = seeded(7);
  const out: { x: number; y: number; r: number; tone: number; turn: number }[] = [];
  const step = 19;
  let row = 0;
  for (let y = 48; y < 318; y += step * 0.86, row++) {
    for (let x = 128 + (row % 2 ? step / 2 : 0); x < 345; x += step) {
      const big = rand() > 0.72;
      out.push({
        x: x + (rand() - 0.5) * 6,
        y: y + (rand() - 0.5) * 6,
        r: big ? 13.5 + rand() * 3 : 9 + rand() * 2.5,
        tone: rand() < 0.5 ? 0 : rand() < 0.62 ? 1 : 2,
        turn: rand() * 360,
      });
    }
  }
  return out.sort((a, b) => a.r - b.r);
})();

function Rose({ x, y, r, turn, fill }: { x: number; y: number; r: number; turn: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn})`}>
      <circle r={r} fill={fill} stroke="rgba(60,40,35,0.16)" strokeWidth="0.6" />
      <path
        d={`M ${-r * 0.62} 0 A ${r * 0.62} ${r * 0.62} 0 1 1 ${r * 0.5} ${r * 0.36} A ${r * 0.4} ${r * 0.4} 0 1 1 ${-r * 0.22} ${-r * 0.1} A ${r * 0.18} ${r * 0.18} 0 1 1 ${r * 0.12} ${r * 0.06}`}
        fill="none"
        stroke="rgba(60,40,35,0.17)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </g>
  );
}

/** De silhouetten zijn opgebouwd uit eenvoudige vormen, zoals het sjabloon van de echte lijst. */
function AnimalShapes({ animal }: { animal: AnimalId }) {
  if (animal === "beer") {
    return (
      <>
        <circle cx="196" cy="98" r="22" />
        <circle cx="274" cy="98" r="22" />
        <circle cx="235" cy="132" r="50" />
        <ellipse cx="235" cy="222" rx="54" ry="56" />
        <circle cx="190" cy="266" r="25" />
        <circle cx="280" cy="266" r="25" />
      </>
    );
  }
  if (animal === "konijn") {
    return (
      <>
        <ellipse cx="216" cy="86" rx="14" ry="42" transform="rotate(-9 216 86)" />
        <ellipse cx="254" cy="86" rx="14" ry="42" transform="rotate(9 254 86)" />
        <circle cx="235" cy="150" r="38" />
        <ellipse cx="235" cy="232" rx="50" ry="54" />
        <ellipse cx="200" cy="278" rx="23" ry="14" />
        <ellipse cx="270" cy="278" rx="23" ry="14" />
      </>
    );
  }
  return (
    <>
      {/* slurf */}
      <path d="M 190 172 C 150 170 132 122 152 84 C 160 68 184 70 184 88 C 184 100 170 100 168 92 C 160 118 172 138 204 132 Z" />
      <circle cx="224" cy="140" r="48" />
      <ellipse cx="250" cy="226" rx="60" ry="56" />
      <circle cx="212" cy="272" r="23" />
      <circle cx="288" cy="272" r="23" />
      {/* staart */}
      <path d="M 304 236 C 326 236 330 214 322 204 C 318 198 310 204 316 210 C 320 216 316 224 302 222 Z" />
    </>
  );
}

function AnimalDetails({ animal, ribbon, paper }: { animal: AnimalId; ribbon: string; paper: string }) {
  const bow = (x: number, y: number, s = 1) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinejoin="round">
        <path d="M-3 2 L-12 26 L-4 22 Z M3 2 L12 26 L4 22 Z" fill={ribbon} />
        <path d="M0 0 L-22 -12 Q-27 0 -22 12 Z" fill={ribbon} />
        <path d="M0 0 L22 -12 Q27 0 22 12 Z" fill={ribbon} />
        <circle r="5" fill={ribbon} />
      </g>
      <path d="M-18 -7 Q-21 0 -18 7 M18 -7 Q21 0 18 7" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none" />
    </g>
  );
  if (animal === "beer") {
    return (
      <>
        <ellipse cx="235" cy="146" rx="15" ry="11" fill="#fff" />
        <ellipse cx="235" cy="141" rx="5" ry="3.4" fill="rgba(60,40,35,0.55)" />
        <path d="M214 124 q6 -6 12 0 M244 124 q6 -6 12 0" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="190" cy="266" r="13" fill="#fff" />
        <circle cx="280" cy="266" r="13" fill="#fff" />
        {bow(235, 184, 0.95)}
      </>
    );
  }
  if (animal === "konijn") {
    return (
      <>
        <path d="M219 146 q6 -6 12 0 M240 146 q6 -6 12 0" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <ellipse cx="200" cy="278" rx="12" ry="7" fill="#fff" />
        <ellipse cx="270" cy="278" rx="12" ry="7" fill="#fff" />
        {bow(235, 190, 0.85)}
      </>
    );
  }
  return (
    <>
      <ellipse cx="246" cy="148" rx="25" ry="31" fill={paper} stroke="#fff" strokeWidth="3.5" transform="rotate(-10 246 148)" />
      <path d="M194 136 q7 6 15 0 M195 138.5 l-2.5 3 M201.500 140.500 v3.500 M208 138.500 l2.500 3" stroke="rgba(40,30,28,0.8)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M194 266 a8 8 0 0 1 12 0 a8 8 0 0 1 12 0 a8 8 0 0 1 12 0 v29 h-36 Z" fill="#fff" opacity="0.96" />
      <path d="M270 266 a8 8 0 0 1 12 0 a8 8 0 0 1 12 0 a8 8 0 0 1 12 0 v29 h-36 Z" fill="#fff" opacity="0.96" />
      {bow(214, 190, 0.9)}
    </>
  );
}

export type FramePreviewProps = {
  frame: FrameId;
  background: BackgroundId;
  animal: AnimalId;
  naam?: string;
  datum?: string;
  tijd?: string;
  gewicht?: string;
  lengte?: string;
  className?: string;
  title?: string;
};

export function FramePreview({
  frame,
  background,
  animal,
  naam,
  datum,
  tijd,
  gewicht,
  lengte,
  className,
  title,
}: FramePreviewProps) {
  const id = useId().replace(/:/g, "");
  const f = FRAMES[frame];
  const bg = BACKGROUNDS[background];
  const ghost = 0.55;
  const text = (value: string | undefined, placeholder: string) => ({
    children: value || placeholder,
    opacity: value ? 1 : ghost,
  });
  const name = naam || "Naam";
  const nameSize = name.length > 12 ? 34 : name.length > 8 ? 42 : 52;

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label={
        title ??
        `Illustratieve preview: ${f.label.toLowerCase()} lijst, achtergrond ${bg.label.toLowerCase()}${naam ? `, naam ${naam}` : ""}`
      }
    >
      <defs>
        <clipPath id={`clip-${id}`}>
          <AnimalShapes animal={animal} />
        </clipPath>
        <linearGradient id={`depth-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(0,0,0,0.26)" />
          <stop offset="0.5" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <filter id={`lift-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#2a1f1c" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* lijst */}
      <rect width="400" height="400" fill={f.color} style={{ transition: "fill .7s" }} />
      <rect x="0.5" y="0.5" width="399" height="399" fill="none" stroke={f.edge} />
      <rect x="27" y="27" width="346" height="346" fill={f.edge} style={{ transition: "fill .7s" }} />
      {/* achtergrond, iets verdiept */}
      <rect x="31" y="31" width="338" height="338" fill={bg.color} style={{ transition: "fill .7s" }} />
      <rect x="31" y="31" width="338" height="338" fill={`url(#depth-${id})`} opacity="0.5" />

      {/* figuur */}
      <g filter={`url(#lift-${id})`}>
        <g fill="#fff" stroke="#fff" strokeWidth="9" strokeLinejoin="round">
          <AnimalShapes animal={animal} />
        </g>
        <g clipPath={`url(#clip-${id})`}>
          <rect x="120" y="40" width="240" height="290" fill={bg.roses[1]} style={{ transition: "fill .7s" }} />
          {ROSES.map((r, i) => (
            <Rose key={i} {...r} fill={bg.roses[r.tone]} />
          ))}
        </g>
        <AnimalDetails animal={animal} ribbon={bg.roses[0]} paper={bg.roses[1]} />
      </g>

      {/* geboortegegevens */}
      <g fill="#fff" fontFamily="var(--font-script)" textAnchor="middle" fontSize="19">
        <text x="88" y="166" {...text(tijd ? `${tijd} uur` : undefined, "00:00 uur")} />
        <rect x="52" y="177" width="72" height="1.4" opacity="0.95" />
        <text x="88" y="203" {...text(gewicht, "0,000 kg")} />
        <rect x="52" y="214" width="72" height="1.4" opacity="0.95" />
        <text x="88" y="240" {...text(lengte ? `${lengte} cm` : undefined, "00 cm")} />
        <text x="0" y="0" fontSize="21" transform="translate(338 178) rotate(90)" {...text(datum, "dag maand jaar")} />
        <text x="200" y="350" fontSize={nameSize} opacity={naam ? 1 : ghost}>
          {name}
        </text>
      </g>

      {/* glans van het glas */}
      <path d="M31 31 H190 L60 369 H31 Z" fill="#fff" opacity="0.05" />
    </svg>
  );
}
