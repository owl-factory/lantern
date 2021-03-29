import React from "react";
import { useSession } from "next-auth/client";
import { Button, Input, Page } from "../../components";
import { Form, Formik } from "formik";
import { rest } from "../../utilities";


export default function NewTable(): JSX.Element {
  const [ session, loading ] = useSession();
  if (!loading && !session) {
    return <>Error</>;
  }

  async function createTable(values: any) {
    const res = await rest.put("/api/pages/tables/new", values);
    if (res.success) {
      
    }
  }
  

  return (
    <Page>
      <h1>Create a New Campaign</h1>
      <Formik
        initialValues={{ name: "" }}
        onSubmit={(values: any) => {console.log(values);}}
      >
        {() => (
        <Form>
          <label>Name</label>
          <Input name="name"/>

          <Button type="submit">Create</Button>
        </Form>
        )}
      </Formik>
    </Page>
  );
}

NewTable.getInitialProps = async () => {
  const res = await rest.get("/api/pages/tables/new");
};
