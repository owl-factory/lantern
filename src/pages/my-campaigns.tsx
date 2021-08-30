import { Page } from "components/design";
import { Input } from "components/style/forms";
import { Formik } from "formik";
import { NextPageContext } from "next";
import Link from "next/link";
import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { CampaignDocument } from "types/documents";
import { Session } from "types/user";
import { getSession } from "utilities/auth";
import { rest } from "utilities/request";

interface MyCampaignsProps {
  session: Session;
  success: boolean;
  message: string;
  myCampaigns: CampaignDocument[];
}

interface SearchCampaignsArguments {
  search: string
}

interface CampaignTileProps {
  campaign: CampaignDocument;
}

function CampaignTile(props: CampaignTileProps) {
  return (
    <Card>
      <Row>
        <Col sm={4}>
          <img className="img-fluid rounded-start" src={props.campaign.banner?.src} />
        </Col>
        <Col sm={8}>
          <Card.Body>
            <Link href={`/campaigns/${props.campaign.id}`} passHref>
              <a><h3>{props.campaign.name}</h3></a>
            </Link><br/>
            <Link href={`/play/${props.campaign.id}`}>
              <a>Play</a>
            </Link>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default function MyCampaigns(props: MyCampaignsProps) {
  function searchCampaigns(values: SearchCampaignsArguments) {
    console.log(values);
  }

  const campaignTiles: JSX.Element[] = [];
  props.myCampaigns.forEach((campaign: CampaignDocument) => {
    campaignTiles.push(
      <CampaignTile key={campaign.id} campaign={campaign}/>
    );
  });

  return (
    <Page>
      <h1>My Campaigns</h1>
      <Formik
        initialValues={{
          search: "",
        }}
        onSubmit={searchCampaigns}
      >
        <div className="input-group mb-3">
          <Input type="text" name="search" placeholder="Search" />
          <Button type="submit">Search</Button>
        </div>
      </Formik>
      {campaignTiles}
    </Page>
  );
}

interface MyCampaignsResponse {
  campaigns: CampaignDocument[];
}

MyCampaigns.getInitialProps = async (ctx: NextPageContext) => {
  const result = await rest.get<MyCampaignsResponse>(`/api/my-campaigns`);

  return {
    success: result.success,
    message: result.message,
    session: getSession(ctx),
    myCampaigns: result.data.campaigns,
  };
};
