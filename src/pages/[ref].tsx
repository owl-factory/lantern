import { Page } from "components/design";
import { NextPageContext } from "next";
import React from "react";
import { Collection, query as q } from "faunadb";
import { decode, isEncoding } from "@owl-factory/utilities/ref";
import { getServerClient } from "@owl-factory/database/client/fauna";

interface RefTestProps {
  res: any;
  error?: any;
}

/**
 * Renders a single campaign and the information inside
 * @param props
 */
export default function RefTest(props: RefTestProps): JSX.Element {
  const json = JSON.stringify(props.res);

  return (
    <Page error={props.error}>
      <p>{json}</p>
    </Page>
  );
}

RefTest.getInitialProps = async (ctx: NextPageContext) => {
  const ref = ctx.query.ref+"";
  if (!ref || !isEncoding(ref)) {
    return { error: 404 };
  }
  const client = getServerClient();
  const { id, collection } = decode(ref);
  const res = await client.query(q.Get(q.Ref(Collection(collection), id)));
  return { res };
};
