```typescript
/* Tables - Lantern Model */

// User and Auth Model
type UserTable = {
  id: string;
  created_at: Date;
  updated_at: Date;
  username: string;
  email: string;
  groups: Group[]; // Used for group based action control
  organization: true;
  display_name?: string;
  icon_url?: string;
  organization_user_ids?: string[]; //ref UserTable - not allowed when organization is true
  friend_user_ids?: string[]; // ref UserTable - not allowed when organization is true
};

type KeyTable = {
  id: string;
  user_id: string;
  hashed_password?: string;
  created_at: Date;
  updated_at: Date;
};

type SessionTable = {
  id: string;
  user_id: string;
  active_expires: bigint;
  idle_expires: bigint;
  created_at: Date;
  updated_at: Date;
  api_key?: boolean;
};

// General Model
type DisplaySheetTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  is_dynamic: boolean;
  markup: string; // xml sheet markup
  css?: string; // user css definitions
  file_url?: string; // file contents and <link> tag file contents copied to `markup` and `css`. If url is on lanterntt domain it will attempt to lookup asset in DB
  ruleset_id?: string; // ref RulesetTable
  content_type_id?: string; // ref ContentTypeTable
};

/**
 * We need to support generic/global ContentTypes and ActorTypes for things like handouts.
 * Implemented with ether an `is_global: boolean` on Type or a special ruleset such as
 * `ruleset = { id: "00000000-0000-0000-0000-000000000000", name: "Lantern Core" }`.
 */
type RulesetTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  description: string; // Markdown
};

type ContentTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  ruleset_id?: string; // ref RulesetTable
  default_display_sheet_id: string; // ref DisplaySheetTable
  content_type_id?: string; // ref ContentTypeTable
  is_dynamic: boolean;
  data: Data & DateData;
  actor_template?: ActorTemplate;
  has_template: boolean;
  index_1?: string; // index_1-index_9 are data names
  index_2?: string;
  index_3?: string;
  index_4?: string;
  index_5?: string;
  index_6?: string;
  index_7?: string;
  index_8?: string;
  index_9?: string;
};

type ActorTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  ruleset_id?: string; // ref RulesetTable
  default_display_sheet_id: string; // ref DisplaySheetTable
  is_character: boolean;
  actor_type_id?: string; // ref ActorTypeTable
  is_dynamic: boolean;
  data: Data & DateData;
  content?: ActorContent;
};

// Note: creating actors and content with a full set of features should be possible
// with no content types, as long as `dynamic = true` and a DisplaySheet is set.
type ContentTypeTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  ruleset_id: string; // ref RulesetTable
  default_display_sheet_id: string; // ref DisplaySheetTable
  data_definitions: DataDefinition[];
  has_template: boolean;
  index_definitions?: [string, string, string, string, string, string, string, string, string]; // DataDefinition.key strings (9)
};

type ActorTypeTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  ruleset_id: string; // ref RulesetTable
  default_display_sheet_id: string; // ref DisplaySheetTable
  is_character: boolean;
  data_definitions: DataDefinition[];
  content_definitions: ActorContentDefinition[];
};

/* Primary Non-Table Types - Lantern Model */

enum Visibility {
  Public = "public",
  Private = "private",
  Friends = "friends",
  Purchasers = "purchasers",
}

enum Group {
  Admin = "admin",
  User = "user",
}

/**
 * For information on Data keys and values see "Dynamic Data Keys and Values.md".
 */
type Data = { [key: string]: string } & { name: string };

type DateData = { created_at: string; updated_at: string };

type DataDefinition = {
  key: string;
  name: string;
  type: string;
  description: string;
};

type ActorTemplate = {
  name: string;
  is_character: boolean;
  actor_type_id?: string; // ref ActorTypeTable
  is_dynamic: boolean;
  data: Data;
  content?: ActorContent;
};

type ContentInstance = {
  instance_id: string; // Unique ID for looping purposes. Used for React keys and some lookups
  content_id?: string; // ref ContentTable - exists if created from a pre-existing piece of content, undefined otherwise
  data: Data;
};

type ActorContent = {
  [key: string]: {
    content_type_id?: string; // ref ContentTypeTable - exists if actor is not dynamic and ActorContentDefinition is not dynamic
    list: ContentInstance[];
  };
};

type ActorContentDefinition = {
  key: string;
  name: string;
  content_type_id: string; // ref ContentTypeTable
  is_dynamic: boolean;
  description: string;
};

/* Example Data */

// Actor
const actor: ActorTable = {
  id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  name: "Waals O'Caera",
  created_at: new Date("2024-01-08T04:01"),
  updated_at: new Date("2024-01-09T04:01"),
  owner_user_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  visibility: Visibility.Public,
  ruleset_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  default_display_sheet_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  is_character: true,
  actor_type_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  is_dynamic: false,
  data: {
    name: "Waals O'Caera",
    created_at: "2024-01-08T04:01",
    updated_at: "2024-01-09T04:01",
    level1: "12",
    class1: "Wizard",
    subclass1: "Bladesinger",
    level2: "3",
    class2: "Fighter",
    subclass2: "Eldritch Knight",
  },
  content: {
    spells0: {
      content_type_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // Links to spells content type
      list: [
        {
          instance_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // Random UUID for react key
          content_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // Links to the OG Firebolt content in the DB
          data: {
            name: "Firebolt",
            damage: "1d8",
            damageType: "Fire",
          },
        },
      ],
    },
  },
};
```
