import { useRouter } from "next/router";
import Page from "../../../../components/Page";

function Content() {
  const router = useRouter();
  const { username, id } = router.query;

  return (
    <Page>
      <h1>Viewing content with id/alias { id } for { username } </h1>
    </Page>
  );
}

export default Content;
