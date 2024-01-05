import { version } from "data/package";

/**
 * /api/version:
 * Endpoint for checking current site version.
 * @returns current version as listed in package.json.
 */
export async function GET() {
  return new Response(version);
}
