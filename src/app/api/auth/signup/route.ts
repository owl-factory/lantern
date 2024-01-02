import { auth } from "lib/authentication";
import { NewUser } from "types/database";

/**
 * User signup endpoint.
 * @param request - Web standard request object that contains the POST body and auth cookies.
 * @returns session for newly created user.
 */
export async function POST(request: Request) {
  const newUser: NewUser & { password?: string } = await request.json();

  // Create user
  const user = await auth.createUser({
    userId: crypto.randomUUID(),
    key: {
      providerId: "email",
      providerUserId: newUser.email.toLowerCase(),
      password: newUser.password,
    },
    attributes: {
      email: newUser.email,
      username: newUser.username,
      display_name: newUser.display_name,
      icon_url: newUser.icon_url,
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

  const sessionCookie = auth.createSessionCookie(session);
  return Response.json(session, { headers: { "Set-Cookie": sessionCookie.serialize() } });
}
