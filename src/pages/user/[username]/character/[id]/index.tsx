import { useRouter } from "next/router";
import React from "react";
import Page from "../../../../../components/Page";
import React from "react";

function Character() {
  const router = useRouter();
  const { username, id } = router.query;

  return (
    <Page>
      <h1>Viewing character with id/alias { id } for { username } </h1>
    </Page>
  );
}

export default Character;
