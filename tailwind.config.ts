import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        "text-primary": "rgb(var(--text-primary-rgb) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary-rgb) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary-rgb) / <alpha-value>)",
          hover: "rgb(var(--primary-hover-rgb) / <alpha-value>)",
        },
        navy: "rgb(var(--navy-rgb) / <alpha-value>)",
        border: "rgb(var(--border-rgb) / <alpha-value>)",
        success: "rgb(var(--success-rgb) / <alpha-value>)",
        warning: "rgb(var(--warning-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        button: "12px",
      },
      maxWidth: {
        container: "1220px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(16, 40, 72, 0.06), 0 1px 2px rgba(16, 40, 72, 0.04)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(0%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "node-in": {
          from: { opacity: "0", transform: "scale(0.6)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "ring-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "dash-flow": {
          to: { strokeDashoffset: "-24" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(20px, -16px) scale(1.06)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "scan-line": "scan-line 3.2s ease-in-out infinite",
        "node-in": "node-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        float: "float 4s ease-in-out infinite",
        "ring-spin": "ring-spin 18s linear infinite",
        "dash-flow": "dash-flow 1.6s linear infinite",
        drift: "drift 12s ease-in-out infinite",
        "drift-slow": "drift 16s ease-in-out infinite reverse",
      },
    },
  },
  plugins: [],
};

export default config;
