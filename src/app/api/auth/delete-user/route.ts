import { AUTH_COOKIE_NAME, auth } from "lib/authentication";
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
  const userUpdate: UserUpdate = await request.json();
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  if (authCookie) {
    // Session returns null on authentication failure
    const session = await auth.validateSession(authCookie.value);
    if (session?.sessionId) {
      if (session.user.userId == userUpdate.id) {
        await auth.deleteUser(session.user.userId);
        return Response.json({ userId: session.user.userId, deleted: true });
      } else {
        return Response.json("ID in request body does not match current user session.", { status: 422 });
      }
    }
  }
  return Response.json("User authentication failed.", { status: 401 });
}
