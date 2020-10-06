import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../components/admin/gameSystems/Form";
import Page from "../../../components/design/Page";
import gql from "graphql-tag";
import { GameSystemInput } from "@reroll/model/dist/inputs/GameSystemInput"
import { client } from "../../../utilities/graphql/apiClient";
import { useRouter } from "next/router";
import CommonContentTypeForm from "../../../components/admin/commonContentTypes/Form";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function NewCommonContentTypeForm() {
  const router = useRouter();
  return <CommonContentTypeForm 
    initialValues={{
      name: "",
      alias: ""
    }}
    onSubmit={(values: GameSystemInput) => {
      const newGameSystemMutation = gql`
      mutation {
        newCommonContentType (data: {
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
        const key = res.data.newCommonContentType.alias || res.data.newGamenewCommonContentTypeystem._id;
        router.push(`/admin/content-types/${key}`)
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
function NewCommonContentType() {
  return (
    <Page>
      <h1>Create Common Content Type</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Content Types",
        "Create Common Content Type"
      ]}/>

      <br/>

      <NewCommonContentTypeForm/>
    </Page>
  );
}

const fetchThemesGQL = gql`
{
  themes {
    id,
    name,
  }
}
`;

export default NewCommonContentType;
