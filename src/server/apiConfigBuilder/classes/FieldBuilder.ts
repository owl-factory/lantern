import {
  FieldConfig,
  FieldValue,
  RoleConfig,
  RoleReadable,
  UserRole,
} from "server/apiConfigBuilder/types";
import { ApiConfigBuilder } from "../ApiConfigBuilder";
import { FunctionBuilder } from "./FunctionBuilder";



/**
 * A configuration builder for configuring fields
 */
abstract class $FieldBuilder {
  private config: FieldConfig;
  private name: string;
  protected parent: ApiConfigBuilder | FunctionBuilder;

  constructor(name: string, parent: ApiConfigBuilder | FunctionBuilder) {
    this.parent = parent;
    this.name = name;
    this.config = {};
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done(): ApiConfigBuilder | FunctionBuilder {
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

export class FieldBuilder extends $FieldBuilder {
  declare protected parent: FunctionBuilder;

  constructor(name: string, parent: FunctionBuilder) {
    super(name, parent);
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done(): FunctionBuilder {
    return super.done() as FunctionBuilder;
  }
}

export class GlobalFieldBuilder extends $FieldBuilder {
  declare protected parent: ApiConfigBuilder;

  constructor(name: string, parent: ApiConfigBuilder) {
    super(name, parent);
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done(): ApiConfigBuilder {
    return super.done() as ApiConfigBuilder;
  }
}
