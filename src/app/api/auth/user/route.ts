import { auth } from "lib/authentication";
import * as context from "next/headers";
import { NextRequest } from "next/server";
import { NewUser } from "types/database";

/**
 * User signup endpoint.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns session for newly created user.
 */
export async function POST(request: NextRequest) {
  const newUser: NewUser & { password?: string } = await request.json();

  // Create user
  const user = await auth.createUser({
    key: {
      providerId: "email",
      providerUserId: newUser.email.toLowerCase(),
      password: newUser.password,
    },
    attributes: {
      email: newUser.email,
      username: newUser.username,
      display_name: newUser.display_name,
    },
  });

  await auth.createKey({
    userId: user.userId,
    providerId: "username",
    providerUserId: newUser.username.toLowerCase(),
    password: newUser.password,
  });

  // Create session for new user
  const session = await auth.createSession({
    userId: user.userId,
    attributes: {},
  });
  const authRequest = auth.handleRequest(request.method, context);
  authRequest.setSession(session);

  return Response.json(session);
}
