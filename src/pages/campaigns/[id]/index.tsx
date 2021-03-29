import { Button, Page } from "components";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { UserProfileDoc } from "types";
import { rest } from "utilities";



export default function CampaignView(props: any) {
  if (!props.campaign) { return <Page>Error</Page>; }
  const router = useRouter();

  function toggleInviteByLink() {
    rest.post(`/api/campaigns/${router.query.id}/invite`, {})
    .then(() => {
      // Super dirty way of reloading the page
      console.log("Hit")
      // location.reload();
    });
  }

  function Players() {
    const players: JSX.Element[] = [];
    const inviteAddress = `/campaigns/${router.query.id}/invite/${props.campaign.invitationAddress}`;
    props.players.forEach((player: UserProfileDoc) => {
      players.push(
        <div key={player._id}>
          {player.name}&nbsp;
          {player._id === props.campaign.ownedBy ? "(GM) " : ""}
          <Link href={`/profile/${player._id}`}>Profile</Link>
        </div>
      );
    });
    return (
      <>
        <h2>Players</h2>
        {players}
        Invite By Link? {props.campaign.allowLinkInvitation ? "Enabled" : "Disabled"}<br/>
        <Button className="btn-sm" type="button" onClick={toggleInviteByLink}>
          {!props.campaign.allowLinkInvitation ? "Enable" : "Disable"}
        </Button><br/>
        {props.campaign.allowLinkInvitation ?
          <Link href={inviteAddress}>{inviteAddress}</Link> : <></>
        }

      </>
    );
  }

  return (
    <Page>
      <h1>{props.campaign.name}</h1>
      <Players/>
    </Page>
  );
}

CampaignView.getInitialProps = async (ctx: NextPageContext) => {
  const res = await rest.get(`/api/pages/campaigns/${ctx.query.id}`);
  return res.data;
};
