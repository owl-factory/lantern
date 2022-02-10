import { initializeNextContext } from "@owl-factory/next/ctx";
import { Auth } from "controllers/auth";

export async function handleAPI(ctx: any, fx: any) {
  try {
    initializeNextContext({ req: ctx.req, res: ctx.res });

    Auth.fromReq(ctx.req);

    const result = await fx(ctx.req, ctx.res);
    result.success = true;
    result.message = "";

    return { props: result };

  } catch (error: any) {
    if (error.code && error.message) {
      return { redirect: {
        destination: `/${error.code}?message=${error.message}`,
        permanent: false,
      }};
    } else {
      console.error(error);
      return {
        redirect: {
          destination: `/500`,
          permanent: false,
        },
      };
    }
  }
}

export function sendRedirect(destination: string, permanent=false) {
  return { redirect: { destination, permanent } };
}
