import * as Yup from "yup";
import { passwordValidation } from "./components";

export const passwordFormValidationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("The old password is required to change your password"),
  newPassword:
    passwordValidation
    .notOneOf([Yup.ref('oldPassword')], "New password cannot be the same as the old password"),
  newPasswordConfirmation: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], "Passwords must match"),
});
