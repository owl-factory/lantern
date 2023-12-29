import { auth } from "lib/authentication";

interface UserDeleteOptions {
  params: {
    /** Database id of user to delete. */
    id: string;
  };
}

/**
 * This endpoint permanantly deletes a user along with all of their sessions and keys.
 * @param _request - Ignored web standard request object.
 * @param options - Options object that contains needed url parameters.
 * @returns deleted user ID.
 */
export async function DELETE(_request: Request, options: UserDeleteOptions) {
  const userId = options.params.id;
  await auth.deleteUser(userId);
  return Response.json(userId);
}
