import React from "react";
import { Button, Input, Page, Select } from "components";
import { Form, Formik } from "formik";
import { rest } from "../../utilities";
import { CampaignDoc } from "types";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { getSession, requireClientLogin } from "utilities/auth";
import { getClient } from "utilities/db";
import { query as q } from "faunadb";


interface RestResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CreateTableResponse {
  campaign: CampaignDoc;
}

export default function NewCampaign(props: any): JSX.Element {
  const router = useRouter();

  if (!props.session) {
    return <>You need to be logged in to create a campaign</>;
  }

  async function createCampaign(values: any) {
    const res: RestResponse<CreateTableResponse> = await rest.put("/api/campaigns", values);

    if (res.success) {
      const href = `/campaigns/${res.data.campaign._id}`;
      router.push(href);
    }
  }

  return (
    <Page>
      <h1>Create a New Campaign</h1>
      <Formik
        initialValues={{ name: "" }}
        onSubmit={(values: any) => {createCampaign(values)}}
      >
        {() => (
        <Form>
          <label>Name</label>
          <Input name="name"/>

          <label>Ruleset</label>
          <Select name="rulesetID" options={props.rulesets} labelKey="0" valueKey="1"/>

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
  const rulesets = await client.query(
    q.Paginate(
      q.Match(
        q.Index(`rulesets_dropdown`)
      )
    )
  );

  console.log(typeof rulesets.data[0][1])

  return { session, rulesets: rulesets.data };
};
