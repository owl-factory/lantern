import { version } from "data/package";
import { buildGitCommit, buildTimestamp } from "utils/environment";

/**
 * /api/version:
 * Endpoint for checking current site version info.
 * @returns JSON containing current version as listed in package.json, timestamp of the current build, and the git commit SHA-1 ID of the current build.
 */
export async function GET() {
  return Response.json({ version, timestamp: buildTimestamp, commit: buildGitCommit });
}
