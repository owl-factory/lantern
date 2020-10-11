import React from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { NextPageContext } from "next";
import { ContentTypeInput } from "@reroll/model/dist/inputs/ContentTypeInput";
import { client } from "../../../../../../utilities/graphql/apiClient";
import ContentTypeForm from "../../../../../../components/admin/contentTypes/Form";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function EditContentTypeForm({ commonContentTypes, contentType, gameSystem }: any) {
  const router = useRouter();
  return <ContentTypeForm 
    commonContentTypes={commonContentTypes}
    initialValues={contentType}
    onSubmit={(values: ContentTypeInput) => {
      const newContentTypeMutation = gql`
      mutation {
        updateContentType (
          _id: "${contentType._id}",
          data: {
            name: "${values.name}",
            alias: "${values.alias}",
            commonContentTypeID: "${values.commonContentTypeID}",
            isTypeOnly: ${values.isTypeOnly},
            description: "${values.description}"
          }
        ) {
          n,
          ok
        }
      }
      `;
      client.mutate({mutation: newContentTypeMutation})
      .then((res: any ) => {
        const gameSystemAlias = router.query.gameSystemAlias;
        const key = values.alias || contentType._id;
        router.push(`/admin/game-systems/${gameSystemAlias}/content-types/${key}`)
      })
      .catch((error: any) => {
        // TODO - Better error handling
        console.log(error)
      });
    }}
  />;
}

/**
 * Renders a the page to create a new game system
 */
export default function EditContentType({ commonContentTypes, contentType, gameSystem }: any) {
  return (
    <Page>
      <h1>Edit {contentType.name}</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Game Systems",
        gameSystem.name,
        "Content Types",
        contentType.name,
        "Edit"
      ]}/>

      <br/>

      <EditContentTypeForm commonContentTypes={commonContentTypes} contentType={contentType} gameSystem={gameSystem}/>
    </Page>
  );
}


EditContentType.getInitialProps = async (ctx: NextPageContext) => {
  const { contentTypeAlias, gameSystemAlias } = ctx.query;
  
  let query = gql`
  query {
    gameSystem (_id: "${gameSystemAlias}") {
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

  const { gameSystem, commonContentTypes } = (await client.query({query: query}))["data"];
  query = gql`query {
    contentType (_id: "${contentTypeAlias}", gameSystemID: "${gameSystem._id}") {
      _id, 
      name, 
      alias,
      commonContentTypeID,
      isTypeOnly,
      description
    }

  }`;

  const { contentType } = (await client.query({query}))["data"];

  return { 
    commonContentTypes,
    contentType,
    gameSystem
  };
}
