```typescript
/* Tables - Lantern Model */

// User and Auth Model
type UserTable = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  groups: Group[]; // Used for group based action control
  organization: true;
  displayName?: string;
  iconUrl?: string;
  organizationUserIds?: string[]; //ref UserTable - not allowed when organization is true
  friendUserIds?: string[]; // ref UserTable - not allowed when organization is true
};

type KeyTable = {
  id: string;
  userId: string;
  hashedPassword?: string;
  createdAt: Date;
  updatedAt: Date;
};

type SessionTable = {
  id: string;
  userId: string;
  activeExpires: bigint;
  idleExpires: bigint;
  createdAt: Date;
  updatedAt: Date;
  apiKey?: boolean;
};

// General Model
type DisplaySheetTable = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUserId: string; // ref UserTable
  visibility: Visibility;
  isDynamic: boolean;
  markup: string; // xml sheet markup
  css?: string; // user css definitions
  fileUrl?: string; // file contents and <link> tag file contents copied to `markup` and `css`. If url is on lanterntt domain it will attempt to lookup asset in DB
  rulesetId?: string; // ref RulesetTable
  contentTypeId?: string; // ref ContentTypeTable
};

/**
 * We need to support generic/global ContentTypes and ActorTypes for things like handouts.
 * Implemented with ether an `isGlobal: boolean` on Type or a special ruleset such as
 * `ruleset = { id: "00000000-0000-0000-0000-000000000000", name: "Lantern Core" }`.
 */
type RulesetTable = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUserId: string; // ref UserTable
  visibility: Visibility;
  description: string; // Markdown
};

type ContentTable = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUserId: string; // ref UserTable
  visibility: Visibility;
  rulesetId?: string; // ref RulesetTable
  defaultDisplaySheetId: string; // ref DisplaySheetTable
  contentTypeId?: string; // ref ContentTypeTable
  isDynamic: boolean;
  data: Data & DateData;
  actorTemplate?: ActorTemplate;
  hasTemplate: boolean;
  index1?: string; // index1-index9 are data names
  index2?: string;
  index3?: string;
  index4?: string;
  index5?: string;
  index6?: string;
  index7?: string;
  index8?: string;
  index9?: string;
};

type ActorTable = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUserId: string; // ref UserTable
  visibility: Visibility;
  rulesetId?: string; // ref RulesetTable
  defaultDisplaySheetId: string; // ref DisplaySheetTable
  isCharacter: boolean;
  actorTypeId?: string; // ref ActorTypeTable
  isDynamic: boolean;
  data: Data & DateData;
  content?: ActorContent;
};

// Note: creating actors and content with a full set of features should be possible
// with no content types, as long as `dynamic = true` and a DisplaySheet is set.
type ContentTypeTable = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUserId: string; // ref UserTable
  visibility: Visibility;
  rulesetId: string; // ref RulesetTable
  defaultDisplaySheetId: string; // ref DisplaySheetTable
  dataDefinitions: DataDefinition[];
  hasTemplate: boolean;
  indexDefinitions?: [string, string, string, string, string, string, string, string, string]; // DataDefinition.key strings (9)
};

type ActorTypeTable = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUserId: string; // ref UserTable
  visibility: Visibility;
  rulesetId: string; // ref RulesetTable
  defaultDisplaySheetId: string; // ref DisplaySheetTable
  isCharacter: boolean;
  dataDefinitions: DataDefinition[];
  contentDefinitions: ActorContentDefinition[];
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

type DateData = { createdAt: string; updatedAt: string };

type DataDefinition = {
  key: string;
  name: string;
  type: string;
  description: string;
};

type ActorTemplate = {
  name: string;
  isCharacter: boolean;
  actorTypeId?: string; // ref ActorTypeTable
  isDynamic: boolean;
  data: Data;
  content?: ActorContent;
};

type ContentInstance = {
  instanceId: string; // Unique ID for looping purposes. Used for React keys and some lookups
  contentId?: string; // ref ContentTable - exists if created from a pre-existing piece of content, undefined otherwise
  data: Data;
};

type ActorContent = {
  [key: string]: {
    contentTypeId?: string; // ref ContentTypeTable - exists if actor is not dynamic and ActorContentDefinition is not dynamic
    list: ContentInstance[];
  };
};

type ActorContentDefinition = {
  key: string;
  name: string;
  contentTypeId: string; // ref ContentTypeTable
  isDynamic: boolean;
  description: string;
};

/* Example Data */

// Actor
const actor: ActorTable = {
  id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  name: "Waals O'Caera",
  createdAt: new Date("2024-01-08T04:01"),
  updatedAt: new Date("2024-01-09T04:01"),
  ownerUserId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  visibility: Visibility.Public,
  rulesetId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  defaultDisplaySheetId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  isCharacter: true,
  actorTypeId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  isDynamic: false,
  data: {
    name: "Waals O'Caera",
    createdAt: "2024-01-08T04:01",
    updatedAt: "2024-01-09T04:01",
    level1: "12",
    class1: "Wizard",
    subclass1: "Bladesinger",
    level2: "3",
    class2: "Fighter",
    subclass2: "Eldritch Knight",
  },
  content: {
    spells0: {
      contentTypeId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // Links to spells content type
      list: [
        {
          instanceId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // Random UUID for react key
          contentId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // Links to the OG Firebolt content in the DB
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
