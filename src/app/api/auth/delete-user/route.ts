import { authenticateSession, getDeleteSessionHeaderValue } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { NextRequest } from "next/server";
import { UserUpdate } from "types/database";

/**
 * /api/auth/delete-user:
 * This endpoint permanently deletes a user along with all of their sessions and keys.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @param options - Options object that contains needed url parameters.
 * @returns deleted user ID.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return new Response(auth.error, { status: 401 });
  }
  const session = auth.data;

  const userUpdate: UserUpdate = await request.json();
  if (session.user.userId == userUpdate?.id) {
    await luciaAuth.deleteUser(session.user.userId);
    return Response.json(
      { userId: session.user.userId, deleted: true },
      { headers: { "Set-Cookie": getDeleteSessionHeaderValue() } }
    );
  } else {
    return new Response("ID in request body does not match current user session.", { status: 422 });
  }
}
