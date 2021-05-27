import React from "react";
import { Checkbox, Input, Page, TextArea } from "components/design";
import { NextPageContext } from "next";
import { rest } from "utilities/request";
import { getSession } from "utilities/auth";
import { UserDocument } from "types/documents";
import { Formik, Form as FormikForm } from "formik";
import { Button } from "components/style";
import { useRouter } from "next/router";
import { arrayToList } from "utilities/arrays";

/**
 * Renders a small section indicating how long a player has been a member, their hours played,
 * and their total games GMed
 * @param user The user to render member since information
 */
function MemberSince({ user }: { user: UserDocument }) {
  const joinDate = Intl.DateTimeFormat('en', {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <div>
      <div>
        Member since {joinDate} |
        GM of 0 Games |
        {user.hoursPlayed || 0} hours played
      </div>
      <hr/>
    </div>
  );
}

/**
 * Renders the badges for the user
 * @param user The user to render the badges for
 */
function Badges({ user }: { user: UserDocument }) {
  return (
    <div>
      <span>Badges</span>
      <div><i>None yet! Check back soon!</i></div>
    </div>
  );
}

/**
 * Renders the Options for the user if it is the same as the active user.
 * @param user The current user's information for rendering proper links
 * @param players The current user's recently played with players
 */
function MyOptions({ user, players}: { user: UserDocument, players: UserDocument[] }) {
  const recentPlayers: JSX.Element[] = [];
  players.forEach((player: UserDocument) => {
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

/**
 * Renders the details for the current user. Includes a form for updating some user information. 
 * @param user The user to render details for
 * @param saveUser A function to save the user's information to the database
 */
function MyDetails({ user, saveUser }: { user: UserDocument, saveUser: (values: Record<string, unknown>) => void }) {
  return (
    <div>
      <Formik
        initialValues={user as unknown as Record<string, unknown>}
        onSubmit={(values: Record<string, unknown>) => (saveUser(values))}
      >
        <FormikForm>
          <Input name="displayName"/>
          <MemberSince user={user}/>
          <span>Badges</span>
          <div><i>None yet! Check back soon!</i></div>
          <hr/>
          <span>Bio</span>
          <TextArea name="bio"/>
          <hr/>
          <span>Enjoys Playing</span>
          <div>{arrayToList(user.enjoysPlaying)}</div>
          <hr/>
          <span>Actively Seeking Group For</span>
          <div>{arrayToList(user.activelySeeking)}</div>
          <hr/>
          <span>Remove from Player Directory</span>
          <Checkbox name="isPrivate"/>
          <hr/>
          <Button type="submit">Save</Button>
        </FormikForm>
      </Formik>
    </div>
  );
}

/**
 * Renders the options when viewing another person's profile page
 * @param user The user information to render
 */
function OtherOptions({ user }: { user: UserDocument }) {
  return (
    <div>
      <a href="#">Send Private Message</a><br/>
      <a href="#">Give Gift Subscription</a><br/>
      <a href="#">View Wishlists</a><br/>
      <a href="#">View Marketplace Items</a><br/>
      <a href="#">View Topics</a><br/>
      <a href="#">View Replies</a><br/>
      <a href="#">Block {user.displayName}</a><br/>
    </div>
  );
}

/**
 * Renders another user's details
 * @param user The user information to render
 */
function OtherDetails({ user }: { user: UserDocument }) {
  return (
    <div>
      <h1>{user.displayName}</h1>
      <MemberSince user={user}/>
      <Badges user={user}/>

      { user.bio ? (<>
        <hr/>
        <span>Bio</span>
        <div>{user.bio}</div>
      </>) : null }

      { user.enjoysPlaying ? (<>
        <hr/>
        <span>Enjoys Playing</span>
        <div>{arrayToList(user.enjoysPlaying)}</div>
      </>) : null }

      { user.activelySeeking ? (<>
        <hr/>
        <span>Actively Seeking Group For</span>
        <div>{arrayToList(user.activelySeeking)}</div>
      </>) : null }
    </div>
  );
}

/**
 * Renders a recently played with user
 * @param player The recently played with user.
 */
function RecentPlayer({ player }: { player: UserDocument }) {
  return (
    <div>
      <a href={`/profile/${player.username}`}>
        <img width="30px" height="30px" src={player.icon}/>
        <span style={{paddingLeft: "10px"}}>{player.displayName}</span>
      </a>
    </div>
  );
}

/**
 * Renders a user's profile page.
 * @param props.success True if the request succeeded. False otherwise
 * @param props.data Contains the user's profile information
 * @param props.message A message, if any, explaining the success value
 * @param props.session The current user's session, if any
 */
export default function Profile(props: any): JSX.Element {
  if (!props.success) {
    console.error(404);

    return <>Error</>;
  }
  const router = useRouter();
  const [ user, setUser ] = React.useState(props.data.user);
  const [ players ] = React.useState(props.data.user.recentPlayers);
  const isMyPage = calculateIfUserIsOwner();

  /**
   * Determines if the current player is the owner of the profile page.
   * Required to catch issue where unlogged players would cause an issue with the logic
   */
  function calculateIfUserIsOwner() {
    if (!props.session) { return false; }
    if (props.session.user.id === user.id) { return true; }
    return false;
  }

  /**
   * A callback function that handles saving the user's information to the database 
   * @param values The user document values to save to the database
   */
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
  return { ...result, session};
};
