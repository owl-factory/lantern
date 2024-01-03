import type { Config } from "tailwindcss";

/**
 * TailwindCSS configuration object.
 * See https://tailwindcss.com/docs/configuration.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
