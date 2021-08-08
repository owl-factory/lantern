import { MyUserDocument, trimRestrictedFields } from "server/logic/CoreModelLogic";
import { AnyDocument } from "types/documents";
import { FaunaDocument, FaunaRef } from "types/fauna";
import { Expr, query as q } from "faunadb";
import { getServerClient } from "utilities/db";
import { fromFauna, toFauna, toFaunaRef } from "utilities/fauna";
import { canDelete, DocumentReference } from "server/logic";

type FunctionConfig = any;

type FieldConfig = any;
type RoleConfig = any;

type FieldValue = string[] | ((myUser: MyUserDocument, doc?: AnyDocument | AnyDocument[]) => string[]);
type RoleValue = boolean | ((myUser: MyUserDocument, doc?: AnyDocument | AnyDocument[]) => boolean);

export enum UserRole {
  GUEST = 0,
  USER,
  MOD,
  ADMIN
}

export const RoleReadable = [
  "guest",
  "user",
  "moderator",
  "admin",
];



function getRole(myUser: MyUserDocument) {
  if (!myUser.isLoggedIn) { return UserRole.GUEST; }
  let highestRole = UserRole.USER;
  myUser.roles.forEach((role: string) => {
    RoleReadable.forEach((readableRole: string, index: number) => {
      if (role.toLowerCase() === readableRole && index > highestRole) {
        highestRole = index;
      }
    });
  });
  return highestRole;
}

/**
 * Determines if a role is able to act on a document without attempting to read the document first. If the role config
 * is a boolean, return that boolean. If it is a function, return true to fetch and check in the non-static function. 
 * For example, a guest trying to write a campaign will fail as they will never have permissions to do that
 * 
 * @param myUser The document of the user attempting to fetch the data
 * @param roleConfig The role configuration for determining if the user is able to access something
 */
function canActStatic(myUser: MyUserDocument, roleConfig: RoleConfig) {
  // TODO - Check if role is not present in myUser?
  if (typeof roleConfig[myUser.role] === "boolean") { return roleConfig[myUser.role]; }
  return true;
}

/**
 * Takes in a list of documents and determines if the user can act on them. Those that can are returned in a new, 
 *  seperate list.
 * @param docs A list of documents to check if the user has individual access to perform an action on them
 * @param myUser The user attempting to perform an action on the documents
 * @param roleConfig The Role Configuration describing who 
 */
function canActOn(docs: AnyDocument[], myUser: MyUserDocument, roleConfig: RoleConfig): AnyDocument[] {
  const approvedDocs: AnyDocument[] = [];
  docs.forEach((doc: AnyDocument) => {
    if (canAct(doc, myUser, roleConfig)) { approvedDocs.push(doc); }
  });
  return approvedDocs;
}

/**
 * Determines if the current user can act upon the given document as defined by the role configuration
 * @param doc The document to validate actions upon
 * @param myUser The current user attempting to act on the document
 * @param roleConfig The Role Configuation that determines the rules of action
 */
function canAct(doc: AnyDocument | null, myUser: MyUserDocument, roleConfig: RoleConfig) {
  if (doc === null) { return false; }

  const roleCheck = roleConfig[myUser.role];

  if (typeof roleCheck === "boolean") { return roleCheck; }
  return roleCheck(doc);
}

/**
 * Applies standard creation changes to a document
 * @param doc The document to apply standard pre-creation actions upon
 * @param myUser The current user creating the document
 * @returns The updated document for creation
 */
function preCreate(doc: AnyDocument, myUser: MyUserDocument) {
  doc.createdAt = new Date();
  doc.updatedAt = doc.createdAt;
  doc.createdBy = { id: myUser.id, collection: myUser.collection };
  doc.updatedBy = doc.createdBy;
  doc.ownedBy = doc.createdBy;

  return doc;
}

/**
 * Applies standard update changes to a document
 * @param doc The document to apply pre-update changes to
 * @param myUser The current user that is updating the document
 * @returns An updated document ready to be updated
 */
function preUpdate(doc: AnyDocument, myUser: MyUserDocument) {
  doc.updatedAt = new Date();
  doc.updatedBy = { id: myUser.id, collection: myUser.collection };

  delete doc.id;
  delete doc.collection;
  delete doc.ref;

  return doc;
}

/**
 * Creates a document in the configured collection
 * @param doc The given document to create
 * @param myUser The user attempting to create a document
 * @param config The function configuration describing the function rules
 * @returns The created document
 */
async function $create(doc: AnyDocument, myUser: MyUserDocument, config: FunctionConfig): Promise<AnyDocument> {
  const client = getServerClient();

  // Static checks that can exit out before anything is done
  if (config.login && !myUser.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to create this resource."};
  }
  if (!canActStatic(myUser, config.roles)) { throw {code: 401, message: "You cannot create this resource"}; }

  // Runs all pre-processing of the document before creating it
  doc = config.preprocess(doc);
  doc = trimRestrictedFields(doc as Record<string, unknown>, config.setFields[getRole(myUser)]);
  doc = preCreate(doc, myUser);

  const faunaDoc: FaunaDocument<unknown> = toFauna(doc);
  const faunaResult = await client.query(q.Create(config.collection, faunaDoc)) as Record<string, unknown>;

  // TODO - how are errors thrown from fauna
  let result = fromFauna(faunaResult);
  result = config.postprocess(result);
  result = trimRestrictedFields(result as Record<string, unknown>, config.fields[getRole(myUser)]);

  return result;
}

/**
 * Deletes a single document from the database
 * @param ref The reference or ID of the document to delete
 * @param myUser The current user attempting to delete a document
 * @param config The delete function configuration
 */
async function $delete(ref: string | DocumentReference, myUser: MyUserDocument, config: FunctionConfig) {
  const client = getServerClient();
  const newRef = toFaunaRef(ref, config.collection);

  // Static checks that can exit out before anything is done
  if (config.login && !myUser.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to delete this resource." };
  }
  if (!canActStatic(myUser, config.roles)) {
    throw { code: 401, message: "You do not have access to delete this resource."};
  }

  // Fetches the document to ensure that it can be deleted by the current user
  let faunaDoc: FaunaDocument<unknown> | null = await client.query(q.Get(newRef));
  if (faunaDoc) { faunaDoc = fromFauna(faunaDoc as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  if (faunaDoc === null || !canAct(faunaDoc, myUser, config.roles)) {
    throw { code: 404, message: "The requested resource was not found or you do not have permission to delete it." };
  }

  const preProcessResult = config.preProcess(faunaDoc, myUser);
  let result: FaunaDocument<unknown> | null = await client.query(q.Delete(newRef));
  if (result) { result = fromFauna(result as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  // This should never be hit but is here for safety
  if (result === null) {
    throw { code: 404, message: "The requested resource was not found." };
  }

  // Runs post processing on the receieved result
  result = config.postProcess(result, myUser);
  result = trimRestrictedFields(result as Record<string, unknown>, config.fields[getRole(myUser)]);

  return { result, preProcessResult };
}

/**
 * A standard function that fetches a single document by ID from the database
 * @param ref A reference, either a qualified fauna reference or a string, indicating the document to fetch
 * @param myUser The current user attempting to fetch the document
 * @param config The fetch function configuration
 */
async function $fetch(ref: string | DocumentReference, myUser: MyUserDocument, config: FunctionConfig) {
  const client = getServerClient();

  // Static checks that can exit out before anything is done
  const newRef = toFaunaRef(ref, config.collection );
  if (config.login && !myUser.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to access this resource."};
  }
  if (!canActStatic(myUser, config.roles)) { throw {code: 401, message: "You do not have access to this resource."}; }

  // Fetches and converts the query into something readable
  let result: FaunaDocument<unknown> | null = await client.query(q.Get(newRef));
  if (result) { result = fromFauna(result as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  if (result === null || !canAct(result, myUser, config.roles)) {
    throw { code: 404, message: "The requested resource was not found." };
  }

  // Runs post processing on the receieved result
  result = config.postProcess(result, myUser);
  result = trimRestrictedFields(result as Record<string, unknown>, config.fields[getRole(myUser)]);

  return result;
}

/**
 * Deletes a single document from the database
 * @param ref The reference or ID of the document to delete
 * @param myUser The current user attempting to delete a document
 * @param config The delete function configuration
 */
 async function $update(
  ref: string | DocumentReference,
  doc: AnyDocument,
  myUser: MyUserDocument,
  config: FunctionConfig
) {
  const client = getServerClient();
  const newRef = toFaunaRef(ref, config.collection);

  // Static checks that can exit out before anything is done
  if (config.login && !myUser.isLoggedIn) {
    throw { code: 401, message: "You must be logged in to update this resource." };
  }
  if (!canActStatic(myUser, config.roles)) {
    throw { code: 401, message: "You do not have access to update this resource."};
  }

  // Fetches the document to ensure that it can be deleted by the current user
  let faunaDoc: FaunaDocument<unknown> | null = await client.query(q.Get(newRef));
  if (faunaDoc) { faunaDoc = fromFauna(faunaDoc as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  if (faunaDoc === null || !canAct(faunaDoc, myUser, config.roles)) {
    throw { code: 404, message: "The requested resource was not found or you do not have permission to update it." };
  }

  // Preprocesses, setting certain fields and doing any required steps before updating
  doc = config.preProcess(doc, myUser);
  doc = preUpdate(doc, myUser);

  let result: FaunaDocument<unknown> | null = await client.query(q.Update(newRef, doc));
  if (result) { result = fromFauna(result as Record<string, unknown>); }

  // Validates that we recieved the result and that the user can act/view it
  // This should never be hit but is here for safety
  if (result === null) {
    throw { code: 404, message: "The requested resource was not found." };
  }

  // Runs post processing on the receieved result
  result = config.postProcess(result, myUser);
  result = trimRestrictedFields(result as Record<string, unknown>, config.fields[getRole(myUser)]);

  return { result  };
}


/**
 * A configuration builder for building standard Fauna access functions
 */
export class CoreLogicBuilder {
  public collection: string;
  public config: any;
  private canSetDefaults = true;

  constructor(collection: string) {
    this.collection = collection;
    this.config = {
      login: true,
      roles: RoleBuilder.default(),
      fields: FieldBuilder.default(),
      setFields: FieldBuilder.default(),
      preProcess: (doc: AnyDocument, myUser: MyUserDocument) => (doc),
      postProcess: (doc: AnyDocument, myUser: MyUserDocument) => (doc),
    };
    return this;
  }

  /**
   * Indicates the end of the logic building. Returns a struct containing functions for accessing fauna
   */
  public done() {
    const config: any = { $collection: this.config.$collection };
    config.create = (
      doc: AnyDocument, myUser: MyUserDocument
    ) => $create(doc, myUser, this.config["create"]);

    config.delete = (
      ref: string | DocumentReference, myUser: MyUserDocument
    ) => $delete(ref, myUser, this.config["delete"]);

    config.fetch = (
      ref: string | DocumentReference, myUser: MyUserDocument
    ) => $fetch(ref, myUser, this.config["fetch"]);

    config.update = (
      ref: string | DocumentReference, doc: AnyDocument, myUser: MyUserDocument
    ) => $update(ref, doc, myUser, this.config["update"]);

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
    this.canSetDefaults = false;
    return new FunctionBuilder("create", this);
  }

  /**
   * Initializes the creation of a 'fetch' function. Returns a new function builder for fetch
   */
   public delete() {
    this.canSetDefaults = false;
    return new FunctionBuilder("delete", this);
  }

  /**
   * Initializes the creation of a 'fetch' function. Returns a new function builder for fetch
   */
  public fetch() {
    this.canSetDefaults = false;
    return new FunctionBuilder("fetch", this);
  }

  /**
   * Initializes the creation of an 'update' function. Returns a new function builder for update
   */
  public update() {
    this.canSetDefaults = false;
    return new FunctionBuilder("update", this);
  }

  private checkIfCanSetDefault() {
    if (this.canSetDefaults === false) {
      throw "You can no longer set the default values. Move any default setter to the top of the configuration class";
    }
  }

  public login(canLogin: boolean) {
    this.checkIfCanSetDefault();
    this.config.login = canLogin;
    return this;
  }

  public fields() {
    this.checkIfCanSetDefault();
    return new FieldBuilder("fields", this);
  }

  public setFields() {
    this.checkIfCanSetDefault();
    return new FieldBuilder("setFields", this);
  }

  public roles() {
    this.checkIfCanSetDefault();
    return new RoleBuilder(this);
  }

  public preProcess(fx: (doc: AnyDocument, myUser: MyUserDocument) => AnyDocument) {
    this.checkIfCanSetDefault();
    this.config.preProcess = fx;
  }

  public postProcess(fx: (doc: AnyDocument, myUser: MyUserDocument) => AnyDocument) {
    this.checkIfCanSetDefault();
    this.config.postProcess = fx;
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
      fields: this.parent.config.fields,
      setFields: this.parent.config.setFields,
      login: this.parent.config.login,
      roles: this.parent.config.roles,
      preProcess: this.parent.config.preProcess,
      postProcess: this.parent.config.postProcess,
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

  public preProcess(fx: (doc: AnyDocument, myUser: MyUserDocument) => AnyDocument) {
    this.config.preProcess = fx;
  }

  public postProcess(fx: (doc: AnyDocument, myUser: MyUserDocument) => AnyDocument) {
    this.config.postProcess = fx;
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

  public admin(value: FieldValue) { this.config[UserRole.ADMIN] = value; return this; }
  public guest(value: FieldValue) { this.config[UserRole.GUEST] = value; return this; }
  public moderator(value: FieldValue) { this.config[UserRole.MOD] = value; return this; }
  public user(value: FieldValue) { this.config[UserRole.USER] = value; return this; }
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

  public admin(value: RoleValue) { this.config[UserRole.ADMIN] = value; return this; }
  public guest(value: RoleValue) { this.config[UserRole.GUEST] = value; return this; }
  public moderator(value: RoleValue) { this.config[UserRole.MOD] = value; return this; }
  public user(value: RoleValue) { this.config[UserRole.USER] = value; return this; }
}
