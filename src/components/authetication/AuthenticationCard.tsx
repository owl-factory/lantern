import { Box, Button, Card, CardContent, TextField, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

interface ISetState {
  setState: (section: object) => void;
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

  const [state, setState] = React.useState({"section": section});

  let cardContent: JSX.Element = <LoginForm/>;
  switch (state.section) {
    case "login":
      cardContent = <LoginForm setSession={props.setSession} setState={setState}/>;
      break;
    case "signup":
      cardContent = <SignUpForm setState={setState}/>;
      break;
    case "forgotpassword":
      cardContent = <ForgotPasswordForm setState={setState}/>;
      break;
    default:
      cardContent = <LoginForm setState={setState}/>;
      break;
  }

  return (
    <Card>
      { cardContent }
    </Card>
  );
}

/**
 * Renders the login view
 * @param props Contains the setState function for swapping auth views
 */
function LoginForm(props: any) {
  return (
    <CardContent>
      <Typography variant="h5">Login</Typography>
      <Button
        variant="contained"
        onClick={() => {props.setSession({"user": {isLoggedIn: true}});}}
      >
        Google Login
      </Button>

      <form noValidate>
        <TextField id="username" label="Username" variant="outlined" fullWidth margin="normal"/>
        <TextField id="password" label="Password" type="password" variant="outlined" fullWidth margin="normal"/>
        <br/><br/>
        <Box>
          <Button variant="contained" type="submit" color="primary">Log In</Button>
        </Box><br/>

        <SignUpLink setState={props.setState}/>
        <ForgotPasswordLink setState={props.setState}/>
      </form>
    </CardContent>
  );
}

/**
 * Renders the sign up form view
 * @param props Contains the setState function for swapping auth views
 */
function SignUpForm(props: any) {
  return (
    <CardContent>
      <Typography variant="h5">Sign Up</Typography>

      <form noValidate>
        <TextField id="username" label="Username" variant="outlined" fullWidth margin="normal"/>
        <TextField id="email" label="Email" variant="outlined" fullWidth margin="normal"/>
        <TextField id="password" label="Password" type="password" variant="outlined" fullWidth margin="normal"/>
        <TextField
          id="confirm-password"
          label="Confirm Password"
          type="confirm-password"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <br/><br/>
        <Box>
          <Button variant="contained" type="submit" color="primary">Sign Up</Button>
        </Box><br/>

        <LoginLink setState={props.setState}/>
        <ForgotPasswordLink setState={props.setState}/>
      </form>
    </CardContent>
  );
}

/**
 * Renders the forgot password form
 * @param props Contains the setState function for swapping auth views
 */
function ForgotPasswordForm(props: any) {
  return (
    <CardContent>
      <Typography variant="h5">Sign Up</Typography>

      <TextField id="email" label="Email" variant="outlined" fullWidth margin="normal"/>

      <br/><br/>
      <Box>
        <Button variant="contained" type="submit" color="primary">Recover Account</Button>
      </Box><br/>
      <LoginLink setState={props.setState}/>
      <SignUpLink setState={props.setState}/>
    </CardContent>
  );
}

/**
 * Creates a button to switch to the login view
 * @param props Contains the setState function for swapping auth views
 */
function LoginLink(props: ISetState) {
  return (
    <Button variant="text" onClick={() => (props.setState({section: "login"}))}>Log In</Button>
  );
}

/**
 * Creates a button to switch to the sign up view
 * @param props Contains the setState function for swapping auth views
 */
function SignUpLink(props: ISetState) {
  return (
    <Button variant="text" onClick={() => (props.setState({section: "signup"}))}>Sign Up</Button>
  );
}

/**
 * Creates a button to switch to the forgot password view
 * @param props Contains the setState function for swapping auth views
 */
function ForgotPasswordLink(props: ISetState) {
  return (
    <Button variant="text" onClick={() => (props.setState({section: "forgotpassword"}))}>Forgot Password</Button>
  );
}

// TODO - create a full style component for global styles
const useStyles = makeStyles((theme: Theme) => ({
  floatCenter: {
    display: "inline-block",
    textAlign: "center",
  },
}));

export default AuthenticationCard;
