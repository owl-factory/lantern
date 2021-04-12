import React from "react";
import { Button, Page } from "components";
import { NextPageContext } from "next";
import { rest } from "utilities";
import Link from "next/link";


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
    )
  }

  function JoinFail() {
    return (
      <>
        This game may not exist or the code is invalid.
        <Link href="/">
          <Button type="button">Back Home</Button>
        </Link>
      </>
    );
  }

  return (
    <Page>
      { props.success ?
        <JoinSuccess/> : <JoinFail/>
      }
    </Page>
  )
}

InviteHandler.getInitialProps = async (ctx: NextPageContext) => {
  const res = await rest.patch(
    `/api/campaigns/${ctx.query.id}/invite`,
    { inviteKey: ctx.query.inviteKey }
  );

  return res;
};
