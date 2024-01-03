import { luciaAuth, authenticateSession } from "lib/authentication";
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
  const { authenticated, session } = await authenticateSession(request);
  if (!authenticated) {
    return Response.json("User authentication failed.", { status: 401 });
  }

  const userUpdate: UserUpdate = await request.json();
  if (session.user.userId == userUpdate?.id) {
    await luciaAuth.deleteUser(session.user.userId);
    return Response.json(
      { userId: session.user.userId, deleted: true },
      { headers: { "Set-Cookie": luciaAuth.createSessionCookie(null).serialize() } }
    );
  } else {
    return Response.json("ID in request body does not match current user session.", { status: 422 });
  }
}
