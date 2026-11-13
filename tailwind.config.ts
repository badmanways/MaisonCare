import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",           // #242423 Primary Text / Black
        subtext: "var(--color-subtext)",   // #707070 Subtext / Muted
        ivory: "var(--color-ivory)",       // #FAF8F5 White / Ivory Surface & White Text
        cream: "var(--color-cream)",       // #FEF7E9 Light Golden Yellow Section BG
        sage: "var(--color-sage)",         // #EEF5EC Light Sage Green Section BG
        gold: "var(--color-gold)",         // #F1AE1F Primary Golden Yellow Buttons/Accents
        "gold-card": "var(--color-gold-card)", // #FBE7BC Testimonial Cards Gold BG
        green: "var(--color-green)",       // #005F1B Main Forest Green
        footer: "var(--color-footer)",     // #002B0C Footer Deep Green BG
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        body: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        heading: ["Geist", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
