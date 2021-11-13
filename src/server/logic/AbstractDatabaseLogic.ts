import { Ref64 } from "src/database/fauna";

export enum Collection {
  Campaign = "campaigns",
  User = "user"
}

export abstract class DatabaseLogic<T> {
  public abstract collection: Collection

  public abstract createOne?(doc: Partial<T>): Promise<T>;
  public abstract deleteOne?(id: Ref64): Promise<T>;
  public abstract findByID?(id: Ref64): Promise<T>;
  public abstract findManyByIDs?(ids: Ref64[]): Promise<T[]>;
  public abstract updateOne?(id: Ref64, doc: Partial<T>): Promise<T>;
  public abstract search?(): Promise<Partial<T>>

}
