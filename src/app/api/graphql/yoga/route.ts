import { yoga } from "lib/graphql/server";

const { handleRequest } = yoga;

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
