import { Page } from "components/design";
import { Loading } from "@owl-factory/components/loading";
import { Input } from "@owl-factory/components/form";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Link from "next/link";
import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { InitialProps } from "types/client";
import { CampaignDocument } from "types/documents";
import { CampaignCache } from "controllers/cache/CampaignCache";
import { RulesetCache } from "controllers/cache/RulesetCache";
import { pagePermission } from "@owl-factory/auth/permissions";
import { onApiError } from "@owl-factory/next/page-handling";
import { getMyCampaigns } from "./api/my-campaigns";
import { handleAPI } from "@owl-factory/https/apiHandler";

interface MyCampaignsProps extends InitialProps {
  campaigns: CampaignDocument[];
}

interface SearchCampaignsArguments {
  search: string
}

interface CampaignTileProps {
  campaign: Partial<CampaignDocument>;
}

/**
 * Renders a tile containing campaign information
 * @param campaign The campaign to render a tile for
 */
const CampaignTile = observer((props: CampaignTileProps) => {
  return (
    <Card>
      <Row>
        <Col sm={4}>
          <img className="img-fluid rounded-start" src={props.campaign.banner?.src} />
        </Col>
        <Col sm={8}>
          <Card.Body>
            <Link href={`/campaigns/${props.campaign.ref}`} passHref>
              <a><h3>{props.campaign.name}</h3></a>
            </Link><br/>
            <Link href={`/play/${props.campaign.ref}`}>
              <a>Play</a>
            </Link>
            {RulesetCache.get(props.campaign?.ruleset?.ref as string)?.name || <Loading/>}
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
});

/**
 * Renders a page with the current user's campaigns
 * @param success Whether or not the initial props failed
 * @param message The success or error message indicating the error from the intial props
 * @param session The current user's session
 * @param campaigns The initial light campaign information fetched from the API
 */
function MyCampaigns(props: MyCampaignsProps) {
  onApiError(props);
  pagePermission("viewMyCampaigns");
  console.log(props)

  const [ campaigns, setCampaigns ] = React.useState<Partial<CampaignDocument>[]>([]);

  React.useEffect(() => {
    CampaignCache.setMany(props.campaigns || []);
  }, []);

  function searchCampaigns(values: SearchCampaignsArguments) {
    console.log(values);
  }

  // Use this to prevent too many rerenders
  React.useEffect(() => {
    setCampaigns(CampaignCache.getPage());
  }, [CampaignCache.lastTouched]);

  // Builds the tiles for listing out the campaigns
  const campaignTiles: JSX.Element[] = [];
  campaigns.forEach((campaign: Partial<CampaignDocument>) => {
    campaignTiles.push(
      <CampaignTile key={campaign.ref} campaign={campaign}/>
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

export async function getServerSideProps(ctx: NextPageContext) {
  return await handleAPI(ctx, getMyCampaigns);
}

export default observer(MyCampaigns);
