import React from "react";
import { Page } from "components/design";
import { LibraryImageList, ListFormat, StorageUsage } from "components/reroll/library";
import { StorageTypeEnum } from "types/enums/storageType";
import { rest } from "utilities/request";
import { NextPageContext } from "next";
import { getSession } from "utilities/auth";
import { observer } from "mobx-react-lite";
import { ImageDocument } from "types/documents";
import { InitialProps } from "types/client";
import { ImageManager } from "controllers/data/image";

interface LibraryProps extends InitialProps {
  images: ImageDocument[];
}

/**
 * Renders the liubrary of all user data
 * @param success Boolean. True if the getInitialProps was successful
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
    ImageManager.load();
    ImageManager.setMany(props.images || []);
  });

  return (
    <Page>
      <h1>Library</h1>
      <StorageUsage maxAllowedStorage={maxAllowedStorage} usage={usage}/>
      <LibraryImageList listFormat={ListFormat.Icons}/>
    </Page>
  );
}

interface LibraryResponse {
  images: ImageDocument[];
}

Library.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  const result = await rest.get<LibraryResponse>(`/api/library`);
  return {
    session,
    success: result.success,
    message: result.message,
    images: result.data.images,
  };
};

export default observer(Library);
