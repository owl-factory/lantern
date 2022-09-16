import React from "react";
import { Page } from "components/design";
import { FileDocument, UserDocument } from "types/documents";
import { Formik, Form as FormikForm } from "formik";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ImageSelectionWrapper } from "components/reroll/images/ImageSelectionWrapper";
import { Checkbox, Input } from "@owl-factory/components/form";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { AssetUploadSource } from "types/enums/files/createMethod";
import { arrayToList } from "@owl-factory/utilities/arrays";
import { Auth } from "controllers/auth";
import { Loading } from "@owl-factory/components/loading";
import { User } from "@prisma/client";

/**
 * Renders a small section indicating how long a player has been a member, their hours played,
 * and their total games GMed
 * @param user The user to render member since information
 */
function MemberSince({ user }: { user: User }) {
  const joinDate = Intl.DateTimeFormat('en', {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(user.createdAt as Date);

  return (
    <div>
      <div>
        Member since {joinDate} |
        GM of 0 Games |
      </div>
      <hr/>
    </div>
  );
}

/**
 * Renders the badges for the user
 * @param user The user to render the badges for
 */
function Badges({ user }: { user: User }) {
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
function MyOptions({ user, players}: { user: User, players: User[] }) {
  const recentPlayers: JSX.Element[] = [];
  players.forEach((player: User) => {
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
function MyDetails(
  { user, saveUser }: { user: User, saveUser: (values: Record<string, unknown>) => void }
) {
  return (
    <div>
      <Formik
        initialValues={user as unknown as Record<string, unknown>}
        onSubmit={(values: Record<string, unknown>) => (saveUser(values))}
      >
        <FormikForm>
          <Input type="text" name="name"/>
          <MemberSince user={user}/>
          <span>Badges</span>
          <div><i>None yet! Check back soon!</i></div>
          <hr/>
          <span>Bio</span>
          <Input type="textarea" name="bio"/>
          <hr/>
          <span>Enjoys Playing</span>
          <hr/>
          <span>Actively Seeking Group For</span>
          <hr/>
          <span>Remove from Player Directory</span>
          <Checkbox name="isPrivate" value="true"/>
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
function OtherOptions({ user }: { user: User }) {
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
function OtherDetails({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.displayName}</h1>
      <MemberSince user={user}/>
      <Badges user={user}/>

      {/* { user.bio ? (<>
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
      </>) : null } */}
    </div>
  );
}

/**
 * Renders a recently played with user
 * @param player The recently played with user.
 */
function RecentPlayer({ player }: { player: User }) {
  let src = "";
  if (player.avatarSrc) { src = player.avatarSrc; }
  return (
    <div>
      <Link href={`/profile/${player.username}`}>
        <a>
          <img width="30px" height="30px" src={src}/>
          <span style={{paddingLeft: "10px"}}>{player.displayName || player.username}</span>
        </a>
      </Link>
    </div>
  );
}

interface ProfileImageProps {
  isMyPage: boolean;
  user: User;
}

/**
 * Renders the Profile image and any modification tools
 * @param user The current user
 * @param setUser Sets the user object to update information
 * @param isMyPage True if this is the current user's page
 */
const Avatar = observer(({ user, isMyPage }: ProfileImageProps) => {

  let image = <img src={user.avatarSrc || ""} width="200px" height="200px"/>;

  async function onSubmit(fileDocument: Partial<FileDocument>, method: AssetUploadSource) {
    // await UserData.updateAvatar(user.ref, fileDocument, method);
  }

  if (isMyPage) {
    image = (
     <ImageSelectionWrapper onSubmit={onSubmit}>
        {image}
      </ImageSelectionWrapper>
    );
  }

  return (
    <div>
      {image}
      <hr/>
    </div>
  );
});

/**
 * Renders a user's profile page.
 * @param props.success True if the request succeeded. False otherwise
 * @param props.data Contains the user's profile information
 * @param props.message A message, if any, explaining the success value
 * @param props.session The current user's session, if any
 */
function Profile(): JSX.Element {
  const router = useRouter();
  const username = router.query.username as string | undefined;

  const user: User = {} as any;
  const isMyPage = calculateIfUserIsOwner();

  const [ players, setPlayers ] = React.useState<User[]>([]);

  /**
   * Determines if the current player is the owner of the profile page.
   * Required to catch issue where unlogged players would cause an issue with the logic
   */
  function calculateIfUserIsOwner() {
    if (!Auth.isLoggedIn) { return false; }
    if (user && Auth.user?.id === user.id) { return true; }
    return false;
  }

  /**
   * A callback function that handles saving the user's information to the database
   * @param values The user document values to save to the database
   */
  async function saveUser(values: Record<string, unknown>) {

    // TODO - save
  }

  if (!user) { return <Page><Loading/></Page>; }

  return (
    <Page>
      <div className="row">
        <div className="col-12 col-md-4">
          <Avatar
            user={user}
            isMyPage={isMyPage}
          />
          { isMyPage ? <MyOptions user={user} players={players}/> : <OtherOptions user={user}/>}
        </div>

        <div className="col-12 col-md-8">
          { isMyPage ? <MyDetails user={user} saveUser={saveUser}/> : <OtherDetails user={user}/> }
        </div>
      </div>
    </Page>
  );
}



export default observer(Profile);
