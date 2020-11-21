import React from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { client } from "../../../../../utilities/graphql/apiClient";
import Page from "../../../../../components/design/Page";
import Breadcrumbs from "../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import ContentTypeForm from "../../../../../components/admin/contentTypes/Form";
import { CommonContentType, GameSystem } from "@reroll/model/dist/documents";
import { CreateContentTypeInput } from "@reroll/model/dist/inputs";
import { GraphQLResponse } from "../../../../../types/graphql";
import { FetchError } from "node-fetch";

interface NewContentTypeFormProps {
  commonContentTypes: CommonContentType[];
  gameSystem: GameSystem;
}

interface NewCommonContentTypeProps {
  commonContentTypes: CommonContentType[];
  gameSystem: GameSystem;
}

/**
 * Renders a new game system form
 */
export function NewContentTypeForm({ commonContentTypes, gameSystem }: NewContentTypeFormProps): JSX.Element {
  const router = useRouter();
  return <ContentTypeForm 
    commonContentTypes={commonContentTypes}
    initialValues={{
      name: "",
      alias: ""
    }}
    onSubmit={(values: CreateContentTypeInput) => {
      const newContentTypeMutation = gql`
      mutation {
        newContentType (data: {
          name: "${values.name}",
          alias: "${values.alias}",
          gameSystemID: "${gameSystem._id}",
          commonContentTypeID: "${values.commonContentTypeID}"
        }) {
          _id,
          alias
        }
      }
      `;
      client.mutate({mutation: newContentTypeMutation})
      .then((res: GraphQLResponse ) => {
        const gameSystemAlias = router.query.gameSystemAlias;
        const key = res.data.newContentType.alias || res.data.newContentType._id;
        router.push(`/admin/game-systems/${gameSystemAlias}/content-types/${key}`)
      })
      .catch((error: FetchError) => {
        // TODO - Better error handling
        console.log(error)
      });
    }}
  />;
}

/**
 * Renders a the page to create a new game system
 */
export default function NewCommonContentType({ commonContentTypes, gameSystem }: NewCommonContentTypeProps): JSX.Element {
  return (
    <Page>
      <h1>Create Content Type</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Game Systems",
        gameSystem.name,
        "Content Types",
        "New"
      ]}/>

      <br/>

      <NewContentTypeForm commonContentTypes={commonContentTypes} gameSystem={gameSystem}/>
    </Page>
  );
}


NewCommonContentType.getInitialProps = async (ctx: NextPageContext) => {
  const alias = ctx.query.gameSystemAlias;
  
  const query = gql`
  query {
    gameSystem (_id: "${alias}") {
      _id,
      name,
      alias
    },
    commonContentTypes (sort: "name") {
      _id,
      name,
      alias
    }
  }`;

  const { data } = await client.query({query: query});
  
  return { 
    commonContentTypes: data.commonContentTypes,
    gameSystem: data.gameSystem
  };
}
