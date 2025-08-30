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
          900: "#463F3A",
          700: "#8A817C",
          500: "#BCB8B1",
          200: "#F4F3EE",
          accent: "#E0AFA0",
        },
      },
      fontFamily: {
        // Make sure your layout.tsx sets CSS vars with next/font (Inter/Playfair)
        // e.g. <html className={`${inter.variable} ${playfair.variable}`}>
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-serif)", ...defaultTheme.fontFamily.serif],
      },
      boxShadow: {
        card: "0 10px 30px rgba(70,63,58,.08)",
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
