import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Page from "../../../components/design/Page";
import gql from "graphql-tag";
import { client } from "../../../utilities/graphql/apiClient";
import { useRouter } from "next/router";
import CommonEntityTypeForm from "../../../components/admin/commonEntityTypes/Form";
import { CreateCommonEntityTypeInput } from "@reroll/model/dist/inputs";
import { GraphQLResponse } from "../../../types/graphql";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown
 */
export function NewCommonEntityTypeForm(): JSX.Element {
  const router = useRouter();
  return <CommonEntityTypeForm
    initialValues={{
      name: "",
      alias: "",
    }}
    onSubmit={(values: CreateCommonEntityTypeInput) => {
      const newGameSystemMutation = gql`
      mutation {
        newCommonEntityType (data: {
          name: "${values.name}",
          alias: "${values.alias}"
        }) {
          _id,
          alias
        }
      }
      `;
      client.mutate({mutation: newGameSystemMutation})
      .then((res: GraphQLResponse ) => {
        const key = res.data.newCommonEntityType.alias || res.data.newGamenewCommonEntityTypeystem._id;
        router.push(`/admin/entity-types/${key}`);
      })
      .catch(() => {
        // TODO - Better error handling
      });
    }}
  />;
}

/**
 * Renders a the page to create a new game system
 * @param themes The themes to render within the new game system form
 */
function NewCommonEntityType(): JSX.Element {
  return (
    <Page>
      <h1>Create Common Entity Type</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Entity Types",
        "Create Common Entity Type",
      ]}/>

      <br/>

      <NewCommonEntityTypeForm/>
    </Page>
  );
}

export default NewCommonEntityType;
