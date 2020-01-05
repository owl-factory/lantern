import { useRouter } from "next/router";
import Page from "../../../components/Page";

function Campaign() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Page>
      <h1>Editing a campaign with id { id } </h1>
    </Page>
  );
}

export default Campaign;
