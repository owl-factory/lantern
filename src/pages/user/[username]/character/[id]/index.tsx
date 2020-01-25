import { useRouter } from "next/router";
import Page from "../../../../../components/Page";

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
