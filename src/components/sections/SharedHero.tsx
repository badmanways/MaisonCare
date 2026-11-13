"use client";

import React from "react";
import { HERO_MARQUEE_IMAGES } from "@/lib/i18n/dictionaries";

interface SharedHeroProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  actions?: React.ReactNode;
  compactStrip?: boolean;
}

// 4-column staggered height rhythm matching the attached PNG designs:
// Col 1 (tall), Col 2 (medium), Col 3 (shorter), Col 4 (tallest)
const STAGGER_HEIGHTS = [
  "h-[250px] sm:h-[310px] md:h-[360px]", // Col 1: tall
  "h-[205px] sm:h-[255px] md:h-[300px]", // Col 2: medium
  "h-[170px] sm:h-[210px] md:h-[245px]", // Col 3: shorter
  "h-[275px] sm:h-[340px] md:h-[395px]", // Col 4: tallest
];

export default function SharedHero({
  title,
  subtitle,
  actions,
  compactStrip = false,
}: SharedHeroProps) {
  const [images, setImages] = React.useState(HERO_MARQUEE_IMAGES);

  // Randomize / shuffle marquee images every time page is visited or reloaded
  React.useEffect(() => {
    const shuffled = [...HERO_MARQUEE_IMAGES];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Guarantee that the first and last images in the sequence are distinct,
    // so the seam between loop cycles never places duplicate images side by side.
    if (
      shuffled.length > 2 &&
      shuffled[0].src === shuffled[shuffled.length - 1].src
    ) {
      [shuffled[shuffled.length - 1], shuffled[1]] = [
        shuffled[1],
        shuffled[shuffled.length - 1],
      ];
    }
    setImages(shuffled);
  }, []);

  // Map every distinct image to the 4 staggered heights without repeating any image.
  // Duplicated once ([...baseSequence, ...baseSequence]) solely for seamless -50% CSS translation.
  const baseSequence = images.map((img, idx) => ({
    ...img,
    heightClass: STAGGER_HEIGHTS[idx % STAGGER_HEIGHTS.length],
    key: `seq-${idx}-${img.src}`,
  }));

  const marqueeItems = [...baseSequence, ...baseSequence];

  return (
    <section className="w-full bg-[#FEF7E9] pt-10 md:pt-16 overflow-hidden">
      {/* Top Centered Text & CTA Block */}
      <div className="max-w-[960px] mx-auto px-4 sm:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-[64px] font-semibold tracking-tight text-[#242423] leading-[1.12]">
          {title}
        </h1>

        <div className="mt-5 max-w-[740px] mx-auto text-base sm:text-lg text-[#707070] leading-relaxed">
          {subtitle}
        </div>

        {actions && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {actions}
          </div>
        )}
      </div>

      {/* Bottom-Aligned Staggered 4-Column Continuous Marquee Strip */}
      {!compactStrip && (
        <div className="mt-10 md:mt-12 w-full overflow-hidden">
          <div className="animate-hero-marquee items-end gap-4 sm:gap-6 px-2">
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.key}-${index}`}
                className={`w-[220px] sm:w-[280px] md:w-[340px] lg:w-[360px] ${item.heightClass} shrink-0 rounded-t-[20px] overflow-hidden shadow-sm bg-[#FAF8F5]/50 relative group`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {compactStrip && <div className="pb-12 md:pb-16" />}
    </section>
  );
}
