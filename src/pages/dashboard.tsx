import { Page } from "components/design";
import Link from "next/link";
import React from "react";
import { Button } from "@owl-factory/components/button";
import { Col, Row } from "@owl-factory/components/flex";
import { Card } from "@owl-factory/components/card";
import { AlertController } from "@owl-factory/alerts";
import { Auth } from "controllers/auth";
import { signOut } from "utilities/auth";
import { CampaignData } from "controllers/data/CampaignData";
import { observer } from "mobx-react-lite";

const Dashboard = observer(() => {

  return (
    <Page>
      <h3>Welcome back {Auth.user?.name || Auth.user?.username}!</h3>

      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}
      <RecentGames/>

      {/* Characters */}
      <h4>My Characters</h4>

      <h4>Temp Profile Stuff</h4>
      <Button onClick={() =>AlertController.success("Testing")}>Test Alerts</Button>
      <Button onClick={() => {console.log(Auth);}}>Test Auth</Button>
    </Page>
  );
});

export default Dashboard;

const RecentGames = observer(() => {
  React.useEffect(() => { CampaignData.searchMyCampaigns(); }, []);

  const refs = CampaignData.search({ group: "my-campaigns" });

  const campaigns: JSX.Element[] = [];
  for (const ref of refs) {
    const campaign = CampaignData.get(ref);
    if (!campaign) { continue; }
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
  }

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
});

// export async function getServerSideProps(ctx: NextPageContext) {
//   return await handleAPI(ctx, getDashboardPage);
// }
