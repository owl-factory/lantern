import { DocumentReference } from "server/logic";
import { AnyDocument } from "types/documents";
import { FaunaLogicBuilder } from "../FaunaLogicBuilder";
import { FieldConfig, FunctionConfig, FunctionType, RoleConfig } from "server/faunaLogicBuilder/types";
import { $create, $delete, $fetch, $search, $update } from "server/faunaLogicBuilder/methods";
import { Expr } from "faunadb";
import { FaunaIndexOptions } from "types/fauna";
import { FieldBuilder } from "./FieldBuilder";
import { RoleBuilder } from "./RoleBuilder";
import { $fetchMany } from "../methods/fetchMany";
import { MyUserDocument } from "types/security";

/**
 * A configuration builder for configuring fetch, create, update, and other functions
 */
export class FunctionBuilder {
  protected config: FunctionConfig;
  protected parent: FaunaLogicBuilder;
  protected functionType: FunctionType;
  protected name: string;

  constructor(name: string, functionType: FunctionType, parent: FaunaLogicBuilder) {
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
   * Indicates the function is complete and sets the different kinds of function types.
   * @returns the original Core Logic Builder
   */
  public done(): FaunaLogicBuilder {
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
      case FunctionType.FETCH_MANY:
        func = (refs: (string | DocumentReference)[], myUser: MyUserDocument) => $fetchMany(refs, myUser, this.config);
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
  public set(name: string, config: FieldConfig | RoleConfig): FunctionBuilder {
    this.config[name] = config;
    return this;
  }

  /**
   * Initializes the field builder for set fields, which describes what fields we can set when creating or updating.
   */
  public setFields(): FieldBuilder {
    return new FieldBuilder("setFields", this);
  }

  /**
   * Initializes the field builder for fields, which describes what fields we can see when the document is returned
   */
  public fields(): FieldBuilder {
    return new FieldBuilder("fields", this);
  }

  /**
   * Sets whether or not a login is required to access this function. By default, true.
   * @param login Whether or not to require a login
   */
   public login(login = true): FunctionBuilder {
    this.config.login = login;
    return this;
  }

  /**
   * Initializes the role builder for roles, which describes who can perform the current action on the document
   */
  public roles(): RoleBuilder {
    return new RoleBuilder(this);
  }

  /**
   * Sets a function to run on a document and current user before performing a database action
   * @param fx The custom function to run on a document before performing the database action
   * @returns The current function builder
   */
  public preProcess(fx: (doc: AnyDocument, myUser: MyUserDocument) => AnyDocument): FunctionBuilder {
    this.config.preProcess = fx;
    return this;
  }

  /**
   * Sets a function to run on a document and current user after performing a database action
   * @param fx The custom function to run on a document after performing the database action
   * @returns The current function builder
   */
  public postProcess(fx: (doc: AnyDocument, myUser: MyUserDocument) => AnyDocument): FunctionBuilder {
    this.config.postProcess = fx;
    return this;
  }
}
