/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SignupSchema } from "../utils/validations/signupSchema";

import "react-native-url-polyfill/auto";
import { Formik } from "formik";
import colors from "../utils/colors";
import bgimg from "../assets/bgimg.png";
import global from "../styles/global";
import { useFonts } from "expo-font";
import Navbar from "../components/Navbar";
import Line from "../assets/images/Line.png";
import { supabase } from "../lib/supabase";
import { showToast } from "../lib/toast";
import { COUNTRY, OAUTH_SIGNUP, SIGNUP } from "../utils/constants";
import { Countries, Country } from "../utils/countries";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GenderPicker from "../components/GenderPicker";
import moment from "moment";
import LoadingPopup from "../popups/LoadingPopup";

interface SignUpFormValues {
  fname: string;
  lname: string;
  countryCode: string;
  phoneNumber: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  dob: string;
  email: string;
  gender: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

type SignUpProps = NativeStackScreenProps<RootStackParamsList, "SignUp">;

const SignUp = ({ navigation, route }: SignUpProps) => {
  const [] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  const [genderPicker, setGenderPicker] = useState(false);
  const [loadingPopup, setLoadingPopup] = useState(false);
  // const [countryCode, setCountryCode] = useState("+44");
  const dobMonthRef = useRef<TextInput>(null);
  const dobYearRef = useRef<TextInput>(null);

  const [initialFormValues, setInitialFormValues] = useState<SignUpFormValues>({
    fname: "",
    lname: "",
    countryCode: "",
    phoneNumber: "",
    email: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    dob: "",
    gender: "Male",
    street: "",
    city: "",
    zipCode: "",
    country: "",
  });

  async function getCountry() {
    // console.log(route.params);

    const selectedCountry = await AsyncStorage.getItem(COUNTRY);

    const country: Country[] = Countries.filter((c) => {
      if (c.name === selectedCountry) {
        return c;
      }
    });
    const newInitialValues = { ...initialFormValues };
    newInitialValues.countryCode = country[0].code;
    newInitialValues.country = country[0].name;
    console.log(newInitialValues);
    setInitialFormValues(newInitialValues);
  }

  const handleOnSubmit = async (values: SignUpFormValues) => {
    setLoadingPopup(true);

    if (moment(`${values.dobYear}-01-01`) < moment().subtract(100, "years")) {
      showToast("Invalid Date of Birth");
      setLoadingPopup(false);
      return;
    }

    const dob = `${values.dobYear}-${String(values.dobMonth).padStart(
      2,
      "0"
    )}-${String(values.dobDay).padStart(2, "0")}`;
    console.log({ dob });

    if (!moment(dob, "YYYY-MM-DD").isValid()) {
      showToast("Invalid Date of Birth");
      setLoadingPopup(false);
      return;
    }

    values.dob = dob;
    if (route.params?.authType === SIGNUP) {
      // signup with phone number
      const phoneNumber = values.countryCode + values.phoneNumber;
      console.log(phoneNumber);

      // check if phone no is exist
      const isPhoneExists = await supabase
        .from("users")
        .select("*")
        .eq("phone", phoneNumber);
      console.log(isPhoneExists);
      if (isPhoneExists.data?.length !== 0) {
        showToast("Phone Number already exists");
        setLoadingPopup(false);

        return;
      }

      const isEmailExists = await supabase
        .from("users")
        .select("*")
        .eq("email", values.email);

      if (isEmailExists.data?.length !== 0) {
        showToast("Email already exists");
        setLoadingPopup(false);

        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) {
        console.log(error);
        showToast("Failed to send the OTP");
        setLoadingPopup(false);
        return;
      }
      let user = values;
      navigation.navigate("Otp", {
        user: user,
        authType: SIGNUP,
        phoneNo: user.phoneNumber,
      });
      setTimeout(() => {
        setLoadingPopup(false);
      }, 1000);
    } else if (route.params?.authType === OAUTH_SIGNUP) {
      const phoneNumber = values.countryCode + values.phoneNumber;

      // send verification code on phone to verify phone first
      const { error, data } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) {
        console.log(error.message);
        if (error.message === "Signups not allowed for otp") {
          setLoadingPopup(false);
          showToast("Please SignUp First");
          return;
        }
        showToast("Failed to send the OTP");
        setLoadingPopup(false);
        return;
      }
      let user = values;
      console.log({ user: user });
      console.log(data, error);

      // navigate to OTP screen with all user details
      navigation.navigate("Otp", {
        user: user,
        authType: OAUTH_SIGNUP,
        phoneNo: user.phoneNumber,
      });
      setTimeout(() => {
        setLoadingPopup(false);
      }, 1000);
    }
  };

  useEffect(() => {
    console.log(loadingPopup);
    getCountry();
  }, []);

  return (
    <>
      {loadingPopup && (
        <LoadingPopup setLoadingPopup={setLoadingPopup} message="Sending OTP" />
      )}
      <ImageBackground source={bgimg}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <SafeAreaView style={{ flexGrow: 1 }}>
            <ScrollView>
              <View
                style={[
                  global.container,
                  { marginVertical: 0, marginHorizontal: windowHeight * 0.04 },
                ]}
              >
                <Navbar navigation={navigation} />
                <Formik
                  initialValues={initialFormValues}
                  validationSchema={SignupSchema}
                  onSubmit={(values) => handleOnSubmit(values)}
                  enableReinitialize={true}
                >
                  {({
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                    values,
                    touched,
                    errors,
                  }) => (
                    <View style={[styles.formLabel, { marginTop: 0 }]}>
                      <View style={styles.formLabelContainer}>
                        <Text style={styles.formLabel}>Name</Text>
                        {errors.fname && touched.fname && (
                          <Text style={styles.errorMsg}>{errors.fname}</Text>
                        )}
                        {errors.fname === undefined &&
                          errors.lname &&
                          touched.lname && (
                            <Text style={styles.errorMsg}>{errors.lname}</Text>
                          )}
                      </View>
                      <TextInput
                        placeholder="First Name"
                        onBlur={handleBlur("fname")}
                        style={styles.inputText}
                        placeholderTextColor="white"
                        onChangeText={(e) => setFieldValue("fname", e.trim())}
                      />
                      <TextInput
                        placeholder="Last Name"
                        onBlur={handleBlur("lname")}
                        style={styles.inputText}
                        placeholderTextColor="white"
                        onChangeText={(e) => {
                          setFieldValue("lname", e.trim());
                        }}
                      />
                      <View style={styles.formLabelContainer}>
                        <Text style={styles.formLabel}>Date of Birth</Text>
                        {errors.dobDay && touched.dobDay && (
                          <Text style={styles.errorMsg}>{errors.dobDay}</Text>
                        )}
                        {typeof errors.dobDay === "undefined" &&
                          errors.dobMonth &&
                          touched.dobMonth && (
                            <Text style={styles.errorMsg}>
                              {errors.dobMonth}
                            </Text>
                          )}
                        {typeof errors.dobDay === "undefined" &&
                          typeof errors.dobMonth === "undefined" &&
                          errors.dobYear &&
                          touched.dobYear && (
                            <Text style={styles.errorMsg}>
                              {errors.dobYear}
                            </Text>
                          )}
                      </View>
                      <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
                        <TextInput
                          keyboardType="numeric"
                          returnKeyType="done"
                          maxLength={2}
                          style={[styles.inputText, { minWidth: 50 }]}
                          placeholder="DD"
                          onBlur={handleBlur("dobDay")}
                          placeholderTextColor="white"
                          onChangeText={(e) => {
                            setFieldValue("dobDay", e.trim());
                            if (
                              e.length > 1 &&
                              dobMonthRef.current !== undefined
                            ) {
                              dobMonthRef?.current?.focus();
                            }
                          }}
                        />
                        <TextInput
                          keyboardType="numeric"
                          returnKeyType="done"
                          ref={dobMonthRef}
                          maxLength={2}
                          style={[styles.inputText, { minWidth: 50 }]}
                          placeholder="MM"
                          onBlur={handleBlur("dobMonth")}
                          placeholderTextColor="white"
                          onChangeText={(e) => {
                            setFieldValue("dobMonth", e.trim());
                            if (
                              e.length > 1 &&
                              dobYearRef.current !== undefined
                            ) {
                              dobYearRef?.current?.focus();
                            }
                          }}
                        />
                        <TextInput
                          keyboardType="numeric"
                          returnKeyType="done"
                          ref={dobYearRef}
                          maxLength={4}
                          style={[styles.inputText, { minWidth: 60 }]}
                          placeholder="YYYY"
                          onBlur={handleBlur("dobYear")}
                          placeholderTextColor="white"
                          onChangeText={(e) =>
                            setFieldValue("dobYear", e.trim())
                          }
                        />
                      </View>
                      <View style={styles.formLabelContainer}>
                        <Text style={styles.formLabel}>Email</Text>
                        {errors.email && touched.email && (
                          <Text style={styles.errorMsg}>{errors.email}</Text>
                        )}
                      </View>
                      <TextInput
                        placeholder="Email"
                        onChangeText={(e) => setFieldValue("email", e.trim())}
                        onBlur={handleBlur("email")}
                        style={styles.inputText}
                        placeholderTextColor="white"
                      />
                      <View style={styles.formLabelContainer}>
                        <Text style={styles.formLabel}>Phone</Text>
                        {errors.phoneNumber && touched.phoneNumber && (
                          <Text style={styles.errorMsg}>
                            {errors.phoneNumber}
                          </Text>
                        )}
                      </View>
                      <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
                        <TextInput
                          value={values.countryCode}
                          style={styles.inputText}
                          editable={false}
                        // placeholderTextColor="white"
                        />
                        <View style={{ flex: 1 }}>
                          <TextInput
                            maxLength={10}
                            keyboardType="numeric"
                            returnKeyType="done"
                            placeholder="Mobile Number"
                            onChangeText={handleChange("phoneNumber")}
                            onBlur={handleBlur("phoneNumber")}
                            style={styles.inputText}
                            placeholderTextColor="white"
                          />
                        </View>
                      </View>
                      <Text style={styles.formLabel}>Gender</Text>
                      <Text
                        onPress={() => setGenderPicker(!genderPicker)}
                        style={[styles.inputText, { justifyContent: "center" }]}
                      >
                        {genderPicker
                          ? "Select Gender"
                          : values.gender.charAt(0).toUpperCase() +
                          values.gender.slice(1)}
                      </Text>
                      {genderPicker && (
                        <GenderPicker
                          gender={values.gender}
                          setFieldValue={setFieldValue}
                          setGenderPicker={setGenderPicker}
                        />
                      )}
                      <View style={styles.formLabelContainer}>
                        <Text
                          onPress={() => console.log(errors)}
                          style={styles.formLabel}
                        >
                          Address
                        </Text>
                        {errors.street && touched.street && (
                          <Text style={styles.errorMsg}>{errors.street}</Text>
                        )}
                        {typeof errors.street === "undefined" &&
                          errors.city &&
                          touched.city && (
                            <Text style={styles.errorMsg}>{errors.city}</Text>
                          )}
                        {typeof errors.street === "undefined" &&
                          typeof errors.city === "undefined" &&
                          errors.zipCode &&
                          touched.zipCode && (
                            <Text style={styles.errorMsg}>
                              {errors.zipCode}
                            </Text>
                          )}
                        {typeof errors.street === "undefined" &&
                          typeof errors.city === "undefined" &&
                          typeof errors.zipCode === "undefined" &&
                          errors.country &&
                          touched.country && (
                            <Text style={styles.errorMsg}>
                              {errors.country}
                            </Text>
                          )}
                      </View>
                      <TextInput
                        placeholder="Street"
                        onChangeText={(e) => setFieldValue("street", e.trim())}
                        onBlur={handleBlur("street")}
                        style={styles.inputText}
                        placeholderTextColor="white"
                      />
                      <TextInput
                        placeholder="City"
                        onChangeText={(e) => setFieldValue("city", e.trim())}
                        onBlur={handleBlur("city")}
                        style={styles.inputText}
                        placeholderTextColor="white"
                      />
                      <TextInput
                        placeholder="Zip Code"
                        onChangeText={handleChange("zipCode")}
                        maxLength={10}
                        returnKeyType="done"
                        onBlur={handleBlur("zipCode")}
                        style={styles.inputText}
                        placeholderTextColor="white"
                      />
                      <TextInput
                        placeholder="Country"
                        onChangeText={handleChange("country")}
                        onBlur={handleBlur("country")}
                        style={styles.inputText}
                        value={
                          values.country.charAt(0).toUpperCase() +
                          values.country.slice(1)
                        }
                        placeholderTextColor="white"
                        editable={false}
                      />
                      <Image
                        source={Line}
                        style={[styles.borderImage, { width: "100%" }]}
                      />
                      <TouchableOpacity
                        onPress={() => handleSubmit()}
                        style={styles.formButton}
                      >
                        <Text
                          style={[
                            global.BigText,
                            { color: colors.pink, textAlign: "center" },
                          ]}
                        >
                          VERIFY PHONE
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Formik>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
};

// const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  formLabel: {
    marginTop: windowHeight * 0.03,
    fontFamily: "MontserratBold",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#FFB3FF",
    textTransform: "uppercase",
  },
  formLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorMsg: {
    marginTop: windowHeight * 0.02,
    fontFamily: "Montserrat",
    fontSize: 12,
    fontWeight: "800",
    color: "#EB5757",
  },
  inputText: {
    marginTop: windowHeight * 0.008,
    height: windowHeight * 0.055,
    backgroundColor: "#311951",
    padding: 10,
    borderRadius: 4,
    color: "white",
    alignItems: "center",
    fontFamily: "MontserratBold",
  },
  formButton: {
    marginBottom: windowHeight * 0.03,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 22,
    color: "#FFB3FF",
    lineHeight: 27,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  borderImage: {
    marginTop: windowHeight * 0.04,
    marginBottom: windowHeight * 0.04,
    alignSelf: "center",
  },
});

export default SignUp;
