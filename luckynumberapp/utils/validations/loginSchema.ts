import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  phoneNumber: Yup.number()
    .required("Phone number is Required")
    .positive()
    .test(
      "len",
      "Must be exactly 10 numbers",
      val => val.toString().length === 10,
    )
    .typeError("Phone number must be numeric"),
});
