import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  fname: Yup.string()
    .required("First Name is Required")
    .test(
      "len",
      "First Name must be less than 25 charactes",
      (val) => val.toString().length < 26
    )
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "First Name should not contain special characters"
    )
    .matches(/^[a-zA-Z\s]+$/, "First Name should contain alphabets only"),
  lname: Yup.string()
    .required("Last Name is Required")
    .test(
      "len",
      "Last Name must be less than 25 charactes",
      (val) => val.toString().length < 26
    )
    .matches(
      /^[a-zA-Z0-9-\s]+$/,
      "Last Name should not contain special characters"
    )
    .matches(/^[a-zA-Z-\s]+$/, "Last Name should contain alphabets only"),
  email: Yup.string()
    .required("Email is Required")
    .email("Must be a valid email"),
  dobDay: Yup.number()
    .required("Day of Birth is Required")
    .positive()
    .max(31, "Day should be less than 31"),
  dobMonth: Yup.number()
    .required("Month of Birth is Required")
    .positive()
    .max(12, "Invalid Month"),
  dobYear: Yup.number()
    .required("Year of Birth is Required")
    .positive()
    .min(1900, "Year should be greater than 1900")
    .max(2023, "Year should be less than 2024"),
  phoneNumber: Yup.number()
    .required("Phone number is Required")
    .positive()
    .test(
      "len",
      "Must be exactly 10 numbers",
      (val) => val.toString().length === 10
    )
    .typeError("Phone number must be numeric"),
  street: Yup.string()
    .required("Street is Required")
    .matches(
      /^[a-zA-Z0-9\s,-]+$/,
      "Street should not contain special characters"
    ),
  city: Yup.string()
    .required("City is Required")
    .matches(/^[a-zA-Z0-9\s]+$/, "City should not contain special characters")
    .matches(/^[a-zA-Z]+$/, "City should contain alphabets only"),
  zipCode: Yup.string()
    .required("Zip code is required")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Zip Code should not contain special characters"
    )
    .typeError("Zip Code must be numeric")
    .test(
      "len",
      "Zip Code can be maximum 10 numbers",
      (val) => val.toString().length < 10
    )
    .required("Zip Code is Required"),
  country: Yup.string()
    .required("Country is Required")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Country should not contain special characters"
    )
    .matches(/^[a-zA-Z]+$/, "Country should contain alphabets only"),
});
