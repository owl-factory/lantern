// The response returned from rolling
export interface RollResponse {
  result: number;
  rolls: RollResult[];
}

// Describes the result of a single die roll
export interface RollResult {
  result: number;
  dropped?: boolean;
  success?: boolean;
  failure?: boolean;
  criticalSuccess?: boolean;
  criticalFailure?: boolean;
}

// Describes a threshold for a die result to fit within
export interface RollThreshold {
  equalTo?: number[];
  above?: number;
  aboveEqual?: number;
  below?: number;
  belowEqual?: number;
}

// The method used for exploding dice
export enum ExplodeMethod {
  Normal, // Ordinary exploding method. Add a dice roll if above the threshold
  Compounding, // Similar to the normal method, but all exploded dice are added together
  Penetrating, // Identical to ordinary method, but with 1 subtracted from the roll
}

// The options for describing how and when to explode dice
export interface ExplodeOptions {
  method: ExplodeMethod; // The method to use for exploding
  threshold: RollThreshold; // The threshold at or above that will trigger an explosion
}

// Describes the options for dropping or keeping values
export interface DropKeepOptions {
  highest?: number; // The number of highest to keep or drop
  lowest?: number; // The number of lowest to keep or drop
}

// Describes the options for rerolling
export interface RerollOptions {
  threshold: RollThreshold; // The threshold to trigger a reroll
  once: boolean; // If only one reroll should occur
}

export interface RollOptions {
  count: number; // The number of dice to roll
  size: number; // The size of die used for the roll
  keep?: DropKeepOptions; //
  drop?: DropKeepOptions;
  explode?: ExplodeOptions; // Describes how to explode dice
  criticalSuccess?: RollThreshold; // The criteria for a critical success, if any
  criticalFailure?: RollThreshold; // The criteria for a critical failure, if any
  success?: RollThreshold; // The criteria for an ordinary success, if any
  failure?: RollThreshold; // The criteria for an ordinary failure, if any
  reroll?: RerollOptions; // Options decribing when and how often to reroll dice
}
