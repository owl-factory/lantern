import Script from "next/script";

/**
 * Pulls in the TailwindCSS CDN script for testing. This script generates required Tailwind styles dynamically
 * as needed (perfect for things like our character sheets) but is not recommended for production.
 * TODO - Find a better solution for supporting all Tailwind classes dynamically before we go to production.
 */
export function FullTailwindStyles() {
  return <Script async={true} src="https://cdn.tailwindcss.com" />;
}
