import { useRouter } from "next/router";
import Page from "../../components/Page";

function User() {
  const router = useRouter();
  const { gamekey } = router.query;

  return (
    <Page>
      <h1>Searching for game key { gamekey }</h1>
    </Page>
  );
}

export default User;
