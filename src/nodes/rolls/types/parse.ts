export enum RollArgument {
  None,
  Success,
  Failure,
  CriticalSuccess,
  CriticalFailure,
  Keep,
  Drop,
  Reroll,
}

export interface RollPart {
  value: string;
  isRoll: boolean;
}
