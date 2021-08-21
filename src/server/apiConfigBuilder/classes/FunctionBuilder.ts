import { DocumentReference, MyUserDocument } from "server/logic";
import { AnyDocument } from "types/documents";
import { ApiConfigBuilder } from "../ApiConfigBuilder";
import { FieldConfig, FunctionConfig, FunctionType, RoleConfig } from "server/apiConfigBuilder/types";
import { $create, $delete, $fetch, $search, $update } from "server/apiConfigBuilder/methods";
import { Expr } from "faunadb";
import { FaunaIndexOptions } from "types/fauna";
import { FieldBuilder } from "./FieldBuilder";
import { RoleBuilder } from "./RoleBuilder";

/**
 * A configuration builder for configuring fetch, create, update, and other functions
 */
export class FunctionBuilder {
  protected config: FunctionConfig;
  protected parent: ApiConfigBuilder;
  protected functionType: FunctionType;
  protected name: string;

  constructor(name: string, functionType: FunctionType, parent: ApiConfigBuilder) {
    this.name = name;
    this.functionType = functionType;
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
  public done(): ApiConfigBuilder {
    let func;
    switch (this.functionType) {
      case FunctionType.CREATE:
        func = (doc: AnyDocument, myUser: MyUserDocument) => $create(doc, myUser, this.config);
        break;
      case FunctionType.DELETE:
        func = (ref: string | DocumentReference, myUser: MyUserDocument) => $delete(ref, myUser, this.config);
        break;
      case FunctionType.FETCH:
        func = (ref: string | DocumentReference, myUser: MyUserDocument) => $fetch(ref, myUser, this.config);
        break;
      case FunctionType.UPDATE:
        func = (
          ref: string | DocumentReference,
          doc: AnyDocument,
          myUser: MyUserDocument
        ) => $update(ref, doc, myUser, this.config);
        break;
      case FunctionType.SEARCH:
        func = (
          terms: (string | Expr)[],
          options: FaunaIndexOptions | undefined,
          myUser: MyUserDocument
        ) => $search(terms, options, myUser, this.config);
        break;
    }

    this.parent.set(this.name, func);
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
    return this;
  }

  public postProcess(fx: (doc: AnyDocument, myUser: MyUserDocument) => AnyDocument) {
    this.config.postProcess = fx;
    return this;
  }
}
