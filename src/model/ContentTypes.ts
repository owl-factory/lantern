import { Content } from "./Content";

export interface IconSet {
  forwards: string;
  backwards?: string;
  right?: string;
  left?: string;
  prone?: string;
}

export interface Character extends Content {
  portrait: string;
  iconSet: IconSet;
  aliases: string[];
}

export interface Campaign extends Content {
  headerImage: string;
  players: string[];
}

export interface Proficiency extends Content { }

export interface Feature extends Content { }

export interface Action extends Content { }

export interface Class extends Content { }

export interface Definition extends Content { }
