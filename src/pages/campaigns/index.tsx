import { Campaign } from "@prisma/client";
import { Page } from "components/design";
import { NextPageContext } from "next";
import React from "react";

interface CampaignsPageProps {
  campaigns: Campaign[];
}

/**
 * Lists all campaigns that the user is a part of
 */
function CampaignsPage(props: CampaignsPageProps) {
  return (
    <Page>
      Campaigns
    </Page>
  );
}

/**
 * Fetches all of the campaigns the current user is a part of
 */
export function getServerSideProps(ctx: NextPageContext) {
  return {
    props: {
      campaigns: [],
    },
  };
}

export default CampaignsPage;
