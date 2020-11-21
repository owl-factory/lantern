import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../components/admin/gameSystems/Form";
import Page from "../../../components/design/Page";
import gql from "graphql-tag";
import { client } from "../../../utilities/graphql/apiClient";
import { useRouter } from "next/router";
import { CreateGameSystemInput } from "@reroll/model/dist/inputs";
import { FetchError } from "node-fetch";
import { GraphQLResponse } from "../../../types/graphql";


/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function NewGameSystemForm(): JSX.Element {
  const router = useRouter();
  const [ errors, setErrors ] = React.useState({})

  function onSubmit(values: CreateGameSystemInput) {
    const newGameSystemMutation = gql`
      mutation {
        newGameSystem (data: {
          name: "${values.name}",
          alias: "${values.alias}",
          isUserCreated: false,
        }) {
          _id,
          alias
        }
      }
      `;
      client.mutate({mutation: newGameSystemMutation})
      .then((res: GraphQLResponse ) => {
        const key = res.data.newGameSystem.alias || res.data.newGameSystem._id;
        router.push(`/admin/game-systems/${key}`)
      })
      .catch((gqlError: FetchError) => {
        // console.log(Object.keys(gqlError))
        // console.log(gqlError.graphQLErrors)
        // console.log(gqlError.message)
        // console.log(gqlError.extraInfo)
        setErrors({_global: gqlError.message})
        // TODO - Better error handling
        console.log(gqlError)
      });
  }

  return <GameSystemForm
    errors={errors}
    initialValues={{
      name: "",
      alias: ""
      
    }}
    onSubmit={(values: CreateGameSystemInput) => {onSubmit(values)}}
  />;
}

/**
 * Renders a the page to create a new game system
 * @param themes The themes to render within the new game system form
 */
function NewGameSystem(): JSX.Element {
  return (
    <Page>
      <h1>Create Game System</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", "Create Game System"]}/>

      <br/>

      <NewGameSystemForm/>
    </Page>
  );
}

NewGameSystem.getInitialProps = async () => {
  // const { themes } = await client.query({query: fetchThemesGQL});
  // return { themes: [{"name": "Default", "id": "default"}]};
}

export default NewGameSystem;
