import { auth } from "lib/authentication";
import { NewUser } from "types/database";

/**
 * User signup endpoint function.
 * @param request - Web standard request object that contains the POST body.
 * @returns new user object.
 */
export async function POST(request: Request) {
  const newUser: NewUser & { password?: string } = await request.json();

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

  return Response.json(user);
}
