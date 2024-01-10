## Actor Data Tooling

Actors can contain data not defined in their ActorType. We need tooling that can:

- Check Actor data and sort fields into three categories:
  - ActorType defined fields.
  - Sheet XML defined fields.
  - Unused fields.
- Delete unused fields.
- Create simple data migrations that can convert fieldA -> fieldB, based on either ActorType defined fields or XML defined fields.

## Lucy's New Data Model

Laura's new data model proposal can be found in [`lucys-lantern-model`](./lucys-lantern-model.ts).

## Lucy's Initial Model Idea

```typescript
export type ActorTable = {
  id: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string;
  visibility: "public" | "private" | "friends";
  actor_type_id: string; // Ref ActorTypeTable
  data: Record<string, unknown>;
  index_1: string;
  index_2: string;
  index_3: string;
  index_4: string;
  index_5: string;
  index_6: string;
};

export type TypeDefinition = {
  path: string;
  name: string;
  type: string;
  description: string;
};

export type ActorTypeTable = {
  id: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string;
  visibility: "public" | "private" | "friends";
  data_type_definitions: TypeDefinition[];
  index_definitions: [string, string, string, string, string, string]; //string is TypeDefinition path
};
```

## Laura's Initial Model Idea

Laura's initial model idea can be found in [Actor Shape Playground](./Actor%20Shape%20Playground.md#Laura%27s%20Initial%20Idea)
