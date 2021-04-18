import { Button, Page } from "components";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { UserProfileDoc } from "types";
import { rest } from "utilities";
import { getSession, requireClientLogin } from "utilities/auth";
import { getClient, getID, readQuery } from "utilities/db";
import { query as q } from "faunadb";

/**
 * Renders a single campaign and the information inside
 * @param props 
 */
export default function CampaignView(props: any) {
  console.log(props)
  if (!props.campaign) { return <Page error={props.error}>Error</Page>; }
  const [ campaign, setCampaign ] = React.useState(props.campaign.data);
  const router = useRouter();
  const client = getClient();

  console.log(props)

  function createInviteLink() {
    const inviteKey = "testAddress";
    client.query(
      q.Call(
        `create_campaign_invite`,
        [ getID(props.campaign.ref), inviteKey ]
      )
    ).then((res) => {
      console.log(res)
    });
  }


  function Players() {
    const players: JSX.Element[] = [];
    const inviteAddress = `/campaigns/${router.query.id}/invite/${props.campaign.invitationAddress}`;
    campaign.players.forEach((player: any) => {
      players.push(
        <div key={getID(player.ref)}>
          {player.data.name || player.data.username}&nbsp;
          {getID(player.ref) === getID(campaign.ownedBy) ? "(GM) " : ""}
          <Link href={`/profile/${getID(player.ref)}`}>Profile</Link>
        </div>
      );
    });
    return (
      <>
        <h2>Players</h2>
        {players}
        Invite By Link? {props.campaign.allowLinkInvitation ? "Enabled" : "Disabled"}<br/>
        <Button className="btn-sm" type="button" onClick={createInviteLink}>
          Create Invite
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
  const client = getClient(ctx);
  const { data, error } = await readQuery(client.query(
    q.Call(
      `view_campaign_page`,
      [ctx.query.id as string]
    )
  ));
  return { session, campaign: data, error };
};
