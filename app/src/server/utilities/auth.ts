import { getSession } from "next-auth/client";

// TODO - better typing? Also comment this! @Lucy
// See context typing for resolvers task
export async function authorize(context: Record<string, unknown>): Promise<boolean> {
  if (context.session) return true;
  context.session = await getSession(context);
  if (context.session) return true;
  return false;
}

// TODO - lucy look at this please
export const NextAuthChecker: any = async ({ root, args, context, info }: any, roles: any) => {
  return await authorize(context);
};
