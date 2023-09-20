/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)",
        "--background": "var(--background)",
        "--foreground": "var(--foreground)",
        "--muted": "var(--muted)",
        "--muted-1": "var(--muted-1)",
        "--muted-2": "var(--muted-2)",
        "--muted-3": "var(--muted-3)",
        "--muted-foreground": "var(--muted-foreground)",
        "--card": "var(--card)",
        "--card-foreground": "var(--card-foreground)",
        "--popover": "var(--popover)",
        "--popover-foreground": "var(--popover-foreground)",
        "--border": "var(--border)",
        "--input": "var(--input)",
        "--primary": "var(--primary)",
        "--primary-foreground": "var(--primary-foreground)",
        "--secondary": "var(--secondary)",
        "--secondary-foreground": "var(--secondary-foreground)",
        "--accent": "var(--accent)",
        "--accent-foreground": "var(--accent-foreground)",
        "--destructive": "var(--destructive)",
        "--destructive-foreground": "var(--destructive-foreground)",
        "--ring": "var(--ring)"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
