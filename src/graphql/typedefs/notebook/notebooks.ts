import { gql } from "apollo-server-micro";

export const notebookTypeDefs = gql`
  enum NotebookSource {
    USER,
    CAMPAIGN
  }

  type Notebook {
    id: String!
    name: String!
    source: NotebookSource!

    notebookTags: [NotebookTag!]!

    ownedBy: String
    owner: User
    createdAt: Date
    createdBy: String
    creatingUser: User
    updatedAt: Date
    updatedBy: String
    updatingUser: User
    deletedAt: Date
    deletedBy: String
    deletingUser: User
  }

  input NotebookCreateInput {
    name: String!
  }

  input NotebookMutateInput {
    name: String
  }

  input NotebookInclude {
    notes: Boolean
    notebookTags: Boolean
  }

  input NotebookWhere {
    name: String
    source: NotebookSource
  }

  type Query {
    notebooks(where: NotebookWhere, include: NotebookInclude): [Notebook]
    notebook(id: String!, include: NotebookInclude): Notebook
  }

  type Mutation {
    createNotebook(notebook: NotebookCreateInput!, include: NotebookInclude): Notebook
    mutateNotebook(id: String!, notebook: NotebookMutateInput!, include: NotebookInclude): Notebook
    deleteNotebook(id: String!, softDelete: Boolean): Boolean
  }
`;
