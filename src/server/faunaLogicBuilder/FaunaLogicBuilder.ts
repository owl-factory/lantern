import { AnyDocument } from "types/documents";
import { MyUserDocument } from "types/security";
import { FieldBuilder, FunctionBuilder, GlobalFieldBuilder, GlobalRoleBuilder,
   RoleBuilder, SearchBuilder } from "./classes";
import { FunctionConfig, FunctionType } from "./types";

/**
 * A configuration builder for building standard Fauna access functions
 */
export class FaunaLogicBuilder {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      preProcess: (doc: AnyDocument, _myUser: MyUserDocument) => (doc),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      postProcess: (doc: AnyDocument, _myUser: MyUserDocument) => (doc),
    };
    return this;
  }

  /**
   * Indicates the end of the logic building. Returns a struct containing functions for accessing fauna
   */
  public done() {
    return this;
  }

  /**
   * Exports out the configuration object
   * @returns An object composed of the functions built by the logic builder
   */
  public export() {
    return this.config;
  }

  /**
   * Manually sets a configuration field with function information
   * @param name The name of the configuration field to set
   * @param config The function configuration information
   */
  public set(name: string, config: FunctionConfig): FaunaLogicBuilder {
    this.config[name] = config;
    return this;
  }

  /**
   * Initializes the creation of a 'create' function. Returns a new function builder for create
   */
  public create(name="create"): FunctionBuilder {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.CREATE, this);
  }

  /**
   * Initializes the creation of a 'fetch' function. Returns a new function builder for fetch
   */
   public delete(name="delete"): FunctionBuilder {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.DELETE, this);
  }

  /**
   * Initializes the creation of a 'fetch' function. Returns a new function builder for fetch
   */
  public fetch(name="fetch"): FunctionBuilder {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.FETCH, this);
  }

  /**
   * Initializes the creation of a 'fetch' function. Returns a new function builder for fetch
   */
   public fetchMany(name="fetchMany"): FunctionBuilder {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.FETCH_MANY, this);
  }

  /**
   * Initializes the creation of an 'update' function. Returns a new function builder for update
   */
  public update(name="update"): FunctionBuilder {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.UPDATE, this);
  }

  /**
   * Creates a new search function builder for a given index name
   * @param name The desired name of the function
   * @param indexName The name of the index that is being searched
   * @returns A new Search Function Builder
   */
  public search(name: string, indexName: string): SearchBuilder {
    this.canSetDefaults = false;
    return new SearchBuilder(name, indexName, this);
  }

  /**
   * Checks if the default values for the Logic Builder can be set. Throws an error if they cannot
   */
  private checkIfCanSetDefault(): void {
    if (this.canSetDefaults === false) {
      throw "You can no longer set the default values. Move any default setter to the top of the configuration class";
    }
  }

  /**
   * Sets the global value for whether or not a user must be logged in to access this API resource
   * @param mustBeLoggedIn Boolean. True if the user must be logged in to access
   * @returns The current FaunaLogicBuilder
   */
  public login(mustBeLoggedIn: boolean): FaunaLogicBuilder {
    this.checkIfCanSetDefault();
    this.config.login = mustBeLoggedIn;
    return this;
  }

  /**
   * Creates a new global field builder for setting default viewable fields
   * @returns A new global field builder
   */
  public fields(): GlobalFieldBuilder {
    this.checkIfCanSetDefault();
    return new GlobalFieldBuilder("fields", this);
  }

  /**
   * Creates a new global field builder for setting what fields can be created or updated
   * @returns Returns a new global field builder
   */
  public setFields(): GlobalFieldBuilder {
    this.checkIfCanSetDefault();
    return new GlobalFieldBuilder("setFields", this);
  }

  /**
   * Creates and returns a new global role builder for setting default role access for the Fauna Logic Builder
   * @returns A new global role builder
   */
  public roles(): GlobalRoleBuilder {
    this.checkIfCanSetDefault();
    return new GlobalRoleBuilder(this);
  }

  /**
   * Sets the function to preProcess a document with the current user before making a database call
   * @param fx A function that will run before any database call
   */
  public preProcess(fx: (doc: AnyDocument, myUser: MyUserDocument) => AnyDocument) {
    this.checkIfCanSetDefault();
    this.config.preProcess = fx;
  }

  /**
   * Sets the function to postProcess a document with the current user after making a database call
   * @param fx A function that will run after any database call
   */
  public postProcess(fx: (doc: AnyDocument, myUser: MyUserDocument) => AnyDocument) {
    this.checkIfCanSetDefault();
    this.config.postProcess = fx;
  }
}

