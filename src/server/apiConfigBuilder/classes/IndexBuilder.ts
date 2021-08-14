import { FieldBuilder } from ".";
import { ApiConfigBuilder } from "../ApiConfigBuilder";
import { FunctionType } from "../types";
import { FunctionBuilder } from "./FunctionBuilder";

export class IndexBuilder extends FunctionBuilder {
  constructor(functionName: string, indexName: string, parent: ApiConfigBuilder) {
    super(functionName, FunctionType.SEARCH, parent);
    this.config.index = indexName;
    this.config.options = {};
    return this;
  }

  /**
   * Creates a FieldBuilder instance for setting the field names of the data we'll be recieving
   * @returns A FieldBuilder instance for setting the index value fields
   */
  public indexFields() {
    return new FieldBuilder("indexFields", this);
  }
}
