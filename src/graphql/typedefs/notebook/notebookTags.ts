import { gql } from "apollo-server-micro";

export const notebooktagTypeDefs = gql`
  enum NotebookTagSource {
    USER,
    CAMPAIGN
  }

  type NotebookTag {
    id: String!
    name: String!

    notebook: Notebook!

    sourceNote: Note
    referencedNotes: [Note!]!
  }

  input NotebookTagInclude {
    notebook: Boolean
    sourceNote: Boolean
    referencedNotes: Boolean
  }

  input NotebookTagWhere {
    name: String
    source: NotebookTagSource
  }

  type Query {
    notebookTags(where: NotebookTagWhere, include: NotebookTagInclude): [NotebookTag]
    notebookTag(id: String!, include: NotebookTagInclude): NotebookTag
  }
`;
