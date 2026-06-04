import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-[#F3F8EE]",
    "bg-[#F3F7FC]",
    "bg-[#F5F0FB]",
    "bg-[#FBF7EE]",
    "text-[#7EA849]",
    "text-[#4A7DDB]",
    "text-[#8B5CF6]",
    "text-[#D4A017]",
  ],
  theme: {
    extend: {
      screens: {
        desktop: "1376px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Roboto", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#7EA849",
          dark: "#6B913A",
          light: "#9BBF6E",
          muted: "#E8F0DC",
          glow: "rgba(126, 168, 73, 0.35)",
        },
        nav: {
          DEFAULT: "var(--color-navbar)",
          border: "var(--color-navbar-border)",
          hover: "var(--color-navbar-hover)",
        },
      },
      boxShadow: {
        "hero-card":
          "0 24px 80px rgba(15, 23, 42, 0.08), 0 8px 24px rgba(15, 23, 42, 0.04)",
        "hero-cta": "0 10px 30px rgba(126, 168, 73, 0.25)",
        "hero-glass": "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(126, 168, 73, 0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(126, 168, 73, 0.06), transparent 45%), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(148, 163, 184, 0.06), transparent 50%)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-18px) translateX(8px)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        "orbit-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "logo-marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-medium": "float-medium 6s ease-in-out infinite",
        "orbit-spin": "orbit-spin 20s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "logo-marquee": "logo-marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
