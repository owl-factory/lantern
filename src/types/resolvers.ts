import { Query } from "mongoose";

export type FindOneResponse<T> = Promise<Query<T> | null>;
export type FindManyResponse<T> = Promise<Query<T[]>>
export type FindCountResponse = Promise<Query<number>>;
export type CreateOneResponse<T> = Query<T>;
// export type UpdateOneResponse = Query<UpdateResponse>;
// export type DeleteOneResponse = Query<DeleteResponse>;