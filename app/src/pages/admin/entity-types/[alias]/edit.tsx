import React from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { NextPageContext } from "next";
import { client } from "../../../../utilities/graphql/apiClient";
import Page from "../../../../components/design/Page";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import CommonEntityTypeForm from "../../../../components/admin/commonEntityTypes/Form";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function EditCommonEntityTypeForm(props: any) {
  const router = useRouter();
  return <CommonEntityTypeForm 
    initialValues={{
      name: props.commonEntityType.name,
      alias: props.commonEntityType.alias,
      description: props.commonEntityType.description
    }}
    onSubmit={(values: any) => {
      const { alias } = router.query;

      const EditCommonEntityTypeMutation = gql`
      mutation {
        updateCommonEntityType (
          _id: "${props.commonEntityType._id}",
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
      
      client.mutate({mutation: EditCommonEntityTypeMutation})
      .then((res: any, ) => {
        router.push(`/admin/entity-types/${alias}`)
      })
      .catch((error: any) => {
        // TODO - Better error handling
        console.log(error)
      });
    }}
  />;
}

export default function EditCommonEntityType({ commonEntityType }: any) {
  return (
    <Page>
      <h1>New {commonEntityType.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Common Entity Types", commonEntityType.name, "Edit" ]}/>
      <EditCommonEntityTypeForm commonEntityType={commonEntityType} />
    </Page>
  )
}

EditCommonEntityType.getInitialProps = async (ctx: NextPageContext) => {
  const { alias } = ctx.query;

  const query = gql`query {
    commonEntityType (_id: "${alias}") {
      _id,
      name,
      alias,
      description
    }
  }`;

  const { data } = await client.query({query: query});
  return { 
    commonEntityType: data.commonEntityType
  };
}