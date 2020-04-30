import { useRouter } from "next/router";
import React from "react";
import Page from "../../../components/Page";

function Campaign() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Page>
      <h1>Starting the campaign with id { id } </h1>
    </Page>
  );
}

export default Campaign;
