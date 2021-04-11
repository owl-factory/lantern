import React, { ReactNode, useState } from "react";
import { Button, Card } from "react-bootstrap";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignupForm";

interface AuthenticationCardProps {
  initialState?: AuthCardSection;
}

interface AuthCardSectionProps {
  setSection: React.Dispatch<React.SetStateAction<AuthCardSection>>;
}

export enum AuthCardSection {
  login, signup, forgotPassword
}

/**
 * Renders an authentication card
 * @param props Contains the session
 */
function AuthenticationCard(props: AuthenticationCardProps): JSX.Element {
  const [section, setSection] = useState(props.initialState || AuthCardSection.login);

  let cardBody: ReactNode;
  switch (section) {
    case AuthCardSection.signup:
      cardBody = <SignUpSection setSection={setSection} />;
      break;
    case AuthCardSection.forgotPassword:
      cardBody = <ForgotPasswordSection setSection={setSection} />;
      break;
    case AuthCardSection.login:
      cardBody = <LoginSection setSection={setSection}/>;
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
function LoginSection(props: AuthCardSectionProps) {
  return (
    <>
      <h5>Login</h5>
      <SignInForm />
      <Button onClick={() => props.setSection(AuthCardSection.signup)}>Sign Up</Button>
      <Button onClick={() => props.setSection(AuthCardSection.forgotPassword)}>Forgot Password</Button>
    </>
  );
}

/**
 * Renders the sign up form view
 * @param props Contains the setState function for swapping auth views
 */
function SignUpSection(props: AuthCardSectionProps) {
  return (
    <>
      <h5>Sign Up</h5>
      <SignUpForm />
      <Button onClick={() => props.setSection(AuthCardSection.login)}>Back</Button>
    </>
  );
}

/**
 * Renders the forgot password form
 * @param props Contains the setState function for swapping auth views
 */
function ForgotPasswordSection(props: AuthCardSectionProps) {
  return (
    <>
      <h5>Forgot Password</h5>
      <Button onClick={() => props.setSection(AuthCardSection.login)}>Back</Button>
    </>
  );
}

export default AuthenticationCard;
