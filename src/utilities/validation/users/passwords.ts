import * as Yup from "yup";

export const passwordFormValidationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("The old password is required to change your password"),
  newPassword: Yup.string()
    .min(6, "The new password must be at least six characters long")
    .max(64, "The maxmimum supported length for passwords is 64 characters")
    .notOneOf([Yup.ref('oldPassword')], "New password cannot be the same as the old password")
    .required("Required"),
  newPasswordConfirmation: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], "Passwords must match"),
});
