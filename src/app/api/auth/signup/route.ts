import { luciaAuth } from "lib/authentication/lucia";
import { NewUser } from "types/database";
import { isBadPassword } from "utils/authentication";

/**
 * /api/auth/signup:
 * User signup endpoint.
 * @param request - Web standard request object that contains the POST body and auth cookies.
 * @returns session for newly created user.
 */
export async function POST(request: Request) {
  const newUser: NewUser & { password?: string } = await request.json();

  if (!newUser || !newUser.password || !newUser.email || !newUser.username) {
    return new Response("Missing one or more required fields for user signup.", { status: 422 });
  }
  if (isBadPassword(newUser.password)) {
    return new Response(
      "Password does not meet requirements. Password should be between 8 and 40 characters and not be a commonly used password.",
      { status: 422 }
    );
  }

  // Create user and login key (email)
  const user = await luciaAuth.createUser({
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

  // Create secondary login key (username)
  await luciaAuth.createKey({
    userId: user.userId,
    providerId: "username",
    providerUserId: newUser.username.toLowerCase(),
    password: newUser.password,
  });

  // Create session for new user
  const session = await luciaAuth.createSession({
    userId: user.userId,
    attributes: {},
  });

  const sessionCookie = luciaAuth.createSessionCookie(session);
  return Response.json(session, { headers: { "Set-Cookie": sessionCookie.serialize() } });
}
