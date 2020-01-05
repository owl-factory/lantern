import { useRouter } from "next/router";
import Page from "../../../../../components/Page";

function EditCharacter() {
  const router = useRouter();
  const { username, id } = router.query;

  return (
    <Page>
      <h1>Editing character with id/alias { id } for { username } </h1>
    </Page>
  );
}

export default EditCharacter;
