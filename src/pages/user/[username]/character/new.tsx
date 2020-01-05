import { useRouter } from "next/router";
import Page from "../../../../components/Page";

function NewCharacter() {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Page>
      <h1>Creating a new character for { username } </h1>
    </Page>
  );
}

export default NewCharacter;
