import { NextPageContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import Page from "../../../components/design/Page";
import { Organization } from "../../../types/documents";
import request from "../../../utilities/request";

// Props for the OrganizationView
interface OrganizationViewProps {
  organization: Organization;
}

/**
 * Renders the main page for managing an organization
 * @param organization The current organization's data 
 */
export default function OrganizationView(props: OrganizationViewProps) {
  const router = useRouter();

  if (props.organization === undefined) { router.push("404"); }

  return (
    <Page>
      <h1>{props.organization.name}</h1>
    </Page>
  )
}

/**
 * Fetches the organization to view
 * @param ctx The Next Page context for accessing the URL query
 */
OrganizationView.getInitialProps = async (ctx: NextPageContext) => {
  const response = await request.get(`/api/admin/organizations/${ctx.query.id}`);

  return { organization: response.organization };
}