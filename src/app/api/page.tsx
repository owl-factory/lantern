import { getApiDocs } from "lib/apiDocs";
import { ApiDocs } from "components/ApiDocs";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ApiDocs spec={spec} />
    </section>
  );
}
