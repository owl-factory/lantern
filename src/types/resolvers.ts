import { Query } from "mongoose";

export type FindOneResponse<T> = Promise<Query<T, any> | null>;
export type FindManyResponse<T> = Promise<Query<T[], any>>
export type FindCountResponse = Promise<Query<number, any>>;
export type CreateOneResponse<T> = Query<T, any>;
// export type UpdateOneResponse = Query<UpdateResponse>;
// export type DeleteOneResponse = Query<DeleteResponse>;