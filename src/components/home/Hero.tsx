"use client";

import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

const LINES = ["Met liefde gemaakt,", "voor altijd gekoesterd."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-10%"]);
  let i = 0;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f3ebe1_0%,#f6f0e8_55%,var(--color-ivory)_100%)] lg:min-h-[100svh]"
    >
      {/* Beeld: loopt door tot de boven- en rechterrand */}
      <div className="hero-clip relative h-[58svh] min-h-[22rem] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[54%]">
        <motion.div className="absolute inset-0 overflow-hidden" style={{ y: imageY }}>
          <Image
            src="/images/trio-daglicht.jpg"
            alt="Drie handgemaakte geboortelijsten met een konijntje, hertje en beertje van papieren roosjes, in warm daglicht"
            fill
            priority
            quality={85}
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="drift object-cover object-[52%_50%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0.92)_0%,rgba(250,247,242,0)_26%)] lg:bg-[linear-gradient(180deg,rgba(250,247,242,0.5)_0%,rgba(250,247,242,0)_22%)]" />
        </motion.div>
        <p className="vertical label absolute bottom-8 right-5 hidden text-ivory/85 lg:block" aria-hidden>
          Geboortelijsten, papier en lint
        </p>
      </div>

      <motion.div
        className="shell relative flex flex-col justify-end pb-14 pt-10 lg:min-h-[100svh] lg:justify-center lg:pb-24 lg:pt-36"
        style={{ y: textY }}
      >
        <div className="lg:w-[44%] lg:pr-6">
          <p className="hero-soft label flex items-center gap-3 text-mocha" style={{ animationDelay: "0.3s" }}>
            <span>Sevs Creations</span>
            <span aria-hidden className="size-[3px] rounded-full bg-gold" />
            <span>Handmade with love</span>
          </p>

          <h1 className="display mt-6 text-[clamp(2rem,9.2vw,4.25rem)] lg:mt-8 lg:text-[clamp(3.25rem,4.55vw,5.6rem)]">
            {LINES.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line.split(" ").map((word) => (
                  <span key={word} className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom">
                    <span className="hero-word" style={{ "--i": i++ } as CSSProperties}>
                      {word}
                    </span>
                    {" "}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-soft mt-7 max-w-[26rem] text-[1.0625rem] leading-relaxed text-mocha" style={{ animationDelay: "1.15s" }}>
            Unieke geboortecadeaus en handgemaakte bloemenboeketten, speciaal voor de momenten die je
            nooit wilt vergeten.
          </p>

          <div className="hero-soft mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: "1.35s" }}>
            <Magnetic>
              <Link href="/shop" className="btn btn-primary">
                Ontdek de collectie
              </Link>
            </Magnetic>
            <Link href="/over-ons" className="link-line is-drawn label">
              Ons verhaal
            </Link>
          </div>
        </div>

        <a
          href="#introductie"
          className="hero-soft label absolute bottom-8 left-[clamp(1.25rem,4vw,4rem)] hidden items-center gap-3 text-mocha lg:flex"
          style={{ animationDelay: "1.8s" }}
        >
        </a>
      </motion.div>
    </section>
  );
}
