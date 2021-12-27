import { RulesetController, RulesetManager } from "controllers/data/ruleset";
import { Page } from "components/design";
import { Loading } from "components/style";
import { Input } from "components/style/forms";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Link from "next/link";
import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { InitialProps } from "types/client";
import { CampaignDocument } from "types/documents";
import { getSession } from "utilities/auth";
import { rest } from "utilities/request";
import { CampaignCache } from "controllers/cache/CampaignCache";

interface MyCampaignsProps extends InitialProps {
  myCampaigns: CampaignDocument[];
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
            {RulesetManager.get(props.campaign?.ruleset?.ref as string)?.name || <Loading/>}
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
  const [ campaigns, setCampaigns ] = React.useState<Partial<CampaignDocument>[]>([]);

  React.useEffect(() => {
    CampaignCache.setMany(props.myCampaigns || []);
  }, []);

  function searchCampaigns(values: SearchCampaignsArguments) {
    console.log(values);
  }

  // Use this to prevent too many rerenders
  React.useEffect(() => {
    setCampaigns(CampaignCache.getPage());
  }, [CampaignCache]);

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

export default observer(MyCampaigns);
