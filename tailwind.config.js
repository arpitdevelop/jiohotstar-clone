/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        foreground: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-text-secondary) / <alpha-value>)",
        accent: "#0078FF",
        premium: "#E2B616",
        border: "rgb(var(--color-border) / <alpha-value>)",
        "jio-blue": "#0078FF",
        "jio-gold": "#E2B616",
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24,
        xxxl: 32,
        huge: 48,
      },
    },
  },
  plugins: [],
};
