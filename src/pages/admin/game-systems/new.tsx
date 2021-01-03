import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import GameSystemForm from "../../../components/admin/gameSystems/Form";
import Page from "../../../components/design/Page";
import { useRouter } from "next/router";


/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown
 */
export function NewGameSystemForm(): JSX.Element {
  const router = useRouter();
  const [ errors, setErrors ] = React.useState({});

  function onSubmit(values: any) {}

  return <GameSystemForm
    errors={errors}
    initialValues={{
      name: "",
      alias: "",

    }}
    onSubmit={(values: any) => {onSubmit(values);}}
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
  return;
};

export default NewGameSystem;
