import { Page } from "components/design";
import Link from "next/link";
import React from "react";
import { CampaignDocument } from "types/documents";
import { NextPage, NextPageContext } from "next";
import { Button } from "@owl-factory/components/button";
import { Col, Row } from "@owl-factory/components/flex";
import { Card } from "@owl-factory/components/card";
import { AlertController } from "@owl-factory/components/alert/AlertController";
import { Auth } from "controllers/auth";
import { signOut } from "utilities/auth";
import { handleAPI } from "@owl-factory/https/apiHandler";
import { getDashboardPage } from "./api/dashboard";
import { uploadImage } from "utilities/image-upload";

interface DashboardProps {
  user?: any;
}

const Dashboard: NextPage<DashboardProps> = (props: any) => {
  const [user, setUser] = React.useState(Auth.user);

  function uploadHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length === 1) {
      const image = event.target.files[0];
      uploadImage(image).then(e => {console.log(e);});
    }
  }

  React.useEffect(() => {
    // TODO - do not set until after we return the players and owners for these campaigns
    // CampaignData.setMany(props.campaigns);
  }, []);

  return (
    <Page error={props.error}>
      <h3>Welcome back {Auth.user?.name || Auth.user?.username}!</h3>

      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}
      <RecentGames campaigns={props.campaigns}/>

      {/* Characters */}
      <h4>My Characters</h4>

      <h4>Temp Profile Stuff</h4>
      <Button onClick={() =>AlertController.success("Testing")}>Test Alerts</Button>
      <Button onClick={() => {console.log(Auth);}}>Test Auth</Button>

      <h4>Upload Image Test</h4>
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">Default file input example</label>
        <input className="form-control" type="file" id="formFile" onChange={uploadHandler} />
      </div>
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

        <Link href="/sst" passHref>
          <Button className="float-end">
            Server Side Props Test
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

export async function getServerSideProps(ctx: NextPageContext) {
  return await handleAPI(ctx, getDashboardPage);
}
