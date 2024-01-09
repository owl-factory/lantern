/* Lantern Schema */
enum Visibility {
  Public = "public",
  Private = "private",
  Friends = "friends",
  Purchasers = "purchasers",
}

type DataDefinition = {
  name: string;
  type: string;
  description: string;
};

type Data = Record<string, string> & { name: string; created_at: string; updated_at: string };

type RulesetTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
};

type ContentTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  ruleset_id: string; // ref RulesetTable
  content_type_id?: string; // ref ContentTypeTable
  is_dynamic: boolean;
  data: Data;
  index_1?: string;
  index_2?: string;
  index_3?: string;
  index_4?: string;
  index_5?: string;
  index_6?: string;
  index_7?: string;
  index_8?: string;
  index_9?: string;
};

type ContentTypeTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  ruleset_id: string; // ref RulesetTable
  data_definitions: DataDefinition[];
  index_definitions?: [string, string, string, string, string, string, string, string, string]; // DataDefinition.name strings (9)
};

type ContentInstance = {
  instance_id: string; // Unique ID for looping purposes. Used for React keys and some lookups
  content_id?: string; // ref ContentTable - exists if created from a pre-existing piece of content, undefined otherwise
  data: Data;
};

type ActorContent = Record<
  string,
  {
    content_type_id?: string; // ref ContentTypeTable - exists if actor is not dynamic and ActorContentDefinition is not dynamic
    list: ContentInstance[];
  }
>;

type ActorContentDefinition = {
  name: string;
  content_type_id: string; // ref ContentTypeTable
  is_dynamic: boolean;
  description: string;
};

type ActorTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  ruleset_id: string; // ref RulesetTable
  is_character: boolean;
  actor_type_id?: string; // ref ActorTypeTable
  is_dynamic: boolean;
  data: Data;
  content?: ActorContent;
};

type ActorTypeTable = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  owner_user_id: string; // ref UserTable
  visibility: Visibility;
  ruleset_id: string; // ref RulesetTable
  is_character: boolean;
  data_definitions: DataDefinition[];
  content_definitions: ActorContentDefinition[];
};

/* Actor Schema */
const actor: ActorTable = {
  id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  name: "Waals O'Caera",
  created_at: new Date("2024-01-08T04:01"),
  updated_at: new Date("2024-01-09T04:01"),
  owner_user_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  visibility: Visibility.Public,
  ruleset_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
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
            created_at: "2024-01-08T04:01",
            updated_at: "2024-01-09T04:01",
            name: "Firebolt",
            damage: "1d8",
            damageType: "Fire",
          },
        },
      ],
    },
  },
};
