// The inputs required for creating a new user account via email, username, and password
export interface PasswordSignUpInput {
  username: string; // The user's desired username
  email: string; // The user's email. TODO - add a confirmation?
  password: string; // The user's desired password
  passwordConfirmation: string // The confirmation of the user's desired password
}
