import React from "react";
import { useSession } from "next-auth/client";
import { Button, Input, Page, Select } from "components";
import { Form, Formik } from "formik";
import { rest } from "../../utilities";
import { CampaignDoc } from "types";
import { useRouter } from "next/router";

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
  const [ session, loading ] = useSession();
  if (!loading && !session) {
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
          <Select name="rulesetID" options={props.data.initialRulesets} labelKey="name" valueKey="_id"/>

          <Button type="submit">Create</Button>
        </Form>
        )}
      </Formik>
    </Page>
  );
}

NewCampaign.getInitialProps = async () => {
  return await rest.get("/api/pages/campaigns/new");
};
