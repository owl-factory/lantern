import { Page } from "components/design";
import { NextPageContext } from "next";
import React from "react";
import { Collection, query as q } from "faunadb";
import { decode } from "utilities/ref";
import { getServerClient } from "@owl-factory/database/client/fauna";
import { isEncoding } from "@owl-factory/utilities/ref";

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
  const decodedRef = decode(ref);
  if (!decodedRef) { throw "Ref failed to decode. TODO later"; }
  const res = await client.query(q.Get(q.Ref(Collection(decodedRef.collection), decodedRef.id)));
  return { res };
};
