import { useRouter } from "next/router";
import Page from "../../../components/Page";

function Search() {
  const router = useRouter();
  const { gamekey, contenttype } = router.query;

  return (
    <Page>
      <h1>Content for game {gamekey} and content type {contenttype} </h1>
    </Page>
  );
}

export default Search;
