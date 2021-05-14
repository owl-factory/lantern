import { Button, Page } from "components";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { getSession, requireClientLogin } from "utilities/auth";
import { getClient } from "utilities/db";
import { ExprArg, query as q } from "faunadb";
import { rest } from "utilities";

/**
 * Renders a single campaign and the information inside
 * @param props 
 */
export default function CampaignView(props: any): JSX.Element {
  if (!props.campaign) { return <Page error={props.error}>Error</Page>; }
  const [ campaign, setCampaign ] = React.useState(props.campaign);
  const [ ref, setRef ] = React.useState();
  const router = useRouter();
  const client = getClient();

  function createInviteLink() {
    const inviteKey = "testAddress";
    client.query(
      q.Call(
        `create_campaign_invite`,
        [ props.campaign.id, inviteKey ]
      )
    ).then((res) => {
      console.log("tmp")
    });
  }

  function frontEndTest1() {
    client.query(q.Map(
      new Array(50),
      q.Lambda("x", q.Get(q.Ref(q.Collection("campaigns"), router.query.id as string)))))
    .then((ret: any) => {
      console.log(ret);
      setRef(ret[0].ref);
    });
  }

  function frontEndTest2() {
    client.query(q.Map(
      new Array(50),
      q.Lambda("x", q.Get(ref as unknown as ExprArg))))
    .then((ret: any) => {
      console.log(ret);
    });
  }


  function Players() {
    const players: JSX.Element[] = [];
    const inviteAddress = `/campaigns/${router.query.id}/invite/${props.campaign.invitationAddress}`;
    campaign.players.forEach((player: any) => {
      players.push(
        <div key={player.id}>
          {player.name || player.username}&nbsp;
          {player.id === campaign.ownedBy.id ? "(GM) " : ""}
          <Link href={`/profile/${player.id}`}>Profile</Link>
        </div>
      );
    });
    return (
      <>
        <h2>Players</h2>
        {players}
        Invite By Link? {props.campaign.allowLinkInvitation ? "Enabled" : "Disabled"}<br/>
        <Button className="btn-sm" type="button" onClick={frontEndTest1}>
          Create Invite
        </Button><br/>
        <Button className="btn-sm" type="button" onClick={frontEndTest2}>
          Create Invite 2
        </Button><br/>
        {props.campaign.allowLinkInvitation ?
          <Link href={inviteAddress}>{inviteAddress}</Link> : <></>
        }
      </>
    );
  }

  return (
    <Page error={props.error}>
      <h1>{campaign.name}</h1>
      <Players/>
    </Page>
  );
}

CampaignView.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!requireClientLogin(session, ctx)) { return {}; }

  const res = await rest.get(`/api/campaigns/${ctx.query.id}`);
  
  return { session, campaign: (res.data as any).campaign, error: res.message };
};
