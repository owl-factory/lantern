import React from "react";
import { Page } from "components/design";
import { StorageUsage } from "components/reroll/library";
import { StorageTypeEnum } from "types/enums/storageType";

export default function Library(props: any): JSX.Element {
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
    </Page>
  );
}
