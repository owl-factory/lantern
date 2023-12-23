import { isClient } from "utilities/client";
import { PrismaClient } from "@prisma/client";


let PRISMA_CLIENT: PrismaClient | undefined;

/**
 * A function to get a global prisma client
 */
export function getPrismaClient(): PrismaClient {
  if (isClient) { throw "Prisma Instantiation Error: Prisma cannot be instantiated on the client"; }
  if (!PRISMA_CLIENT) {
    try {
      PRISMA_CLIENT = new PrismaClient();
    } catch (e) {
      throw `Prisma Instantiation Error: Prisma failed to instantiate. Error: ${e}`;
    }
  }
  return PRISMA_CLIENT;
}
