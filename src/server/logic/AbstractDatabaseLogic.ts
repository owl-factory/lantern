import { Create, Delete, Fetch, Update } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields, RequireLogin, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Collection } from "src/fauna";
/**
 * Defines the core functionality that can remain consistent between different implementations of the API logic
 */
export abstract class DatabaseLogic<T> {
  public abstract collection: Collection;
}


