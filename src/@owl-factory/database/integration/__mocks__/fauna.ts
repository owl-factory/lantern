import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { Expr } from "faunadb";

export const createOne = jest.fn(async (_collection: string, doc: Record<string, unknown>) => doc);
export const deleteOne = jest.fn(async (id: Record<string, unknown>) => ({ ref: id }));
export const findByID = jest.fn(async (id: Record<string, unknown>) => ({ ref: id }));
export const findManyByIDs = jest.fn(async (_ids: Record<string, unknown>) => ([]));
export const searchByIndex = jest.fn(async (
  _index: string,
  _terms: (string | boolean | Expr)[],
  _options?: FaunaIndexOptions
) => ([]));
export const updateOne = jest.fn(async (_id: string, doc: Record<string, unknown>) => doc
);
export const signIn = jest.fn(async (_index: string, _username: string, _password: string) => {
  throw "The user was not found or the password was incorrect.";
});
export const signOut = jest.fn(() => undefined);
export const signUp = jest.fn(async (_collection: string, _user: Partial<any>, _password: string) => {
  throw "User could not be created";
});
