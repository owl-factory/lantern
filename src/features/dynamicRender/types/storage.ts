import { Controller } from "./controller";

/**
 * Defines the base Storage Controller functionality for use with dependency injection
 */
export interface StorageController extends Controller {
  get: <T = unknown>(options: GetOptions | string) => T | undefined;
  update: <T>(options: SetOptions<T>) => void;
}

/**
 * The different valid states for a Storage Controller
 */
export enum StorageControllerState {
  NoOp,
  Loading,
  Ready,
  MobxError,
  LocalStorageMissing,
}

/**
 * Defines the different types of storage we can use
 */
export enum StorageType {
  LocalStorage,
}

/**
 * Options used for getting a piece of data from a StorageController
 */
export type GetOptions = {
  source: "character" | "content" | "ruleset" | "sheet";
  key: string;
};

/**
 * Options used for setting a piece of data within a StorageController
 * @param T - The type of the value to set
 */
export type SetOptions<T> = GetOptions & { value: T };
