import { useRouter } from "next/router";
import React from "react";
import Page from "../../../components/Page";

function User() {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Page>
      <h1>User with id/alias {username}</h1>
    </Page>
  );
}

export default User;
