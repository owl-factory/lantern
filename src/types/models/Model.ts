import { UserModel } from "types";
import { getClient, readQuery } from "utilities/db";
import { query as q } from "faunadb";

export interface ReceievedFaunaRef {
  "@ref": FaunaRef;
}

/**
 * A standard Fauna reference object
 * TODO - can we add class helpers to this? EG id() to fetch the ID?
 */
export interface FaunaRef {
  id?: string;
  value: {
    id: string;
    collection?: FaunaRef | ReceievedFaunaRef;
  }
}

export interface DocumentModelConfig {
  collection: string;

  findByIDMethod: string;
}

export abstract class DocumentModel {
  // Core Model definition
  public id?: string;
  public ts?: number;

  public name?: string;
  public ownedBy?: UserModel;
  public createdAt?: Date;
  public createdBy?: UserModel;
  public updatedAt?: Date;
  public updatedBy?: UserModel;

  public static config: DocumentModelConfig;

  constructor(initialValues: unknown) {
    if (typeof initialValues === "string") {
      this.id = initialValues;
    }
  }

  public static async findByID(id: string) {
    console.log('test')
    const client = getClient();
    let response: object;
    // Call findByID-specific method
    if (this.config.findByIDMethod) {
      response = await readQuery(client.query(
        q.Call(
          `view_campaign_page`,
          [id as string]
        )
      ));
      console.log(response)
    } else {
      response = await readQuery(client.query(
        q.Get(
          q.Ref(q.Collection(this.config.collection), id)
        )
      ));
    }

    this.mapFauna("class", response);
  }

  protected static mapFauna(target: string, obj: FaunaDocument) {
    return obj;
  }

  /**
   * Sets data specifically from a fauna document
   * @param doc The fauna document to set
   */
  protected faunaSet(doc: FaunaDocument<CommonFaunaData>): void {
    this.softSet("id", this.getID(doc.ref as string | ReceievedFaunaRef | FaunaRef));
    this.softSet("ts", doc.ts);

    if (!doc.data) { return; }

    this.softSet("name", doc.data.name);

    this.softRefSet("ownedBy", doc.data.ownedBy);
    this.softRefSet("createdBy", doc.data.createdBy);
    this.softRefSet("updatedBy", doc.data.updatedBy);
    this.softDateTimeSet("createdAt", doc.data.createdAt);
    this.softDateTimeSet("updatedAt", doc.data.updatedAt);
  }

  public set(doc: FaunaDocument<CommonFaunaData>): void {
    this.faunaSet(doc);
  }

  /**
   * Soft sets the
   * @param key The key to store the datetime to, if any
   * @param datetime The datetime object, string, or number
   */
  public softDateTimeSet(key: (keyof DocumentModel), datetime?: FaunaTime | Date | string | number): void {
    if (datetime === undefined) { return; }

    // String or number case
    if (typeof datetime !== "object") {
      // Try and set datetime. If invalid, do not set
      try { this[key] = new Date(datetime) as never; }
      // eslint-disable-next-line no-empty
      catch {}
    }

    // Is FaunaTime?
    if ("date" in (datetime as object) && "value" in (datetime as object)) {
      this[key] = (datetime as FaunaTime).date as never;
    }

    // Assume date
    this[key] = datetime as never;
  }

  public softRefSet(key: string, ref?: string | FaunaRef | ReceievedFaunaRef): void {
    return;
  }

  public softSet(key: keyof DocumentModel, value: unknown): void {
    if (value === undefined) { return; }
    this[key] = value as never;
  }

  public getID(ref: string | FaunaRef | ReceievedFaunaRef): string | undefined {
    if ( typeof ref === "string") { return ref; }
    if ( "@ref" in ref && "id" in ref["@ref"] ) {
      return ref["@ref"].id;
    }

    if ( "id" in ref ) { return ref.id; }
    if ( "value" in ref && "id" in ref.value ) { return ref.value.id ; }
    return undefined;
  }
}

/**
 * The base, static information for all Fauna documents.
 */
export interface FaunaDocument<T> {
  ref?: FaunaRef;
  data?: T;
  ts?: number;
}

export interface FaunaTime {
  value: string;
  date?: Date;
}

/**
 * The base data strcuture that is common between all documents stored in the database
 */
export interface CommonFaunaData {
  name: string;
  ownedBy: FaunaRef;
  createdAt: FaunaTime;
  createdBy: FaunaRef;
  updatedAt: FaunaTime;
  updatedBy: FaunaRef;
}

// export class CoreDocument {

//   _doc?: unknown;

//   // The ID of the document
//   ref?: object | string;

//   // The name of the document
//   name?: string;

//   // An alias (potential pulled from the name) that can be used in the URL for reference and access
//   alias?: string;

//   // Present only if we set an owner. Will be present for most documents
//   ownedBy?: Ref<UserProfileDoc>;

//   // The id of the user who created this document
//   createdBy?: string;

//   // The date time that this document was created
//   createdAt?: Date;

//   // The id of the user who last updated this document (set on create)
//   updatedBy?: string;

//   // The date time that this document was last updated (also set on create)
//   updatedAt?: Date;

//   // May or may not be used in the event of soft-deletion
//   // TODO - Requires discussion
//   deletedBy?: string;

//   deletedAt?: Date;
// }
