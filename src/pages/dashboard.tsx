import { Page } from "components";
import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";
import { CampaignModel } from "types";
import { getSession, signOut } from "utilities/auth";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import { getClient, readQuery } from "utilities/db";
import { query as q } from "faunadb";

interface DashboardProps {
  session?: any;
}

const Dashboard: NextPage<DashboardProps> = (props: any) => {
  return (
    <Page error={props.error}>
      <h3>Welcome back {props.session?.user.data.username}!</h3>

      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}
      <RecentGames campaigns={props.data.data}/>

      {/* Characters */}
      <h4>My Characters</h4>

      <h4>Temp Profile Stuff</h4>
    </Page>
  );
};



export default Dashboard;

function RecentGames(props: any) {
  const campaigns: JSX.Element[] = [];
  props.campaigns.forEach((campaign: CampaignModel) => {
    campaigns.push(
      <>
        <h5>{campaign.name}</h5>
        <Link href={`/campaigns/${campaign.id}`}>
          Visit
        </Link>
      </>
    );
  });

  return (
    <div>
      <h4>
        Recent Games
        <Link href="/campaigns/new" passHref>
          <Button className="float-end">
            Create New Game
          </Button>
        </Link>
      </h4>
      {campaigns}
    </div>
  );
}

Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!session) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    } else {
      Router.push("/");
    }
    return {};
  }

  const client = getClient(ctx);
  const { data, error } = await readQuery(client.query(
    q.Call("fetch_my_campaigns", [ 6 ])
  ));

  return { session, data, error };
};
