import React from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { NextPageContext } from "next";
import { client } from "../../../../utilities/graphql/apiClient";
import Page from "../../../../components/design/Page";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import CommonEntityTypeForm from "../../../../components/admin/commonEntityTypes/Form";
import { CommonEntityType } from "@reroll/model/dist/documents";
import { UpdateCommonEntityTypeInput } from "@reroll/model/dist/inputs";

interface EditCommonEntityTypeFormProps {
  commonEntityType: CommonEntityType;
}

interface EditCommonEntityTypeProps {
  commonEntityType: CommonEntityType;
}

/**
 * Renders a new game system form
 */
export function EditCommonEntityTypeForm(props: EditCommonEntityTypeFormProps): JSX.Element {
  const router = useRouter();
  return <CommonEntityTypeForm
    initialValues={{
      name: props.commonEntityType.name,
      alias: props.commonEntityType.alias,
    }}
    onSubmit={(values: UpdateCommonEntityTypeInput) => {
      const { alias } = router.query;

      const EditCommonEntityTypeMutation = gql`
      mutation {
        updateCommonEntityType (
          _id: "${props.commonEntityType._id}",
          data: {
            name: "${values.name}",
            alias: "${values.alias}"
          }
        ) {
          ok
        }
      }
      `;

      client.mutate({mutation: EditCommonEntityTypeMutation})
      .then(( ) => {
        router.push(`/admin/entity-types/${alias}`);
      })
      .catch(() => {
        // TODO - Better error handling
      });
    }}
  />;
}

export default function EditCommonEntityType({ commonEntityType }: EditCommonEntityTypeProps): JSX.Element {
  return (
    <Page>
      <h1>New {commonEntityType.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Common Entity Types", commonEntityType.name, "Edit" ]}/>
      <EditCommonEntityTypeForm commonEntityType={commonEntityType} />
    </Page>
  );
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
    commonEntityType: data.commonEntityType,
  };
};
