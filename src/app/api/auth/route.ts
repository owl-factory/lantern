import { auth } from "lib/authentication";
import { NextRequest } from "next/server";

/**
 * Endpoint for checking authentication status.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns New session object.
 * @returns Authentication status.
 */
export async function GET(request: NextRequest) {
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  return Response.json({ authenticated: Boolean(session), session });
}
