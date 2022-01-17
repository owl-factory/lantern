import { StorageTypeEnum } from "types/enums/storageType";

export interface StorageType {
  name: string;
  color: string;
}

// TODO - move to UserDocument where this will be stored?
export interface StorageUsageItem {
  bytes: number;
  storageType: StorageTypeEnum;
}
