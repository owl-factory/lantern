import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../components/admin/gameSystems/Form";
import Page from "../../../components/design/Page";
import gql from "graphql-tag";
import { GameSystemInput } from "@reroll/model/dist/inputs/GameSystemInput"
import { client } from "../../../utilities/graphql/apiClient";
import { useRouter } from "next/router";
import CommonEntityTypeForm from "../../../components/admin/commonEntityTypes/Form";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function NewCommonEntityTypeForm() {
  const router = useRouter();
  return <CommonEntityTypeForm 
    initialValues={{
      name: "",
      alias: ""
    }}
    onSubmit={(values: GameSystemInput) => {
      const newGameSystemMutation = gql`
      mutation {
        newCommonEntityType (data: {
          name: "${values.name}",
          alias: "${values.alias}",
          description: "${values.description}"
        }) {
          _id,
          alias
        }
      }
      `;
      client.mutate({mutation: newGameSystemMutation})
      .then((res: any, ) => {
        const key = res.data.newCommonEntityType.alias || res.data.newGamenewCommonEntityTypeystem._id;
        router.push(`/admin/entity-types/${key}`)
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
 * @param themes The themes to render within the new game system form
 */
function NewCommonEntityType() {
  return (
    <Page>
      <h1>Create Common Entity Type</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Entity Types",
        "Create Common Entity Type"
      ]}/>

      <br/>

      <NewCommonEntityTypeForm/>
    </Page>
  );
}

export default NewCommonEntityType;
