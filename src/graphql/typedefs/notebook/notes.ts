import { gql } from "apollo-server-micro";

export const noteTypeDefs = gql`
  type Note {
    id: String!
    name: String!

    notebook: Notebook!

    content: String!

    sourceTags: [NoteTag!]!
    referencedTags: [NotebooTag!]!

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

  input NoteCreateInput {
    name: String!
    notebookID: String!
    content: String
  }

  input NoteMutateInput {
    name: String
    content: String
  }

  input NoteInclude {
    notebook: Boolean
    sourceTags: Boolean
    referencedTags: Boolean
  }

  input NoteWhere {
    name: String
    source: NoteSource
  }

  type Query {
    notes(where: NoteWhere, include: NoteInclude): [Note]
    note(id: String!, include: NoteInclude): Note
  }

  type Mutation {
    createNote(note: NoteCreateInput!, include: NoteInclude): Note
    mutateNote(id: String!, note: NoteMutateInput!, include: NoteInclude): Note
    deleteNote(id: String!, softDelete: Boolean): Boolean
  }
`;
