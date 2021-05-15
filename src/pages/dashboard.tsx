import { Page } from "components";
import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";
import { CampaignDocument } from "types";
import { getSession, signOut } from "utilities/auth";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import { rest } from "utilities";

interface DashboardProps {
  session?: any;
}

const Dashboard: NextPage<DashboardProps> = (props: any) => {
  return (
    <Page error={props.error}>
      <h3>Welcome back {props.session?.user.username}!</h3>

      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}
      <RecentGames campaigns={props.campaigns}/>

      {/* Characters */}
      <h4>My Characters</h4>

      <h4>Temp Profile Stuff</h4>
    </Page>
  );
};

export default Dashboard;

function RecentGames(props: any) {
  const campaigns: JSX.Element[] = [];
  props.campaigns.forEach((campaign: CampaignDocument) => {
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

  const result = await rest.get(`/api/dashboard`);
  console.log(result)

  return { session, campaigns: result.data.campaigns };
};
