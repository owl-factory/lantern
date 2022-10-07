import React from "react";
import { Page } from "components/design";
import { StorageTypeEnum } from "types/enums/storageType";
import { FileList, ListFormat, StorageUsage, UploadAssetModal } from "components/pages/library";
import { Button, useDisclosure } from "@chakra-ui/react";

const maxAllowedStorage = 250 * 1024 * 1024;
const usage = [
  { bytes: 15 * 1024 * 1024, storageType: StorageTypeEnum.Images },
  { bytes: 2500000, storageType: StorageTypeEnum.MusicTracks },
  { bytes: 10 * 1024 * 1024, storageType: StorageTypeEnum.AudioClips },
];

/**
 * Renders the library of all user data
 * @param success Boolean
 * @param message Failure message, if any.
 * @param data Contains the data.
 */
function LibraryPage(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Page>
      <h1>Library</h1>
      <Button onClick={onOpen}>Add +</Button>
      <StorageUsage maxAllowedStorage={maxAllowedStorage} usage={usage}/>
      <FileList listFormat={ListFormat.Tiles}/>
      <UploadAssetModal isOpen={isOpen} onClose={onClose}/>
    </Page>
  );
}

export default LibraryPage;
