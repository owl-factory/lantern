
import { AnyDocument } from "types/documents";
import { MyUserDocument } from "types/security";
import { FieldBuilder, FunctionBuilder, SearchBuilder, RoleBuilder, GlobalFieldBuilder, GlobalRoleBuilder } from "./classes";
import { FunctionConfig, FunctionType } from "./types";

/**
 * A configuration builder for building standard Fauna access functions
 */
export class ApiConfigBuilder {
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

  public export() {
    return this.config;
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
  public create(name="create") {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.CREATE, this);
  }

  /**
   * Initializes the creation of a 'fetch' function. Returns a new function builder for fetch
   */
   public delete(name="delete") {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.DELETE, this);
  }

  /**
   * Initializes the creation of a 'fetch' function. Returns a new function builder for fetch
   */
  public fetch(name="fetch") {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.FETCH, this);
  }

  /**
   * Initializes the creation of a 'fetch' function. Returns a new function builder for fetch
   */
   public fetchMany(name="fetchMany") {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.FETCH_MANY, this);
  }

  /**
   * Initializes the creation of an 'update' function. Returns a new function builder for update
   */
  public update(name="update") {
    this.canSetDefaults = false;
    return new FunctionBuilder(name, FunctionType.UPDATE, this);
  }

  public search(name: string, indexName: string) {
    this.canSetDefaults = false;
    return new SearchBuilder(name, indexName, this);
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

  public fields(): GlobalFieldBuilder {
    this.checkIfCanSetDefault();
    return new GlobalFieldBuilder("fields", this);
  }

  public setFields(): GlobalFieldBuilder {
    this.checkIfCanSetDefault();
    return new GlobalFieldBuilder("setFields", this);
  }

  public roles(): GlobalRoleBuilder {
    this.checkIfCanSetDefault();
    return new GlobalRoleBuilder(this);
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

