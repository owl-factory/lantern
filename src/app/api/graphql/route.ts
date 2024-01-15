import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { apolloServer } from "lib/graphql";

const handler = startServerAndCreateNextHandler(apolloServer, {});

export { handler as GET, handler as POST };
