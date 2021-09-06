import { RoleConfig, RoleValue } from "server/faunaLogicBuilder/types";
import { UserRole, UserRoleReadable } from "types/security";
import { FaunaLogicBuilder } from "../FaunaLogicBuilder";
import { FunctionBuilder } from "./FunctionBuilder";

/**
 * A configuration builder for configuring roles
 */
abstract class $RoleBuilder {
  private config: RoleConfig;
  protected parent: FaunaLogicBuilder | FunctionBuilder;

  constructor(parent: FaunaLogicBuilder | FunctionBuilder) {
    this.parent = parent;
    this.config = {};
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done(): FaunaLogicBuilder | FunctionBuilder {
    // Ensures that each role has a value to reference, taking from the last defined lower role that came before it
    this.config = $RoleBuilder.align(this.config);

    this.parent.set("roles", this.config);
    return this.parent;
  }

  /**
   * Creates and returns a default configuration.
   * @returns Returns the default configuration in the event that a RoleBuilder is not created
   */
  public static default() {
    return this.align({});
  }

  /**
   * Bubbles up role configuration up from guest to admin. The default is false; any other value will be bubbled up
   * until a different value is found, and then that value will bubble up. This prevents any role from being undefined.
   * @param config The RoleConfiguration to align
   * @returns Returns an aligned configuration
   */
  protected static align(config: RoleConfig) {
    let value: RoleValue = false;
    for(let i = 0; i < UserRoleReadable.length; i++) {
      if (config[i] === undefined) {
        config[i] = value;
      } else {
        value = config[i];
      }
    }
    return config;
  }

  /**
   * Sets the a boolean or a function that evaluate to a boolean that determines if the
   * Admin role can access this functionality what the
   * @param value The boolean or a function to evaluate into a boolean for the Admin role
   * @returns Returns the current RoleBuilder
   */
  public admin(value: RoleValue) { this.config[UserRole.ADMIN] = value; return this; }
  /**
   * Sets the a boolean or a function that evaluate to a boolean that determines if the
   * Guest role can access this functionality what the
   * @param value The boolean or a function to evaluate into a boolean for the Guest role
   * @returns Returns the current RoleBuilder
   */
  public guest(value: RoleValue) { this.config[UserRole.GUEST] = value; return this; }
  /**
   * Sets the a boolean or a function that evaluate to a boolean that determines if the
   * Moderator role can access this functionality what the
   * @param value The boolean or a function to evaluate into a boolean for the Moderator role
   * @returns Returns the current RoleBuilder
   */
  public moderator(value: RoleValue) { this.config[UserRole.MOD] = value; return this; }
  /**
   * Sets the a boolean or a function that evaluate to a boolean that determines if the
   * User role can access this functionality what the
   * @param value The boolean or a function to evaluate into a boolean for the User role
   * @returns Returns the current RoleBuilder
   */
  public user(value: RoleValue) { this.config[UserRole.USER] = value; return this; }
}

/**
 * The generic role builder for used by Function Builders
 */
export class RoleBuilder extends $RoleBuilder {
  declare protected parent: FunctionBuilder;

  constructor(parent: FunctionBuilder) {
    super(parent);
  }

  /**
   * Indicates the roles are complete. Returns the original Function Builder
   */
  public done(): FunctionBuilder {
    return super.done() as FunctionBuilder;
  }
}

/**
 * The global role builder for used by the logic builder
 */
export class GlobalRoleBuilder extends $RoleBuilder {
  declare protected parent: FaunaLogicBuilder;

  constructor(parent: FaunaLogicBuilder) {
    super(parent);
  }

  /**
   * Indicates the roles are complete. Returns the original logic builder
   */
  public done(): FaunaLogicBuilder {
    return super.done() as FaunaLogicBuilder;
  }
}
