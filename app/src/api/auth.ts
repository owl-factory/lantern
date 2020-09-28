import { getSession } from "next-auth/client";
import { AuthChecker } from "type-graphql";

export async function authorize(context: any) {
  if (context.session) return true;
  context.session = await getSession(context);
  if (context.session) return true;
  return false;
}

export const NextAuthChecker: AuthChecker<any> = async ({ root, args, context, info }, roles) => {
  return await authorize(context);
};
