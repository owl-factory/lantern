import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useRouter } from "next/router";
import { emailLogin } from "../../utilities/auth";
import LoginForm2 from "./LoginForm";

interface ISetState {
  setState?: (section: object) => void;
}

/**
 * Renders an authentication card
 * @param props Contains the session
 */
function AuthenticationCard(props: any) {
  let section = "login";
  if (props.section !== undefined) {
    section = props.section;
  }

  const [state, setState] = useState({ "section": section });

  let cardBody: JSX.Element = <LoginForm />;
  switch (state.section) {
    case "login":
      cardBody = <LoginForm  />;
      break;
    case "signup":
      cardBody = <SignUpForm  />;
      break;
    case "forgotpassword":
      cardBody = <ForgotPasswordForm  />;
      break;
    default:
      cardBody = <LoginForm  />;
      break;
  }

  return (
    <Card>
      <Card.Body>
        {cardBody}
      </Card.Body>
    </Card>
  );
}

/**
 * Renders the login view
 * @param props Contains the setState function for swapping auth views
 */
function LoginForm(props: any) {

  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  function submitLogin() {
    emailLogin(user, pass)
      .then(() => {router.push(router.pathname)});
  }

  return (
    <Card.Body>
      <h5>Login</h5>
      <Button variant="secondary">
        Google Login
      </Button>

      <LoginForm2/>

      {/* <Form>
        <Form.Label>Username</Form.Label>
        <Form.Control id="username" value={user} onChange={(event) => { setUser(event.target.value) }} />
        <Form.Label>Password</Form.Label>
        <Form.Control id="password" value={pass} onChange={(event) => { setPass(event.target.value) }} />
        <br /><br />
        <Button color="primary" onClick={submitLogin}>Log In</Button>
        <br />
        <SignUpLink setState={props.setState} />
        <ForgotPasswordLink setState={props.setState} />
      </Form> */}
    </Card.Body>
  );
}

/**
 * Renders the sign up form view
 * @param props Contains the setState function for swapping auth views
 */
function SignUpForm(props: any) {
  return (
    <Card.Body>
      <h5>Sign Up</h5>

      <Form>
        <Form.Label>Username</Form.Label>
        <Form.Control id="username" />
        <Form.Label>Email</Form.Label>
        <Form.Control id="email" />
        <Form.Label>Password</Form.Label>
        <Form.Control id="password" />
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control id="confirm-password" type="confirm-password" />
        <br /><br />
        <Card>
          <Button type="submit">Sign Up</Button>
        </Card><br />

        <LoginLink setState={props.setState} />
        <ForgotPasswordLink setState={props.setState} />
      </Form>
    </Card.Body>
  );
}

/**
 * Renders the forgot password form
 * @param props Contains the setState function for swapping auth views
 */
function ForgotPasswordForm(props: any) {
  return (
    <Card.Body>
      <h5>Sign Up</h5>

      <Form.Label>Email</Form.Label>
      <Form.Control id="email" />

      <br /><br />
      <Card>
        <Button type="submit" color="primary">Recover Account</Button>
      </Card><br />
      <LoginLink setState={props.setState} />
      <SignUpLink setState={props.setState} />
    </Card.Body>
  );
}

/**
 * Creates a button to switch to the login view
 * @param props Contains the setState function for swapping auth views
 */
function LoginLink(props: ISetState) {
  return (
    <Button onClick={() => (props.setState({ section: "login" }))}>Log In</Button>
  );
}

/**
 * Creates a button to switch to the sign up view
 * @param props Contains the setState function for swapping auth views
 */
function SignUpLink(props: ISetState) {
  return (
    <Button onClick={() => (props.setState({ section: "signup" }))}>Sign Up</Button>
  );
}

/**
 * Creates a button to switch to the forgot password view
 * @param props Contains the setState function for swapping auth views
 */
function ForgotPasswordLink(props: ISetState) {
  return (
    <Button onClick={() => (props.setState({ section: "forgotpassword" }))}>Forgot Password</Button>
  );
}

export default AuthenticationCard;
