import { Create, Delete, Fetch, Update } from "@owl-factory/database/decorators/crud";
import { Access, ReadFields, RequireLogin, SetFields } from "@owl-factory/database/decorators/modifiers";
import { Collection } from "src/fauna";
import { Ref64 } from "@owl-factory/types";
import * as fauna from "@owl-factory/database/integration/fauna";
import { isOwner } from "./security";
import { UserRole } from "@owl-factory/auth/enums";

/**
 * Defines the core functionality that can remain consistent between different implementations of the API logic
 */
export abstract class DatabaseLogic<T> {
  public abstract collection: Collection;
}


