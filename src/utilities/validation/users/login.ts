import * as Yup from "yup";

/** Validation for the login form */
export const loginFormValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Required"),
  password: Yup.string()
    .required("Required"),
});
