import type { Config } from "tailwindcss";

/**
 * TailwindCSS configuration object.
 * See https://tailwindcss.com/docs/configuration.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /** Same as amber-400 */
        primary: "#fbbf24",
        /** Same as zinc-900 */
        backdrop: "#18181b",
      },
    },
  },
  plugins: [],
};

export default config;
