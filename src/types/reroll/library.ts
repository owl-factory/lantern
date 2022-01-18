import { StorageTypeEnum } from "types/enums/storageType";

/**
 * Describes a type of storage used in the library
 */
export interface StorageType {
  name: string; // The name of the Storage Type
  color: string; // The color of the Storage Type
}

// TODO - move to UserDocument where this will be stored?
export interface StorageUsageItem {
  bytes: number;
  storageType: StorageTypeEnum;
}
