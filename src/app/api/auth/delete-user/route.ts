import { auth } from "lib/authentication";
import { NextRequest } from "next/server";
import { UserUpdate } from "types/database";

/**
 * This endpoint permanantly deletes a user along with all of their sessions and keys.
 * @param _request - Ignored web standard request object.
 * @param options - Options object that contains needed url parameters.
 * @returns deleted user ID.
 */
export async function DELETE(request: NextRequest) {
  const userUpdate: UserUpdate = await request.json();
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (session) {
    if (session.user.userId == userUpdate.id) {
      await auth.deleteUser(session.user.userId);
      return Response.json(session.user.userId);
    } else {
      return Response.json("ID in request body does not match current user session.", { status: 422 });
    }
  } else {
    return Response.json("User authentication failed.", { status: 401 });
  }
}
