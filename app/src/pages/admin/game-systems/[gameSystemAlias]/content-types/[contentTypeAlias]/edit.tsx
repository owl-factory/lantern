import React from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { NextPageContext } from "next";
import { client } from "../../../../../../utilities/graphql/apiClient";
import ContentTypeForm from "../../../../../../components/admin/contentTypes/Form";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { ContentType, CommonContentType, GameSystem } from "@reroll/model/dist/documents";
import { UpdateContentTypeInput } from "@reroll/model/dist/inputs";
import { FetchError } from "node-fetch";

interface EditContentTypeFormProps {
  commonContentTypes: CommonContentType[];
  contentType: ContentType;
}

interface EditContentTypeProps {
  commonContentTypes: CommonContentType[];
  contentType: ContentType;
  gameSystem: GameSystem;
}

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function EditContentTypeForm({ commonContentTypes, contentType }: EditContentTypeFormProps): JSX.Element {
  const router = useRouter();
  return <ContentTypeForm 
    commonContentTypes={commonContentTypes}
    initialValues={contentType}
    onSubmit={(values: UpdateContentTypeInput) => {
      const newContentTypeMutation = gql`
      mutation {
        updateContentType (
          _id: "${contentType._id}",
          data: {
            name: "${values.name}",
            alias: "${values.alias}",
            commonContentTypeID: "${values.commonContentTypeID}"
          }
        ) {
          n,
          ok
        }
      }
      `;
      client.mutate({mutation: newContentTypeMutation})
      .then(() => {
        const gameSystemAlias = router.query.gameSystemAlias;
        const key = values.alias || contentType._id;
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
export default function EditContentType({ commonContentTypes, contentType, gameSystem }: EditContentTypeProps): JSX.Element {
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

      <EditContentTypeForm commonContentTypes={commonContentTypes} contentType={contentType}/>
    </Page>
  );
}


EditContentType.getInitialProps = async (ctx: NextPageContext) => {
  const { contentTypeAlias, gameSystemAlias } = ctx.query;
  
  const query = gql`query {
    commonContentTypes (sort: "name") {
      _id,
      name,
      alias
    },
    contentType (_id: "${contentTypeAlias}", gameSystemID: "${gameSystemAlias}") {
      _id, 
      name, 
      alias,
      commonContentTypeID,
      isTypeOnly,
      description
    },
    gameSystem (_id: "${gameSystemAlias}") {
      _id,
      name,
      alias
    },
    
  }`;

  const { commonContentTypes, contentType, gameSystem } = (await client.query({query: query}))["data"];
  
  return { 
    commonContentTypes,
    contentType,
    gameSystem
  };
}
