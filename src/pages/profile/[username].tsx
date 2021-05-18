import React from "react";
import { Input, Page } from "components/design";
import { NextPageContext } from "next";
import { rest } from "utilities/request";
import { getSession } from "utilities/auth";
import { UserDocument } from "types/documents";
import { Formik, Form as FormikForm } from "formik";
import { Button } from "components/style";
import { useRouter } from "next/router";

function arrayToList(arr?: string[]): string {
  let list = "";
  if (arr === undefined) { return list; }

  const lastIndex = arr.length - 1;
  arr.forEach((item: string, index: number) => {
    list += item;
    if (index !== lastIndex) { list += ", ";}
  });
  return list;
}

function MemberSince(props: any) {
  const joinDate = Intl.DateTimeFormat('en', {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(props.user.createdAt);
  return (
    <div>
      <div>
        Member since {joinDate} |
        GM of 0 Games |
        {props.user.hoursPlayed || 0} hours played
      </div>
      <hr/>
    </div>
  );
}

function Badges(props: any) {
  return (
    <div>
      <span>Badges</span>
      <div><i>None yet! Check back soon!</i></div>
    </div>
  );
}

function MyOptions(props: any) {
  const recentPlayers: JSX.Element[] = [];
  props.players.forEach((player: UserDocument) => {
    recentPlayers.push(<RecentPlayer key={player.id} player={player}/>);
  });

  return (
    <div>
      <a href="#">View Your Private Messages</a><br/>
      <a href="#">Topics You Follow</a><br/>
      <a href="#">Give Gift Subscription</a><br/>
      <a href="#">View Wishlists</a><br/>
      <a href="#">View Marketplace Items</a><br/>
      <a href="#">View Topics</a><br/>
      <a href="#">View Replies</a><br/>

      <hr/>
      <h4>Recent Players</h4>
      {recentPlayers}
    </div>
  );
}

function MyDetails(props: any) {
  return (
    <div>
      <Formik
        initialValues={props.user}
        onSubmit={(values: Record<string, unknown>) => (props.saveUser(values))}
      >
        <FormikForm>
          <Input name="displayName"/>
          <MemberSince user={props.user}/>
          <span>Badges</span>
          <div><i>None yet! Check back soon!</i></div>
          <hr/>
          <span>Bio</span>
          <div>{props.user.bio}</div>
          <hr/>
          <span>Enjoys Playing</span>
          <div>{arrayToList(props.user.enjoysPlaying)}</div>
          <hr/>
          <span>Actively Seeking Group For</span>
          <div>{arrayToList(props.user.activelySeeking)}</div>
          <hr/>
          <span>Player Directory</span>
          <Button type="submit">Save</Button>
        </FormikForm>
      </Formik>
    </div>
  );
}

function OtherOptions(props: any) {
  return (
    <div>
      <a href="#">Send Private Message</a><br/>
      <a href="#">Give Gift Subscription</a><br/>
      <a href="#">View Wishlists</a><br/>
      <a href="#">View Marketplace Items</a><br/>
      <a href="#">View Topics</a><br/>
      <a href="#">View Replies</a><br/>
      <a href="#">Block {props.user.displayName}</a><br/>
    </div>
  );
}

function OtherDetails(props: any) {
  return (
    <div>
      <h1>{props.user.displayName}</h1>
      <MemberSince user={props.user}/>
      <Badges user={props.user}/>

      { props.user.bio ? (<>
        <hr/>
        <span>Bio</span>
        <div>{props.user.bio}</div>
      </>) : null }

      { props.user.enjoysPlaying ? (<>
        <hr/>
        <span>Enjoys Playing</span>
        <div>{arrayToList(props.user.enjoysPlaying)}</div>
      </>) : null }

      { props.user.activelySeeking ? (<>
        <hr/>
        <span>Actively Seeking Group For</span>
        <div>{arrayToList(props.user.activelySeeking)}</div>
      </>) : null }
    </div>
  );
}

function RecentPlayer(props: any) {
  return (
    <div>
      <a href={`/profile/${props.player.username}`}>
        <img width="30px" height="30px" src={props.player.icon}/>
        <span style={{paddingLeft: "10px"}}>{props.player.displayName}</span>
      </a>
    </div>
  );
}

export default function Profile(props: any): JSX.Element {
  if (!props.success) {
    console.error(404);

    return <>Errror</>
  }
  const router = useRouter();
  const [ user, setUser ] = React.useState(props.data.user);
  const [ players, setPlayers ] = React.useState(props.data.user.recentPlayers);
  console.log(props)
  const isMyPage = props.session !== undefined && user.id === props.session.user.id;

  async function saveUser(values: Record<string, unknown>) {
    values.id = user.id;
    values.ref = user.ref;
    values.collection = user.collection;
    const result = await rest.patch(`/api/profile/${router.query.username}`, values);
    (result.data as any).user.players = user.players;
    if (result.success) {
      setUser((result.data as any).user);
    }
  }

  return (
    <Page>
      <div className="row">
        <div className="col-12 col-md-4">
          <img src={user.icon} width="200px" height="200px"/>
          <hr/>
          { isMyPage ? <MyOptions user={user} players={players}/> : <OtherOptions user={user}/>}
        </div>

        <div className="col-12 col-md-8">
          { isMyPage ? <MyDetails user={user} saveUser={saveUser}/> : <OtherDetails user={user}/> }
        </div>
      </div>
    </Page>
  );
}

Profile.getInitialProps = async (ctx: NextPageContext) => {
  const session = await getSession(ctx);

  const result = await rest.get(`/api/profile/${ctx.query.username}`);
  console.log(result)
  return { ...result, session};
};
