import { Collection } from "fauna";
import { Ref64 } from "types";

/**
 * Defines the core functionality that can remain consistent between different implementations of the API logic
 */
export abstract class DatabaseLogic<T> {
  public abstract collection: Collection;

  public abstract createOne?(doc: Partial<T>): Promise<T>;
  public abstract deleteOne?(id: Ref64): Promise<T>;
  public abstract findByID?(id: Ref64): Promise<T>;
  public abstract findManyByIDs?(ids: Ref64[]): Promise<T[]>;
  public abstract updateOne?(id: Ref64, doc: Partial<T>): Promise<T>;
  public abstract search?(): Promise<Partial<T>>

}
