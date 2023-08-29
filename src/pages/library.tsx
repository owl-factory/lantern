import React from "react";
import { Page } from "components/design";
import { LibraryImageList, ListFormat, StorageUsage } from "components/lantern/library";
import { StorageTypeEnum } from "types/enums/storageType";
import { observer } from "mobx-react-lite";
import { FileDocument } from "types/documents";
import { InitialProps } from "types/client";

interface LibraryProps extends InitialProps {
  images: FileDocument[];
}

/**
 * Renders the library of all user data
 * @param success Boolean
 * @param message Failure message, if any.
 * @param data Contains the data.
 */
function Library(props: LibraryProps): JSX.Element {
  const maxAllowedStorage = 250 * 1024 * 1024;
  const usage = [
    { bytes: 15 * 1024 * 1024, storageType: StorageTypeEnum.Images },
    { bytes: 2500000, storageType: StorageTypeEnum.MusicTracks },
    { bytes: 10 * 1024 * 1024, storageType: StorageTypeEnum.AudioClips },
  ];

  return (
    <Page>
      <h1>Library</h1>
      <StorageUsage maxAllowedStorage={maxAllowedStorage} usage={usage}/>
      <LibraryImageList listFormat={ListFormat.Icons}/>
    </Page>
  );
}

export default observer(Library);
