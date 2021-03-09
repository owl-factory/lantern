import Adapters from "next-auth/adapters"

export class User extends Adapters.TypeORM.Models.User.model {
  constructor(name, email, image, emailVerified, roles) {
    super(name, email, image, emailVerified)
    this.roles = roles;
  }
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    roles: {
      type: "varchar",
      nullable: true
    },
  },
}
