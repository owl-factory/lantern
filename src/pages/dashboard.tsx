import { Page } from "components/design";
import Link from "next/link";
import React from "react";
import { CampaignDocument } from "types/documents";
import { NextPage, NextPageContext } from "next";
import { rest } from "@owl-factory/https/rest";
import { Button } from "@owl-factory/components/button";
import { Col, Row } from "@owl-factory/components/flex";
import { Card } from "@owl-factory/components/card";
import { AlertController } from "@owl-factory/components/alert/AlertController";
import { Auth } from "controllers/auth";
import { signOut } from "utilities/auth";

interface DashboardProps {
  user?: any;
}

const Dashboard: NextPage<DashboardProps> = (props: any) => {
  return (
    <Page error={props.error}>
      <h3>Welcome back {props.user?.name || props.user?.username}!</h3>

      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}
      <RecentGames campaigns={props.campaigns}/>

      {/* Characters */}
      <h4>My Characters</h4>

      <h4>Temp Profile Stuff</h4>
      <Button onClick={() =>AlertController.success("Testing")}>Test Alerts</Button>
      <Button onClick={() => {console.log(Auth.$fullPermissions);}}>Test Auth</Button>
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
      <Col key={campaign.ref} xs={12} md={6} lg={3}>
        <Card>
          <img src={src}/>
          <h5>{campaign.name}</h5>
          <Link href={`/campaigns/${campaign.ref}`}>
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
  const user = Auth.getUser();
  const result = await rest.get(`/api/dashboard`);

  return { user, campaigns: (result as any).data.campaigns };
};
