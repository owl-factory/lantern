import { Controller } from "./controller";
import { GetOptions, SetOptions } from "./query";

/**
 * Defines the base Storage Controller functionality for use with dependency injection
 */
export interface StorageController extends Controller {
  get: <T = unknown>(options: GetOptions | string) => T | undefined;
  update: <T>(options: SetOptions<T>) => boolean;
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
