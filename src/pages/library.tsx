import React from "react";
import { Page } from "components/design";
import { LibraryImageList, ListFormat, StorageUsage } from "components/reroll/library";
import { StorageTypeEnum } from "types/enums/storageType";
import { NextPageContext } from "next";
import { observer } from "mobx-react-lite";
import { ImageDocument } from "types/documents";
import { InitialProps } from "types/client";
import { ImageData } from "controllers/data/ImageData";
import { handleAPI } from "@owl-factory/https/apiHandler";
import { getLibraryPage } from "./api/library";

interface LibraryProps extends InitialProps {
  images: ImageDocument[];
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

  React.useEffect(() => {
    ImageData.setMany(props.images || []);
  });

  return (
    <Page>
      <h1>Library</h1>
      <StorageUsage maxAllowedStorage={maxAllowedStorage} usage={usage}/>
      <LibraryImageList listFormat={ListFormat.Icons}/>
    </Page>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  return await handleAPI(ctx, getLibraryPage);
}

export default observer(Library);
