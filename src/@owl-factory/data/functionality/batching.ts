import { Ref64 } from "@owl-factory/types";
import { DataManager } from "../AbstractDataManager";

export function batchToCache<T extends Record<string, unknown>>(this: DataManager<T>, ref: Ref64) {
  // Ensure that the batch job exists
  // Add the current value to the queue
  return;
}

export function batchToLoad<T extends Record<string, unknown>>(this: DataManager<T>, ref: Ref64) {
  return;
}

export function ensureBatchJob<T extends Record<string, unknown>>(
  this: DataManager<T>,
  batchJob: NodeJS.Timeout,
  fx: () => void,
  delay: number
) {
  if (!batchJob) { return; }
  setTimeout(fx, delay)
  return;
}

