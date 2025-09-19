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
          // Light blue theme
          900: "#2563EB", // primary (blue-600)
          700: "#3B82F6", // blue-500
          500: "#60A5FA", // blue-400
          200: "#DBEAFE", // blue-100
          accent: "#93C5FD", // blue-300
        },
      },
      fontFamily: {
        // Prefer local Inter (fallback), then system sans
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        // Use Inter as serif fallback too to unify look
        serif: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: "0 10px 30px rgba(30,58,138,.08)", // subtle blue-tinted shadow
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
