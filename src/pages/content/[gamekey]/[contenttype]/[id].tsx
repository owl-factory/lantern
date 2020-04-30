import { useRouter } from "next/router";
import React from "react";
import Page from "../../../../components/Page";

function OfficialContent() {
  const router = useRouter();
  const { gamekey, id } = router.query;

  return (
    <Page>
      <h1>Official content with alias { id } for game { gamekey }</h1>
    </Page>
  );
}

export default OfficialContent;
