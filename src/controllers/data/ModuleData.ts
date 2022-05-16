import { DataManager } from "@owl-factory/data/DataManager";
import { Ref64 } from "@owl-factory/types";
import { Collection } from "fauna";
import { ModuleDocument } from "types/documents";
import { requireLogin, requirePermission } from "utilities/validation/account";
import { validateNewModule, validateUpdatedModule } from "utilities/validation/module";
import { RulesetData } from "./RulesetData";


class ModuleDataManager extends DataManager<Partial<ModuleDocument>> {
  public collection = Collection.Files;

  constructor() {
    super("/api/modules");
  }

  public async create(doc: Partial<ModuleDocument>): Promise<Partial<ModuleDocument>> {
    delete doc.ref;

    requireLogin();
    requirePermission("createModule");
    validateNewModule(doc);

    const ruleset = RulesetData.get((doc.ruleset as { ref: Ref64 }).ref);
    (doc.ruleset as any).name = ruleset?.name as string;

    const packets = await super.$create(doc);
    if (packets.length === 0) { throw `An unexpected error occured when creating the module ${doc.name}`; }
    else if (!packets[0].success) { throw packets[0].messages; }
    return packets[0].doc as Partial<ModuleDocument>;
  }

  public async update(doc: Partial<ModuleDocument>): Promise<Partial<ModuleDocument>> {
    requireLogin();
    requirePermission("updateModule");
    validateUpdatedModule(doc);

    const packets = await super.$update(doc);
    if (packets.length === 0) { throw `An unexpected error occured when updating the module ${doc.name}`; }
    else if (!packets[0].success) { throw packets[0].messages; }
    return packets[0].doc as Partial<ModuleDocument>;
  }
}

export const ModuleData = new ModuleDataManager();
