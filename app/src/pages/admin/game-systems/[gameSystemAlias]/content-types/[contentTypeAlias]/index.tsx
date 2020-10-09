import React from "react";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../../../../../utilities/graphql/apiClient";

export default function ContentTypeView({contentType, gameSystem}: any) {
  return (
    <Page>
      <h1>{contentType.name}</h1>
      <Breadcrumbs
        skipLevels={1}
        titles={[
          "Admin",
          "Game Systems",
          gameSystem.name!,
          "Content Types",
          contentType.name
        ]}
      />


      
    </Page>
  )
}

ContentTypeView.getInitialProps = async (ctx: NextPageContext) => {
  const { gameSystemAlias, contentTypeAlias } = ctx.query;
  const query = gql`query {
    contentType(_id: "${contentTypeAlias}") {
      _id,
      name,
      alias
    },
    gameSystem(_id: "${gameSystemAlias}") {
      _id,
      name,
      alias
    }
  }`;

  const { gameSystem, contentType } = (await client.query({query}))["data"];

  return { contentType, gameSystem };
}