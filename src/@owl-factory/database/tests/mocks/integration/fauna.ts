import { createOne, deleteOne, findByID, findManyByIDs, searchByIndex, signIn, signOut, signUp, updateOne } from "@owl-factory/database/integration/fauna";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { Expr } from "faunadb";

(createOne as any).mockImplementation(async (_collection: string, doc: Record<string, unknown>) => doc);
(deleteOne as any).mockImplementation(async (id: Record<string, unknown>) => ({ ref: id }));
(findByID as any).mockImplementation(async (id: Record<string, unknown>) => ({ ref: id }));
(updateOne as any).mockImplementation(async (_id: string, doc: Record<string, unknown>) => doc);

(findManyByIDs as any).mockImplementation(async (_ids: Record<string, unknown>) => ([]));
(updateOne as any).mockImplementation(async (_id: string, doc: Record<string, unknown>) => doc);
(updateOne as any).mockImplementation(async (_id: string, doc: Record<string, unknown>) => doc);
(updateOne as any).mockImplementation(async (_id: string, doc: Record<string, unknown>) => doc);
(updateOne as any).mockImplementation(async (_id: string, doc: Record<string, unknown>) => doc);

(searchByIndex as any).mockImplementation(async (
  _index: string,
  _terms: (string | boolean | Expr)[],
  _options?: FaunaIndexOptions
) => ([]));
(signIn as any).mockImplementation(async (_index: string, _username: string, _password: string) => {
  throw "The user was not found or the password was incorrect.";
});
(signOut as any).mockImplementation(() => undefined);
(signUp as any).mockImplementation(async (_collection: string, _user: Partial<any>, _password: string) => {
  throw "User could not be created";
});
