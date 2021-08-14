import {
  FieldConfig,
  FieldValue,
  FunctionConfig,
  RoleConfig,
  RoleReadable,
  UserRole,
} from "server/apiConfigBuilder/types";


/**
 * A configuration builder for configuring fields
 */
export class FieldBuilder {
  private config: FieldConfig;
  private name: string;
  private parent: FunctionConfig;

  constructor(name: string, parent: FunctionConfig) {
    this.parent = parent;
    this.name = name;
    this.config = {};
  }

  /**
   * Indicates the function is complete. Returns the original Function Builder
   */
  public done() {
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
