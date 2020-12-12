import React from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { NextPageContext } from "next";
import { client } from "../../../../utilities/graphql/apiClient";
import Page from "../../../../components/design/Page";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import CommonContentTypeForm from "../../../../components/admin/commonContentTypes/Form";
import { CommonContentType } from "@reroll/model/dist/documents";
import { UpdateCommonContentTypeInput } from "@reroll/model/dist/inputs";

interface EditCommonContentTypeFormProps {
  commonContentType: CommonContentType;
}

interface EditCommonContentTypeProps {
  commonContentType: CommonContentType;
}

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown
 */
export function EditCommonContentTypeForm(props: EditCommonContentTypeFormProps): JSX.Element {
  const router = useRouter();
  return <CommonContentTypeForm
    initialValues={{
      name: props.commonContentType.name,
      alias: props.commonContentType.alias,
    }}
    onSubmit={(values: UpdateCommonContentTypeInput) => {
      const { alias } = router.query;

      const EditCommonContentTypeMutation = gql`
      mutation {
        updateCommonContentType (
          _id: "${props.commonContentType._id}",
          data: {
            name: "${values.name}",
            alias: "${values.alias}"
          }
        ) {
          ok
        }
      }
      `;

      client.mutate({mutation: EditCommonContentTypeMutation})
      .then(() => {
        router.push(`/admin/content-types/${alias}`);
      })
      .catch(() => {
        // TODO - Better error handling
      });
    }}
  />;
}

export default function EditCommonContentType({ commonContentType }: EditCommonContentTypeProps): JSX.Element {
  return (
    <Page>
      <h1>New {commonContentType.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Common Content Types", commonContentType.name, "Edit" ]}/>
      <EditCommonContentTypeForm commonContentType={commonContentType} />
    </Page>
  );
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
    commonContentType: data.commonContentType,
  };
};
