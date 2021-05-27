import React from "react";
import { Page } from "components/design";
import { ImageList, ListFormat, StorageUsage } from "components/reroll/library";
import { StorageTypeEnum } from "types/enums/storageType";
import { rest } from "utilities/request";
import { NextPageContext } from "next";
import { ImageManager } from "client/library/imageManager";


/**
 * Renders the liubrary of all user data
 * @param success Boolean. True if the getInitialProps was successful
 * @param message Failure message, if any.
 * @param data Contains the 
 */
export default function Library(props: any): JSX.Element {
  const maxAllowedStorage = 250 * 1024 * 1024;
  const usage = [
    { bytes: 15 * 1024 * 1024, storageType: StorageTypeEnum.Images },
    { bytes: 2500000, storageType: StorageTypeEnum.MusicTracks },
    { bytes: 10 * 1024 * 1024, storageType: StorageTypeEnum.AudioClips },
  ];
  const imageManager = new ImageManager();
  imageManager.loadImages(props.data.images);
  return (
    <Page>
      <h1>Library</h1>
      <StorageUsage maxAllowedStorage={maxAllowedStorage} usage={usage}/>
      <ImageList imageManager={imageManager} listFormat={ListFormat.Icons}/>
    </Page>
  );
}

Library.getInitialProps = async (ctx: NextPageContext) => {
  const libraryData = rest.get(`/api/library`);
  return libraryData;
};
