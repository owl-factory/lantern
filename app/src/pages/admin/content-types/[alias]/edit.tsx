import React from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { NextPageContext } from "next";
import { client } from "../../../../utilities/graphql/apiClient";
import Page from "../../../../components/design/Page";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import CommonContentTypeForm from "../../../../components/admin/commonContentTypes/Form";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function EditCommonContentTypeForm(props: any) {
  const router = useRouter();
  return <CommonContentTypeForm 
    initialValues={{
      name: props.commonContentType.name,
      alias: props.commonContentType.alias,
      description: props.commonContentType.description
    }}
    onSubmit={(values: any) => {
      const { alias } = router.query;

      const EditCommonContentTypeMutation = gql`
      mutation {
        updateCommonContentType (
          _id: "${props.commonContentType._id}",
          data: {
            name: "${values.name}",
            alias: "${values.alias}",
            description: "${values.description}"
          }
        ) {
          ok
        }
      }
      `;
      
      client.mutate({mutation: EditCommonContentTypeMutation})
      .then((res: any, ) => {
        router.push(`/admin/content-types/${alias}`)
      })
      .catch((error: any) => {
        // TODO - Better error handling
        console.log(error)
      });
    }}
  />;
}

export default function EditCommonContentType({ commonContentType }: any) {
  return (
    <Page>
      <h1>New {commonContentType.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Common Content Types", commonContentType.name, "Edit" ]}/>
      <EditCommonContentTypeForm commonContentType={commonContentType} />
    </Page>
  )
}

EditCommonContentType.getInitialProps = async (ctx: NextPageContext) => {
  const { alias } = ctx.query;

  const query = gql`query {
    commonContentType (_id: "${alias}") {
      _id,
      name,
      alias,
      description
    }
  }`;

  const { data } = await client.query({query: query});
  return { 
    commonContentType: data.commonContentType
  };
}