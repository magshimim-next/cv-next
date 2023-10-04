/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px"
            }
        },
        extend: {
            keyframes: {
                "accordion-down": {
                    from: {
                        height: 0
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)"
                    }
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)"
                    },
                    to: {
                        height: 0
                    }
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out"
            },

            "colors": {
                "theme": {
                    50: "#E5EAF0",
                    100: "#DCE3EA",
                    200: "#C2CEDB",
                    300: "#A6B7CA",
                    400: "#839BB5",
                    500: "#5B7898",
                    600: "#506A86",
                    700: "#496079",
                    800: "#1e293b",
                    900: "#0f172a",
                    950: "#020617"
                }
            }
        }
    },
    plugins: [require("tailwindcss-animate")]
}
