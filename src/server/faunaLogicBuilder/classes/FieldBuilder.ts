import { FieldConfig, FieldValue, RoleConfig } from "server/faunaLogicBuilder/types";
import { UserRole, UserRoleReadable } from "types/security";
import { FaunaLogicBuilder } from "../FaunaLogicBuilder";
import { FunctionBuilder } from "./FunctionBuilder";

/**
 * A configuration builder for configuring fields
 */
abstract class $FieldBuilder {
  private config: FieldConfig;
  private name: string;
  protected parent: FaunaLogicBuilder | FunctionBuilder;

  constructor(name: string, parent: FaunaLogicBuilder | FunctionBuilder) {
    this.parent = parent;
    this.name = name;
    this.config = {};
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done(): FaunaLogicBuilder | FunctionBuilder {
     // Ensures that each role has a value to reference, taking from the last defined lower role that came before it
     let value: FieldValue = [];
     for(let i = 0; i < UserRoleReadable.length; i++) {
      if (this.config[i] === undefined) {
        this.config[i] = value;
      } else {
        value = this.config[i];
      }
    }

    this.parent.set(this.name, this.config);
    return this.parent;
  }

  /**
   * Creates and returns the default configuration for Roles
   * @returns The default configuration
   */
  public static default(): RoleConfig {
    return this.align({});
  }

  /**
   * Aligns configuration so that the different values bubble up to fill empty higher roles
   * @param config The configuration to align
   * @returns An aligned configuration
   */
  protected static align(config: RoleConfig): RoleConfig {
    let value: FieldValue = [];
    for(let i = 0; i < UserRoleReadable.length; i++) {
      if (config[i] === undefined) {
        config[i] = value;
      } else {
        // TODO - concat and find uniques
        value = config[i];
      }
    }
    return config;
  }

  /**
   * Sets the list of fields or a function that evaluate to a list of fields that determine what the
   * Admin role can access
   * @param value The list of fields or a function to determine the list of fields for the Admin role
   * @returns Returns the current FieldBuilder
   */
  public admin(value: FieldValue) { this.config[UserRole.ADMIN] = value; return this; }

  /**
   * Sets the list of fields or a function that evaluate to a list of fields that determine what the
   * Guest role can access
   * @param value The list of fields or a function to determine the list of fields for the Guest role
   * @returns Returns the current FieldBuilder
   */
  public guest(value: FieldValue) { this.config[UserRole.GUEST] = value; return this; }

  /**
   * Sets the list of fields or a function that evaluate to a list of fields that determine what the
   * Moderator role can access
   * @param value The list of fields or a function to determine the list of fields for the Moderator role
   * @returns Returns the current FieldBuilder
   */
  public moderator(value: FieldValue) { this.config[UserRole.MODERATOR] = value; return this; }

  /**
   * Sets the list of fields or a function that evaluate to a list of fields that determine what the
   * User role can access
   * @param value The list of fields or a function to determine the list of fields for the User role
   * @returns Returns the current FieldBuilder
   */
  public user(value: FieldValue) { this.config[UserRole.USER] = value; return this; }
}

/**
 * The generic field builder for building out from Function Builders
 */
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

/**
 * A global field builder for building out fields from the ApiConfigBuilder
 */
export class GlobalFieldBuilder extends $FieldBuilder {
  declare protected parent: FaunaLogicBuilder;

  constructor(name: string, parent: FaunaLogicBuilder) {
    super(name, parent);
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done(): FaunaLogicBuilder {
    return super.done() as FaunaLogicBuilder;
  }
}
