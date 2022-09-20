import React from "react";
import { Page } from "components/design";
import { NextPageContext } from "next";

export default function NewCampaign(props: any): JSX.Element {

  if (!props.session) {
    return <>You need to be logged in to create a campaign</>;
  }

  const options: JSX.Element[] = [];
  props.rulesets.forEach((ruleset: any) => {
    options.push(<option value={ruleset[1]}>{ruleset[0]}</option>);
  });

  return (
    <Page>
      <h1>Create a New Campaign</h1>
    </Page>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  return { props: { rulesets: [] } };
}
