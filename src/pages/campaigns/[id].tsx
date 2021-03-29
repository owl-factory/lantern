import { Page } from "components";
import { NextPageContext } from "next";
import Link from "next/link";
import React from "react";
import { UserProfileDoc } from "types";
import { rest } from "utilities";

function Players(props: any) {
  const players: JSX.Element[] = [];
  props.players.forEach((player: UserProfileDoc) => {
    players.push(
      <div key={player._id}>
        {player.name}&nbsp;
        <Link href={`/profile/${player._id}`}>Profile</Link>
      </div>
    );
  });
  return (
    <>
      <h2>Players</h2>
      {players}
    </>
  )
}

export default function CampaignView(props: any) {
  if (!props.campaign) { return <Page>Error</Page>; }
  const players: JSX.Element[] = [];
  
  return (
    <Page>
      <h1>{props.campaign.name}</h1>
      <Players players={props.players}/>
    </Page>
  );
}

CampaignView.getInitialProps = async (ctx: NextPageContext) => {
  const res = await rest.get(`/api/pages/campaigns/${ctx.query.id}`);
  console.log(res)
  return res.data;
};
