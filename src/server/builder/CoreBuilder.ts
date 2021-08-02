import { MyUserDocument, trimRestrictedFields } from "server/logic/CoreModelLogic";
import { AnyDocument } from "types/documents";
import { FaunaDocument, FaunaRef } from "types/fauna";
import { Expr, query as q } from "faunadb";
import { getServerClient } from "utilities/db";
import { fromFauna, toFaunaRef } from "utilities/fauna";

type FunctionConfig = any;

type FieldConfig = any;
type RoleConfig = any;

type FieldValue = string[] | ((myUser: MyUserDocument, doc?: AnyDocument | AnyDocument[]) => string[]);
type RoleValue = boolean | ((myUser: MyUserDocument, doc?: AnyDocument | AnyDocument[]) => boolean);

enum Roles {
  GUEST = 0,
  USER,
  MOD,
  ADMIN
}

const RoleReadable = [
  "guest",
  "user",
  "moderator",
  "admin",
];

function getHighestRole(roles: string[]): number {
  let highest = 0;
  roles.forEach((role: string) => {
    RoleReadable.forEach((readableRole: string, index: number) => {
      if (role.toLowerCase() === readableRole && index > highest) {
        highest = index;
      }
    });
  });
  return highest;
}

function getRole(myUser: MyUserDocument) {
  if (!myUser.isLoggedIn) { return Roles.GUEST; }
  let highestRole = Roles.USER;
  myUser.roles.forEach((role: string) => {
    RoleReadable.forEach((readableRole: string, index: number) => {
      if (role.toLowerCase() === readableRole && index > highestRole) {
        highestRole = index;
      }
    });
  });
  return highestRole;
}

function canFetch(myUser: MyUserDocument, roles: RoleConfig) {
  const role = getRole(myUser);
  if (typeof roles[role] === "boolean") { return roles[role]; }
  return true;
}

function canAct(doc: AnyDocument | AnyDocument[] | null, myUser: MyUserDocument, roles: RoleConfig) {
  if (doc === null) { return null; }

  const roleCheck = roles[getRole(myUser)];

  if (typeof roleCheck === "boolean") {
    if (roleCheck === true) {
      return doc;
    }

    // Returns nothing. Ideally, with canFetch we will never hit this
    if (Array.isArray(doc)) { return []; }
    return null;
  }

  console.log(roles)

  // Get the single document case out of the way.
  if (!Array.isArray(doc)) {
    if (roleCheck(doc)) { return doc; }
    return null;
  }

  const allowedDocs: AnyDocument[] = [];
  doc.forEach((singleDoc: AnyDocument) => {
    if (roleCheck(singleDoc)) { allowedDocs.push(singleDoc); }
  });
  return allowedDocs;
}

function toRef(ref: string | FaunaRef, collection: string) {
  try {
    let id;
    if (typeof ref === "string") { id = ref; }
    else { id = ref.id; }
    return q.Ref(q.Collection(collection), id);
  } catch {
    throw { code: 400, message: "An invalid ID was given"};
  }
}

async function $fetch(ref: string | FaunaRef, myUser: MyUserDocument, config: FunctionConfig) {
  const client = getServerClient();
  const newRef = toRef(ref, config.collection );
  if (config.login && !myUser.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to access this resource."};
  }
  if (!canFetch) { throw {code: 401, message: "You do not have access to this resource."}; }
  let result: FaunaDocument<unknown> | null = await client.query(q.Get(newRef));
  if (result) { result = fromFauna(result as Record<string, unknown>); }
  result = canAct(result, myUser, config.roles) as AnyDocument | null;
  if (result === null) { throw { code: 404, message: "The requested resource was not found." }; }
  console.log(config.fields)
  result = trimRestrictedFields(result as Record<string, unknown>, config.fields[getRole(myUser)]);

  return result;
}

/**
 * A configuration builder for building standard Fauna access functions
 */
export class CoreLogicBuilder {
  public collection: string;
  private config: any = {};

  constructor(collection: string) {
    this.collection = collection;
    return this;
  }

  /**
   * Indicates the end of the logic building. Returns a struct containing functions for accessing fauna
   */
  public done() {
    const config: any = { $collection: this.config.$collection };
    config.fetch = (ref: string | FaunaRef, myUser: MyUserDocument) => $fetch(ref, myUser, this.config["fetch"]);
    return config;
  }

  /**
   * Manually sets a configuration field with function information
   * @param name The name of the configuration field to set
   * @param config The function configuration information
   */
  public set(name: string, config: FunctionConfig) {
    this.config[name] = config;
    return this;
  }

  /**
   * Initializes the creation of a 'create' function. Returns a new function builder for create
   */
  public create() {
    return new FunctionBuilder("create", this);
  }

  /**
   * Initializes the creation of a 'fetch' function. Returns a new function builder for fetch
   */
  public fetch() {
    return new FunctionBuilder("fetch", this);
  }
}

/**
 * A configuration builder for configuring fetch, create, update, and other functions
 */
class FunctionBuilder {
  private config: FunctionConfig;
  private parent: CoreLogicBuilder;
  private name: string;
  constructor(name: string, parent: CoreLogicBuilder) {
    this.name = name;
    this.parent = parent;

    this.config = {
      collection: parent.collection,
      fields: FieldBuilder.default(),
      setFields: FieldBuilder.default(),
      login: true,
      roles: RoleBuilder.default(),
    };

    return this;
  }

  /**
   * Indicates the function is complete. Returns the original Core Logic Builder
   */
  public done() {
    this.parent.set(this.name, this.config);
    return this.parent;
  }

  /**
   * Manually sets a configuration field for a function
   * @param name The name of the field to set
   * @param config The configuration to save for this subcomfiguration of the function
   */
  public set(name: string, config: FieldConfig | RoleConfig) {
    this.config[name] = config;
    return this;
  }

  /**
   * Initializes the field builder for set fields, which describes what fields we can set when creating or updating.
   */
  public setFields() {
    return new FieldBuilder("setFields", this);
  }

  /**
   * Initializes the field builder for fields, which describes what fields we can see when the document is returned
   */
  public fields() {
    return new FieldBuilder("fields", this);
  }

  /**
   * Sets whether or not a login is required to access this function. By default, true.
   * @param login Whether or not to require a login
   */
   public login(login = true) {
    this.config.login = login;
    return this;
  }

  /**
   * Initializes the role builder for roles, which describes who can perform the current action on the document
   */
  public roles() {
    return new RoleBuilder(this);
  }
}


/**
 * A configuration builder for configuring fields
 */
class FieldBuilder {
  private config: FieldConfig;
  private name: string;
  private parent: FunctionConfig;

  constructor(name: string, parent: FunctionConfig) {
    this.parent = parent;
    this.name = name;
    this.config = {};
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done() {
     // Ensures that each role has a value to reference, taking from the last defined lower role that came before it
     let value: FieldValue = [];
     for(let i = 0; i < RoleReadable.length; i++) {
      if (this.config[i] === undefined) {
        this.config[i] = value;
      } else {
        value = this.config[i];
      }
    }

    this.parent.set(this.name, this.config);
    return this.parent;
  }

  public static default() {
    return this.align({});
  }

  protected static align(config: RoleConfig) {
    let value: FieldValue = [];
    for(let i = 0; i < RoleReadable.length; i++) {
      if (config[i] === undefined) {
        config[i] = value;
      } else {
        // TODO - concat and find uniques
        value = config[i];
      }
    }
    return config;
  }

  public admin(value: FieldValue) { this.config[Roles.ADMIN] = value; return this; }
  public guest(value: FieldValue) { this.config[Roles.GUEST] = value; return this; }
  public moderator(value: FieldValue) { this.config[Roles.MOD] = value; return this; }
  public user(value: FieldValue) { this.config[Roles.USER] = value; return this; }
}

/**
 * A configuration builder for configuring roles
 */
class RoleBuilder {
  private config: RoleConfig;
  private parent: FunctionConfig;

  constructor(parent: FunctionConfig) {
    this.parent = parent;
    this.config = {};
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done() {
    // Ensures that each role has a value to reference, taking from the last defined lower role that came before it
    this.config = RoleBuilder.align(this.config);

    this.parent.set("roles", this.config);
    return this.parent;
  }

  public static default() {
    return this.align({});
  }

  protected static align(config: RoleConfig) {
    let value: RoleValue = false;
    for(let i = 0; i < RoleReadable.length; i++) {
      if (config[i] === undefined) {
        config[i] = value;
      } else {
        value = config[i];
      }
    }
    return config;
  }

  public admin(value: RoleValue) { this.config[Roles.ADMIN] = value; return this; }
  public guest(value: RoleValue) { this.config[Roles.GUEST] = value; return this; }
  public moderator(value: RoleValue) { this.config[Roles.MOD] = value; return this; }
  public user(value: RoleValue) { this.config[Roles.USER] = value; return this; }
}
