import { NextPageContext } from "next";
import React from "react";
import Page from "../../../components/design/Page";
import request from "../../../utilities/request";

export default function Organization(props: any) {
  console.log(props)
  return (
    <Page>
      <h1>{props.organization.name}</h1>
    </Page>
  )
}

Organization.getInitialProps = async (ctx: NextPageContext) => {

  const response = await request.get(`/api/admin/organizations/${ctx.query.id}`);

  return { organization: response.organization };
}