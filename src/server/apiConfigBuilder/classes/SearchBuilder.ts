import { Expr } from "faunadb";
import { MyUserDocument } from "types/security";
import { ApiConfigBuilder } from "../ApiConfigBuilder";
import { FunctionType } from "../types";
import { FunctionBuilder } from "./FunctionBuilder";

export class SearchBuilder extends FunctionBuilder {
  constructor(functionName: string, indexName: string, parent: ApiConfigBuilder) {
    super(functionName, FunctionType.SEARCH, parent);
    this.config.index = indexName;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.preProcessTerms((terms: (string | Expr)[], _myUser: MyUserDocument) => (terms));
    this.config.options = {};
    return this;
  }

  /**
   * Creates a FieldBuilder instance for setting the field names of the data we'll be recieving
   * @returns A FieldBuilder instance for setting the index value fields
   */
  public indexFields(fields: string[]) {
    this.config["indexFields"] = fields;

    return this;
  }

  /**
   * Sets a function to process the terms of a search before running the search.
   * @param fx A function taking terms and the current user document and pre-processing them before running a search
   * @returns Returns the current search builder
   */
  public preProcessTerms(fx: (terms: (string | Expr)[], myUser: MyUserDocument) => (string | Expr)[]) {
    this.config.preProcess = fx;
    return this;
  }
}
