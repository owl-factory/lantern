
import * as fauna from "@owl-factory/database/integration/fauna";
import { RequireLogin } from "@owl-factory/database/decorators/modifiers";
import { Create, Fetch, Search, Update } from "@owl-factory/database/decorators/decorators";
import { Collection, FaunaIndex } from "src/fauna";
import { FaunaIndexOptions } from "@owl-factory/database/types/fauna";
import { ActorDocument } from "types/documents/Actor";
import * as access from "./access";
import { Ref64 } from "@owl-factory/types";

const collection = Collection.Actors;

class $ActorLogic {
  /**
   * Creates a single new actor document
   * @param doc The document partial to create
   * @returns The new actor document
   */
  @Create(["*"], ["*"])
  public async create(doc: Partial<ActorDocument>): Promise<ActorDocument> {
    doc.name = randomActorName();
    return await access.create(collection, doc);
  }

  /**
   * Fetches one actor from its ref
   * @param id The Ref64 ID of the document to fetch
   * @returns The actor document
   */
  @Fetch(collection, ["*"])
  @RequireLogin()
  public async fetch(ref: Ref64): Promise<ActorDocument> { return access.fetch(collection, ref); }

  /**
   * Updates a single actor
   * @param ref The Ref64 ID of the document to update
   * @param doc The actor partial to update
   * @returns The new, updated document
   */
  @Update(collection, ["*"], ["*"], (ref) => access.fetch(collection, ref))
  public async update(ref: Ref64, doc: Partial<ActorDocument>): Promise<ActorDocument> {
    return await access.update(collection, ref, doc);
  }

  /**
   * Fetches the partial actor documents
   * @param options Any additional options for filtering the data retrieved from the database
   * @returns An array of actor document partials
   */
  @Search(["*"])
  @RequireLogin()
  public async searchAllActors(options?: FaunaIndexOptions): Promise<Partial<ActorDocument>[]> {
    const actors = await fauna.searchByIndex(FaunaIndex.AllActors, [], options);
    return actors as Partial<ActorDocument>[];
  }
}

/**
 * Generates a random actor name
 * @todo Optimize in the future, move to a new file, and perhaps read from FS?
 */
function randomActorName() {
  const forenames = [
    "Waals",
    "Laent",
    "Tamwen",
    "Aria",
    "Maria",
    "Cliohna",
    "Cyri",
    "Rhiannon",
    "Olwen",
    "Ylise",
    "Cyrus",
    "Hector",
    "Elwyn",
    "Thordan",
    "Elezen",
    "Nivrahli",
    "Dave",
    "Robin",
    "Laure",
  ];

  const surnames = [
    "Brodnen",
    "O'Caera",
    "Taylor",
    "Victoria",
    "Culhainn",
    "Byrne",
    "Garneaux",
    "Lewin",
    "Urumet",
    "the Dave",
  ];

  const forename = forenames[Math.floor(Math.random() * forenames.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];

  return `${forename} ${surname}`;
}

export const ActorLogic = new $ActorLogic();
