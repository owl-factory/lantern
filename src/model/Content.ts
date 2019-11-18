export interface Content {
  id?: string;
  type: ContentType;
  name: string;
  ruleset: Ruleset;
  ownerID: string;
  createdBy: string;
  createdAt: Date;
}

export enum ContentType {
  Character = 0,
  Campaign = 1,
  Proficiency = 2,
  Feature = 3,
  Action = 4,
  Classs = 5,
  Definition = 6,
}

export enum Ruleset {
  Custom = 0,
  Determinators = 1,
  DnD5e = 2,
  Pathfinder2e = 3,
  FateCore = 4,
}
