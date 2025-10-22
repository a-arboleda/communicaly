// tailwind.config.ts
import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"
import typography from "@tailwindcss/typography"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Warm earthy palette
          900: "#5c2e11ff", // deep cocoa
          700: "#6E4E31", // roasted chestnut
          500: "#B2854C", // toasted caramel
          200: "#E7D7C0", // soft sandstone
          accent: "#9AAB63", // muted olive
        },
      },
      fontFamily: {
        // Prefer local Inter (fallback), then system sans
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        // Use Inter as serif fallback too to unify look
        serif: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: "0 10px 30px rgba(63,47,37,.08)", // subtle warm shadow
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      // If you’re using @tailwindcss/typography, you can set prose defaults here:
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "--tw-prose-headings": theme("colors.brand.900"),
            "--tw-prose-body": theme("colors.gray.700"),
            "--tw-prose-links": theme("colors.brand.900"),
            "--tw-prose-bold": theme("colors.brand.900"),
          },
        },
      }),
    },
  },
  plugins: [typography()],
}

export default config
