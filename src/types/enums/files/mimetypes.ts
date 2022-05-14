import { FileType } from "./type";

// A list of all valid mimetypes. Enum is used since the actual values would be repeated otherwise
export enum Mimetype {
  ImageJpeg="image/jpeg",
  ImagePng="image/png",
  ImageWebp="image/webp",
}

// Maps mimetypes to their file extensions
export const mimetypeToExtensionMap = {
  [Mimetype.ImageJpeg]: "jpg",
  [Mimetype.ImagePng]: "png",
  [Mimetype.ImageWebp]: "webp",
};

// Maps mimetypes to their generic type
export const mimetypeToTypeMap = {
  [Mimetype.ImageJpeg]: FileType.Image,
  [Mimetype.ImagePng]: FileType.Image,
  [Mimetype.ImageWebp]: FileType.Image,
};

