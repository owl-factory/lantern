import React from "react";
import { useSession } from "next-auth/client";
import { Button, Input, Page, Select } from "components";
import { Form, Formik } from "formik";
import { rest } from "../../utilities";
import { CampaignDoc, RulesetDoc, TableDoc } from "types";
import { useRouter } from "next/router";

interface RestResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CreateTableResponse {
  table: TableDoc;
  campaign: CampaignDoc;
}

interface NewTableProps {
  myRulesets: RulesetDoc[],
  initialRulesets: RulesetDoc[];
  rulesetCount: number;
}

export default function NewTable(props: NewTableProps): JSX.Element {
  const router = useRouter();
  const [ session, loading ] = useSession();
  if (!loading && !session) {
    return <>Error</>;
  }

  async function createTable(values: any) {
    const res: RestResponse<CreateTableResponse> = await rest.put("/api/tables", values);

    if (res.success) {
      const href = `/tables/${res.data.table._id}`;
      router.push(href);
    }
  }


  return (
    <Page>
      <h1>Create a New Campaign</h1>
      <Formik
        initialValues={{ name: "" }}
        onSubmit={(values: any) => {createTable(values)}}
      >
        {() => (
        <Form>
          <label>Name</label>
          <Input name="name"/>

          <label>Ruleset</label>
          <Select name="rulesetID" options={props.initialRulesets} labelKey="name" valueKey="_id"/>

          <Button type="submit">Create</Button>
        </Form>
        )}
      </Formik>
    </Page>
  );
}

NewTable.getInitialProps = async () => {
  const initialProps: NewTableProps = {
    myRulesets: [],
    initialRulesets: [],
    rulesetCount: 0,
  };

  const res = await rest.get("/api/pages/tables/new") as RestResponse<NewTableProps>;
  if (res.success) {
    initialProps.myRulesets = res.data.myRulesets;
    initialProps.initialRulesets = res.data.initialRulesets;
    initialProps.rulesetCount = res.data.rulesetCount;
  }
  return initialProps;
};
