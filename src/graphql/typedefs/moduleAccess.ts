import { gql } from "apollo-server-micro";

export const moduleAccessTypeDefs = gql`
  enum ModuleAccessValue {
    AWARE
    VIEW
    EDIT
    FULL
  }

  type ModuleAccess {
    userID: String
    user: User
    moduleID: String
    module: Module
    access: ModuleAccessValue
  }

  # Any additional documents to include within the response
  input ModuleAccessInclude {
    module: Boolean
    user: Boolean
  }

  # The where clause of the *many queries
  input ModuleAccessWhere {
    moduleID: String
    userID: String
  }

  Query {
    moduleAccess(where: ModuleAccessWhere, include: ModuleAccessInclude): [ModuleAccess]
  }
`;
