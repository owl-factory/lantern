import { yoga } from "lib/graphql/server";
import { sandboxHandler } from "app/api/graphql/sandboxHandler";

const { handleRequest } = yoga;

export { sandboxHandler as GET, handleRequest as POST, handleRequest as OPTIONS };
