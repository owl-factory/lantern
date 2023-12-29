import { AnnotationsMap, CreateObservableOptions, makeObservable } from "mobx";
import { Result } from "types/functional";
import { Err, Ok } from "utils/functional";

export { action, computed, makeObservable, observable } from "mobx";
export { observer } from "mobx-react-lite";

// Replicates a MobX type that isn't exported
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NoInfer<T> = [T][T extends any ? 0 : never];

type MakeObservableOptions = Omit<CreateObservableOptions, "proxy">;

/**
 * Safely attempts to make a target class observable
 * @param target - The target to observe
 * @param annotations - Annotations for what should be observed within the target
 * @param options - Any additional options
 * @returns A Result type that returns the makeObservable result on success
 */
export function safeMakeObservable<T extends object, AdditionalKeys extends PropertyKey = never>(
  target: T,
  annotations?: AnnotationsMap<T, NoInfer<AdditionalKeys>>,
  options?: MakeObservableOptions
): Result<T, string> {
  try {
    const result = makeObservable(target, annotations, options);
    return Ok(result);
  } catch (why) {
    return Err(why);
  }
}
