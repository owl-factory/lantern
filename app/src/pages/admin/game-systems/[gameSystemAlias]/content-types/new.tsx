import React from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { client } from "../../../../../utilities/graphql/apiClient";
import Page from "../../../../../components/design/Page";
import Breadcrumbs from "../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import ContentTypeForm from "../../../../../components/admin/contentTypes/Form";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function NewContentTypeForm({ commonContentTypes, gameSystem }: any) {
  const router = useRouter();
  return <ContentTypeForm 
    commonContentTypes={commonContentTypes}
    initialValues={{
      name: "",
      alias: "",
      isTypeOnly: false
    }}
    onSubmit={(values: any) => {
      const newContentTypeMutation = gql`
      mutation {
        newContentType (data: {
          name: "${values.name}",
          alias: "${values.alias}",
          gameSystemID: "${gameSystem._id}",
          commonContentTypeID: "${values.commonContentTypeID}",
          isTypeOnly: ${values.isTypeOnly},
          description: "${values.description}"
        }) {
          _id,
          alias
        }
      }
      `;
      client.mutate({mutation: newContentTypeMutation})
      .then((res: any ) => {
        const gameSystemAlias = router.query.gameSystemAlias;
        const key = res.data.newContentType.alias || res.data.newContentType._id;
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
export default function NewCommonContentType({ commonContentTypes, gameSystem }: any) {
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

  const { data, loading } = await client.query({query: query});
  
  return { 
    commonContentTypes: data.commonContentTypes,
    gameSystem: data.gameSystem
  };
}
