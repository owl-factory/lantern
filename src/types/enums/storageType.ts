import { StorageType } from "types/reroll/library";

export enum StorageTypeEnum {
  Images,
  MusicTracks,
  AudioClips,
}

export const storageTypes: Record<number, StorageType> = {};
storageTypes[StorageTypeEnum.Images] = { name: "Images", color: "cyan" };
storageTypes[StorageTypeEnum.MusicTracks] = { name: "Music Tracks", color: "green" };
storageTypes[StorageTypeEnum.AudioClips] = { name: "Audio Clips", color: "orange" };
