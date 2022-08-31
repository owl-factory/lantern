import * as Yup from "yup";
import { passwordValidation, usernameValidation } from "./components";

/** Validation for the Sign Up form */
export const signUpValidationSchema = Yup.object({
  username: usernameValidation,
  email: Yup.string()
    .required("Required")
    .email("Must be a valid email"),
  password: passwordValidation,
});
