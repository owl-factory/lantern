import { useRouter } from "next/router";
import React from "react";
import Page from "../../../components/Page";

function ContentIndex() {
  const router = useRouter();
  const { gamekey } = router.query;

  return (
    <Page>
      <h1>Content for {gamekey}</h1>
    </Page>
  );
}

export default ContentIndex;
