import { importMigrations } from "@owl-factory/database/migrations/fauna";
import { isServer } from "@owl-factory/utilities/client";
import { Collection } from "fauna";

let HAS_RUN = false;
const CAN_RUN = isServer; // Whether or not the migrations can be run regardless of if they have or not
const PATH = "src/fauna/migrations/";

/**
 * Runs all migrations
 */
export function run() {
  if (HAS_RUN || !CAN_RUN) return;
  for (const collection of Object.values(Collection)) {
    importMigrations(PATH, collection);
  }
  HAS_RUN = true;
}

