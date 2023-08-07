import { Auth } from "controllers/auth";
import { initializeNextContext } from "utilities/globals/next";

/**
 * Wraps and runs an API function to initialize certain values and handle failures
 * @param ctx The Next Page context
 * @param fx The function to run
 */
export async function handleAPI(ctx: any, fx: any) {
  try {
    initializeNextContext({ req: ctx.req, res: ctx.res });

    Auth.fromReq(ctx.req);

    const result = await fx(ctx.params);
    result.success = true;
    result.message = "";

    return { props: result };

  } catch (error: any) {
    if (error.code && error.message) {
      return { props: {} };

      // return { redirect: {
      //   destination: `/${error.code}?message=${error.message}`,
      //   permanent: false,
      // }};
    } else {
      console.error(error);
      return { props: {} };
      // {
      //   redirect: {
      //     destination: `/500`,
      //     permanent: false,
      //   },
      // };
    }
  }
}

/**
 * Builds and returns an object that redirects when returned from "getServerSideProps"
 * @param destination The destination to redirect the user
 * @param permanent Whether this is a permanent redirect or not
 */
export function sendRedirect(destination: string, permanent=false) {
  return { redirect: { destination, permanent } };
}
