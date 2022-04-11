import { importMigrations } from "@owl-factory/database/migrations/fauna";
import { isClient } from "@owl-factory/utilities/client";
import { Collection } from "fauna";

const path = "src/fauna/migrations/";

export let defaultDocument = {};
export let migrations: any[] = [];
export let version = "0.0.0";

function init() {
  console.log("init")
  if (isClient) { return; }
  const res = importMigrations(path, Collection.Campaigns);
  defaultDocument = res.defaultDocument;
  migrations = res.migrations;
  version = res.version;
}
init();
