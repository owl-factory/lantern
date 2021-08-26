import { Page } from "components/design";
import Link from "next/link";
import React from "react";
import { CampaignDocument } from "types/documents";
import { getSession, signOut } from "utilities/auth";
import { NextPage, NextPageContext } from "next";
import { rest } from "utilities/request";
import { Button, Col, Row } from "components/style";
import { Card } from "components/style/card";

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
  if (!props.campaigns) { return null; }

  const campaigns: JSX.Element[] = [];
  props.campaigns.forEach((campaign: CampaignDocument) => {
    let src = "";
    if (campaign.banner && campaign.banner.src) { src = campaign.banner.src; }
    campaigns.push(
      <Col xs={12} md={6} lg={3}>
        <Card>
          <img src={src}/>
          <h5>{campaign.name}</h5>
          <Link href={`/campaigns/${campaign.id}`}>
            Visit
          </Link>
        </Card>
      </Col>
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
      <br/>
      <Row>
        {campaigns}
      </Row>
    </div>
  );
}

Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  const result = await rest.get(`/api/dashboard`);

  return { session, campaigns: (result as any).data.campaigns };
};
