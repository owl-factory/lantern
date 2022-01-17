import React from "react";
import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { NextPageContext } from "next";
import Link from "next/link";
import { query as q } from "faunadb";
import { getSession, requireClientLogin } from "@owl-factory/auth/session";
import { getClient, readQuery } from "@owl-factory/database/client/fauna";


export default function InviteHandler(props: any) {
  function JoinSuccess () {
    let message = ``;
    if (props.data.justAdded) {
      message = `You have already joined ${props.data.campaign.name}.`;
    } else {
      message = `You've joined ${props.data.campaign.name}!`;
    }

    return (
      <>
        {message}<br/>
        <Link href={`/campaigns/${props.data.campaign._id}`}>
          <Button type="button">Back to the Campaign</Button>
        </Link>
      </>
    );
  }

  function JoinFail() {
    return (
      <>
        This game may not exist or the code is invalid.<br/>
        <Link href="/">
          <Button type="button">Back Home</Button>
        </Link>
      </>
    );
  }

  return (
    <Page>
      { props.data ?
        <JoinSuccess/> : <JoinFail/>
      }
    </Page>
  );
}

InviteHandler.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!requireClientLogin(session, ctx)) { return {}; }
  const client = getClient(ctx);
  const { data, error } = await readQuery(client.query(
    q.Call(
      `join_campaign`,
      [ctx.query.id as string, ctx.query.inviteKey as string]
    )
  ));
  return { session, data, error };
};
