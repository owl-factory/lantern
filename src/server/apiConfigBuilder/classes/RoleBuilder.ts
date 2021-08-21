import { RoleConfig, RoleReadable, RoleValue, UserRole } from "server/apiConfigBuilder/types";
import { ApiConfigBuilder } from "../ApiConfigBuilder";
import { FunctionBuilder } from "./FunctionBuilder";

/**
 * A configuration builder for configuring roles
 */
abstract class $RoleBuilder {
  private config: RoleConfig;
  protected parent: ApiConfigBuilder | FunctionBuilder;

  constructor(parent: ApiConfigBuilder | FunctionBuilder) {
    this.parent = parent;
    this.config = {};
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done(): ApiConfigBuilder | FunctionBuilder {
    // Ensures that each role has a value to reference, taking from the last defined lower role that came before it
    this.config = $RoleBuilder.align(this.config);

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

export class RoleBuilder extends $RoleBuilder {
  declare protected parent: FunctionBuilder;

  constructor(parent: FunctionBuilder) {
    super(parent);
  }

  public done(): FunctionBuilder {
    return super.done() as FunctionBuilder;
  }
}

export class GlobalRoleBuilder extends $RoleBuilder {
  declare protected parent: ApiConfigBuilder;

  constructor(parent: ApiConfigBuilder) {
    super(parent);
  }

  public done(): ApiConfigBuilder {
    return super.done() as ApiConfigBuilder;
  }
}
