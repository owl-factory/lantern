import { getSession } from "next-auth/client";
import { HTTPHandler } from "server";
import { Context, User } from "types";

export async function getUser(ctx: Context): Promise<(User | null)> {
  if (ctx.session) {
    return ctx.session.user as User;
  } else {
    const req = ctx.req;
    const res = await getSession({req});
    if (res) {
      ctx.session = res;
      return res.user as User;
    } else {
      return null;
    }
  }
}

export async function authenticateUser(handler: HTTPHandler) {
  if (handler.ctx.session) {
    return handler.ctx.session.user as User;
  } else {
    const req = handler.ctx.req;
    const res = await getSession({req});
    if (res) {
      handler.ctx.session = res;
      return res.user as User;
    } else {
      throw { code: 401, message: "You do not have permission to perform this action becuase you are not logged in." };
    }
  }
}

export async function authorizeUserRole(handler: HTTPHandler, role: string) {
  const user = await authenticateUser(handler);
  if (user.roles && user.roles.includes(role)) {
    return user;
  } else {
    throw { code: 401, message: "You do not have permission to perform this action becuase you do not have the required role." };
  }
}
