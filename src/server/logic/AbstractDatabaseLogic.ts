import { Ref64 } from "@owl-factory/types";
import { Collection } from "src/fauna";

/**
 * Defines the core functionality that can remain consistent between different implementations of the API logic
 */
export abstract class DatabaseLogic<T> {
  public collection!: Collection;

  
}


