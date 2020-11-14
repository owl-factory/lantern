import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../components/admin/gameSystems/Form";
import Page from "../../../components/design/Page";
import gql from "graphql-tag";
import { client } from "../../../utilities/graphql/apiClient";
import { useRouter } from "next/router";

/**
 * @param themes Themes to render within the form's theme dropdown
 */
interface GameSystemFormProps {
  themes: any[];
}

/**
 * @param themes Themes to render within the form's theme dropdown
 */
interface NewGameSystemProps {
  themes: any[];
}

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown 
 */
export function NewGameSystemForm(props: GameSystemFormProps) {
  const router = useRouter();
  const [ errors, setErrors ] = React.useState({})

  function onSubmit(values: any) {
    const newGameSystemMutation = gql`
      mutation {
        newGameSystem (data: {
          name: "${values.name}",
          alias: "${values.alias}",
          description: "${values.description}",
          isUserCreated: false,
          defaultThemeID: "${values.defaultThemeID || ""}"
        }) {
          _id,
          alias
        }
      }
      `;
      client.mutate({mutation: newGameSystemMutation})
      .then((res: any, ) => {
        const key = res.data.newGameSystem.alias || res.data.newGameSystem._id;
        router.push(`/admin/game-systems/${key}`)
      })
      .catch((gqlError: any) => {
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
      alias: "",
      description: "",
      defaultThemeID: undefined,
      
    }}
    onSubmit={(values: any) => {onSubmit(values)}}
    themes={props.themes}
  />;
}

/**
 * Renders a the page to create a new game system
 * @param themes The themes to render within the new game system form
 */
function NewGameSystem({themes}: NewGameSystemProps) {
  return (
    <Page>
      <h1>Create Game System</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Game Systems", "Create Game System"]}/>

      <br/>

      <NewGameSystemForm themes={themes}/>
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

NewGameSystem.getInitialProps = async () => {
  // const { themes } = await client.query({query: fetchThemesGQL});
  return { themes: [{"name": "Default", "id": "default"}]};
}

export default NewGameSystem;
