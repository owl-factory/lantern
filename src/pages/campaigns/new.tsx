import React from "react";
import { Page } from "components/design";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { getSession, requireClientLogin } from "utilities/auth";
import { getClient, readQuery } from "utilities/db";
import { query as q } from "faunadb";
import { Button } from "components/style";
import { Input } from "@owl-factory/components/form";
import { Select } from "@owl-factory/components/form/Select";

export default function NewCampaign(props: any): JSX.Element {
  const router = useRouter();
  const client = getClient();

  if (!props.session) {
    return <>You need to be logged in to create a campaign</>;
  }

  async function createCampaign(values: any) {
    const { data, error } = await readQuery(client.query(
      q.Call(
        "create_campaign",
        [ values ]
      )
    ));
    // if (data) {
    //   router.push(href);
    // }
  }

  const options: JSX.Element[] = [];
  props.rulesets.forEach((ruleset: any) => {
    options.push(<option value={ruleset[1]}>{ruleset[0]}</option>);
  });

  return (
    <Page>
      <h1>Create a New Campaign</h1>
      <Formik
        initialValues={{ name: "", ruleset: "" }}
        onSubmit={(values: any) => { createCampaign(values); }}
      >
        {() => (
        <Form>
          <label>Name</label>
          <Input type="text" name="name"/>

          <label>Ruleset</label>
          <Select name="ruleset" >
            {options}
          </Select>

          <Button type="submit">Create</Button>
        </Form>
        )}
      </Formik>
    </Page>
  );
}

NewCampaign.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!requireClientLogin(session, ctx)) { return {}; }
  const client = getClient(ctx);


  return { session, rulesets: {} };
};
