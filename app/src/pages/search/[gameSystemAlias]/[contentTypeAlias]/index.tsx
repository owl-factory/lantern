import { Content, ContentType, GameSystem } from "@reroll/model/dist/documents";
import React from "react";
import Page from "../../../../components/design/Page";
import DynamicLayout from "../../../../components/layouts/Layouts";

export default function ContentTypeSearch(props: any) {
  return (
    <Page>
      <h1>{props.contentType.name}</h1>

      {/* Search box */}
      {/* <DynamicLayout dynamicLayout=/> */}

      {/* Search results */}

      {/* Pagination */}
    </Page>
  );
}

ContentTypeSearch.getInitialProps = () => {
  const contentCount = 0;
  const contentType: ContentType = {
    name: "Spells",
    gameSystemID: "123123123123123123123123",
    layout: {
      searchForm: {

      }
    }
  };
  const initialContent: Content[] = [];
  const gameSystem: GameSystem | undefined = undefined;

  return {
    contentCount,
    initialContent,
    gameSystem,
    contentType,
  };
}