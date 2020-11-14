import { getSession } from "next-auth/client";
import { AuthChecker } from "type-graphql";

export async function authorize(context: any): Promise<boolean> {
  if (context.session) return true;
  context.session = await getSession(context);
  if (context.session) return true;
  return false;
}

// TODO - lucy look at this please
export const NextAuthChecker: AuthChecker<any> = async ({ root, args, context, info }, roles) => {
  return await authorize(context);
};
