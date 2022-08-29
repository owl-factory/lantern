import { Page } from "components/design";
import { Loading } from "@owl-factory/components/loading";
import { Input } from "@owl-factory/components/form";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { InitialProps } from "types/client";
import { CampaignDocument, RulesetDocument } from "types/documents";
import { CampaignData } from "controllers/data/CampaignData";
import { RulesetData } from "controllers/data/RulesetData";
import { Ref64 } from "@owl-factory/types";

interface MyCampaignsProps extends InitialProps {
  campaigns: CampaignDocument[];
}

interface SearchCampaignsArguments {
  search: string
}

interface CampaignTileProps {
  campaignRef: Ref64;
}

/**
 * Renders a tile containing campaign information
 * @param campaign The campaign to render a tile for
 */
const CampaignTile = observer((props: CampaignTileProps) => {
  const [ campaign, setCampaign ] = React.useState<Partial<CampaignDocument>>({});
  const [ ruleset, setRuleset ] = React.useState<Partial<RulesetDocument>>({});

  React.useEffect(() => {
    setCampaign(CampaignData.get(props.campaignRef) || {});
  }, [CampaignData.lastTouched]);

  React.useEffect(() => {
    if (!campaign || campaign.ruleset?.ref === undefined) { setRuleset({}); return; }
    RulesetData.load(campaign.ruleset?.ref);
    setRuleset(RulesetData.get(campaign.ruleset?.ref as string) || {});
  }, [campaign, RulesetData.lastTouched]);

  return (
    <Card>
      <Row>
        <Col sm={4}>
          <img className="img-fluid rounded-start" src={campaign.banner?.src} />
        </Col>
        <Col sm={8}>
          <Card.Body>
            <Link href={`/campaigns/${campaign.ref}`} passHref>
              <a><h3>{campaign.name}</h3></a>
            </Link><br/>
            <Link href={`/play/${campaign.ref}`}>
              <a>Play</a>
            </Link>
            {ruleset?.name || <Loading/>}
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
const MyCampaigns = observer(() => {
  React.useEffect(() => { CampaignData.searchMyCampaigns(); }, []);

  const campaignRefs = CampaignData.search({ group: "my-campaigns" });

  // Builds the tiles for listing out the campaigns
  const campaignTiles: JSX.Element[] = [];
  for (const ref of campaignRefs) {
    campaignTiles.push(
      <CampaignTile key={ref} campaignRef={ref}/>
    );
  }

  function searchCampaigns(values: any) {
    return;
  }

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
});

export default MyCampaigns;
