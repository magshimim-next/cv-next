/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    zIndex: {
      '0': 0,
      '10': 10,
      '20': 20,
      '30': 30,
      '40': 40,
      '50': 50,
      '25': 25,
      '50': 50,
      '75': 75,
      'popup-bg': 100,
      'popup': 101,
      'auto': 'auto',
    },
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
          from: {
            height: 0,
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: 0,
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      gridTemplateColumns: {
        '1': 'repeat(1, minmax(0, auto))',
        '2': 'repeat(2, minmax(0, auto))',
        '3': 'repeat(3, minmax(0, auto))'
      },

      colors: {
        "theme": {
          50: "var(--theme-50)",
          100: "var(--theme-100)",
          200: "var(--theme-200)",
          300: "var(--theme-300)",
          400: "var(--theme-400)",
          500: "var(--theme-500)",
          600: "var(--theme-600)",
          700: "var(--theme-700)",
          800: "var(--theme-800)",
          900: "var(--theme-900)",
          950: "var(--theme-950)",
        },
        "text-color": "var(--text-color)",
        "card-background": "var(--card-background)",
        "card-border": "var(--card-border)",

        "btn-background": "var(--btn-background)",
        "btn-hover-background": "var(--btn-hover-background)",

        "input-background": "var(--input-background)",
        "input-border": "var(--input-border)",
        
        "background": "var(--background)",
        
        "forground": "var(--forground)",







        "muted": "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        "card": "var(--card)",
        "card-foreground": "var(--card-foreground)",
        "popover": "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        "border": "var(--border)",
        "input": "var(--input)",
        "primary": "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        "secondary": "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        "accent": "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        "destructive": "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        "ring": "var(--ring)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}