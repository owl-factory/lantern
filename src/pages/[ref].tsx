import { Page } from "components/design";
import { NextPageContext } from "next";
import React from "react";
import { Collection, query as q } from "faunadb";
import { decode } from "utilities/ref";
import { getServerClient } from "@owl-factory/database/client/fauna";
import { isEncoding } from "@owl-factory/utilities/ref";
import { sendRedirect } from "@owl-factory/https/apiHandler";

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

/**
 * Decodes a ref and fetches a document from Fauna
 * TODO - remove the fauna call
 */
export async function getServerSideProps(ctx: NextPageContext) {
  const ref = ctx.query.ref as string;
  if (!ref || !isEncoding(ref)) {
    return sendRedirect("/404?message=Ref failed to decode. TODO later");
  }
  const decodedRef = decode(ref);
  if (!decodedRef) { return sendRedirect("/404?message=Ref failed to decode. TODO later"); }

  const client = getServerClient();
  const res = await client.query(q.Get(q.Ref(Collection(decodedRef.collection), decodedRef.id)));
  return { props: { res } };
}
