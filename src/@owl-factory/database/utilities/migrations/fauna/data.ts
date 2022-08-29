// This file can be replaced on post-build with the compiled data

import { RawMigration } from "@owl-factory/database/types/migrations/fauna";

export const versions: Record<string, string> = {};
export const defaultDocuments: Record<string, Record<string, unknown>> = {};
export const migrations: Record<string, RawMigration[]> = {};
