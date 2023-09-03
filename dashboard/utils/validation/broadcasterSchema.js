import * as Yup from "yup";

export const CreateBroadcasterSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is Required")
    .matches(/^[a-zA-Z0-9-\s]+$/, "Name should not contain special characters")
    .matches(/^[a-zA-Z-\s]+$/, " Name should contain alphabets only"),
  email: Yup.string()
    .required("Email is Required")
    .email("Must be a valid email"),
});

export const EditBroadcasterSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is Required")
    .matches(/^[a-zA-Z0-9-\s]+$/, "Name should not contain special characters")
    .matches(/^[a-zA-Z-\s]+$/, " Name should contain alphabets only"),
  email: Yup.string()
    .required("Email is Required")
    .email("Must be a valid email"),
});
