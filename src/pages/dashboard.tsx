import { Input, Page } from "components";
import { Form, Formik } from "formik";
import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";
import { CampaignDoc, Session } from "types";
import { rest } from "utilities";
import { getSession, signOut } from "utilities/auth";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";

interface DashboardProps {
  session?: Session;
}

const Dashboard: NextPage<DashboardProps> = ({ session }) => {
  return (
    <Page>
      <h3>Welcome back {session?.user.data.username}!</h3>

      <Button onClick={() => signOut()}>Log Out</Button>
      {/* Recent Games */}

      {/* Characters */}
      <h4>My Characters</h4>

      <h4>Temp Profile Stuff</h4>
    </Page>
  );
};

Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (session) {
    return { session };
  } else {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    } else {
      Router.push("/");
    }
    return {};
  }
};

export default Dashboard;

function RecentGames(props: any) {
  const campaigns: JSX.Element[] = [];
  props.campaigns.forEach((campaign: CampaignDoc) => {
    campaigns.push(
      <>
        <h5>{campaign.name}</h5>
        <Link href={`/campaigns/${campaign._id}`}>
          Visit
        </Link>
      </>
    );
  });

  return (
    <div>
      <h4>
        Recent Games
        <Link href="/tables/new" passHref>
          <Button className="float-end">
            Create New Game
          </Button>
        </Link>
      </h4>
      {campaigns}
    </div>
  );
}

function ProfileForm(props: any) {

  async function saveProfile(values: any) {
    await rest.patch(`/api/profile`, values);
  }
  return (
    <Formik
      initialValues={props.me}
      onSubmit={saveProfile}
    >
      {() => (
        <Form>
          <Input name="name" />
          <Button type="submit">Save</Button>
        </Form>
      )}
    </Formik>
  );
}
