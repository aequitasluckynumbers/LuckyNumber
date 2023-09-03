import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Formik } from "formik";
import colors from "../utils/colors";
import global from "../styles/global";
import Navbar from "../components/Navbar";
import Line from "../assets/images/Line.png";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { BG_COLORS, LOGIN, OAUTH_SIGNUP, SIGNUP } from "../utils/constants";
import { showToast } from "../lib/toast";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import LoadingPopup from "../popups/LoadingPopup";

type OtpProps = NativeStackScreenProps<RootStackParamsList, "Otp">;

const Otp = ({ navigation, route }: OtpProps) => {
  let [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  const [timer, setTimer] = useState(59);
  const [loadingPopup, setLoadingPopup] = useState(false);

  const user = route.params?.user;
  const authType: string = route.params?.authType;
  const phoneNo: string = route.params?.phoneNo;

  const handleOnSubmit = async (otp: string) => {
    setLoadingPopup(true)
    if (authType === SIGNUP) {
      const phoneNumber = user.countryCode + user.phoneNumber;
      // const token = parseInt(otp);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: "sms",
      });

      if (error) {
        console.log(error);
        if (error.message === "Token has expired or is invalid") {
          showToast("Invalid OTP");
          setLoadingPopup(false)
          return;
        }
        if (error.message) {
          showToast(error.message);
          setLoadingPopup(false)
          return;
        }
        setLoadingPopup(false)
        showToast("Invalid OTP");
        return;
      }
      console.log(data);

      if (!user) {
        setLoadingPopup(false);
        showToast("Failed to create account.");

        // clear session
        await supabase.auth.signOut();

        return;
      }
      // verification successfull
      // update user with email // for further signup process
      const updatedUser = await supabase.auth.updateUser({
        email: user.email,
      });
      if (updatedUser.error) {
        console.log(updatedUser.error);
        // clear session
        await supabase.auth.signOut();

        if (updatedUser.error.message) {
          showToast(updatedUser.error.message);
          setLoadingPopup(false)
          return;
        }
        setLoadingPopup(false)
        showToast("Failed to create account. Contact Admin");
        return;
      }

      // create a public user
      const createUserRes = await supabase.from("users").upsert({
        id: data.user!!.id,
        is_complete: true,
        lname: user.lname,
        fname: user.fname,
        gender: user.gender || "Male",
        dob: user.dob,
        street: user.street,
        city: user.city,
        zipcode: user.zipCode,
        country: user.country,
        email: user.email,
        phone: phoneNumber,
      });
      //TODO: add email and phone also

      console.log(createUserRes);

      if (createUserRes.error) {
        // clear session
        await supabase.auth.signOut();
        setLoadingPopup(false)
        showToast("Failed to create account. ");
        return;
      }

      // pop All BackStack
      setLoadingPopup(false)
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else if (authType === LOGIN) {
      let { error } = await supabase.auth.verifyOtp({
        phone: phoneNo,
        token: otp,
        type: "sms",
      });

      if (error) {
        setLoadingPopup(false)
        console.log(error);
        showToast("Failed to Login");
        return;
      }

      setLoadingPopup(false)
      // pop All BackStack
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else if (authType === OAUTH_SIGNUP) {
      const phoneNumber = user.countryCode + user.phoneNumber;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: "phone_change",
      });

      console.log(data);

      if (error) {
        setLoadingPopup(false)
        console.log(error);
        showToast("Invalid OTP");
        // clear session
        await supabase.auth.signOut();
        return;
      }

      // create a public user
      const createUserRes = await supabase.from("users").upsert({
        id: data.user!!.id,
        is_complete: true,
        fname: user.fname,
        lname: user.lname,
        gender: user.gender || "male",
        dob: user.dob,
        street: user.street,
        city: user.city,
        zipcode: user.zipCode,
        country: user.country,
        phone: phoneNumber,
        email: user.email,
      });

      console.log(createUserRes);

      if (createUserRes.error) {
        setLoadingPopup(false)
        if (createUserRes.error.message) {
          showToast(createUserRes.error.message);
          return;
        }
        showToast("Failed to create account. Contact Admin");
        // clear session
        await supabase.auth.signOut();
        return;
      }

      // pop All BackStack
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  };

  const handleResendOTP = async () => {
    if (authType === SIGNUP) {
      const phoneNumber = user.countryCode + user.phoneNumber;
      console.log(phoneNo);
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.log(error);
        if (error.message) {
          showToast(error.message);
          return;
        }
        showToast("failed to send otp");
        return;
      }
      showToast("OTP Sent Successfully");
    } else if (authType === LOGIN) {
      // const phoneNumber = user.countryCode + user.phoneNumber;

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNo,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        console.log(error);
        if (error.message) {
          showToast(error.message);
          return;
        }
        showToast("failed to send otp");
        return;
      }
      showToast("OTP Sent Successfully");
    }

    setTimer(59);
  };

  useEffect(() => {
    if (timer > 0) {
      let otpTimer = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => {
        clearTimeout(otpTimer);
      };
    }
  });

  if (loaded) {
    return (
      <>
        {loadingPopup && (
          <LoadingPopup
            setLoadingPopup={setLoadingPopup}
            message="Verifying OTP"
          />
        )}
        <LinearGradient colors={BG_COLORS} style={global.bg}>
          <SafeAreaView style={{ flexGrow: 1 }}>
            <View
              style={[
                global.container,
                {
                  flex: 1,
                  marginVertical: 0,
                  marginHorizontal: windowHeight * 0.04,
                },
              ]}
            >
              <Navbar navigation={navigation} />
              <Formik
                initialValues={{
                  otp: "",
                }}
                onSubmit={async (values) => {
                  handleOnSubmit(values.otp);
                }}
              >
                {({ setFieldValue, handleBlur, handleSubmit }) => (
                  <View style={{ justifyContent: "space-between", flex: 1 }}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.formLabel}>OTP</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {timer > 0 && (
                            <>
                              <Text style={styles.subTitle}>Resend in </Text>
                              <Text style={styles.formLabel}>00:{timer}</Text>
                            </>
                          )}
                          {timer == 0 && (
                            <>
                              <TouchableOpacity onPress={() => handleResendOTP()}>
                                <Text style={styles.subTitle}>Resend OTP</Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <TextInput
                          placeholder="OTP"
                          maxLength={6}
                          keyboardType="numeric"
                          returnKeyType="done"
                          onBlur={handleBlur("otp")}
                          onChangeText={(e) => setFieldValue("otp", e.trim())}
                          style={styles.inputText}
                          placeholderTextColor="white"
                        />
                      </View>
                    </View>
                    <View>
                      <Image
                        source={Line}
                        style={[styles.borderImage, { width: "99%" }]}
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
                          NEXT
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </>
    );
  }
  return null;
};

// const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  subTitle: {
    color: "white",
    marginTop: windowHeight * 0.032,
    fontWeight: "500",
  },
  formLabel: {
    marginTop: windowHeight * 0.03,
    fontFamily: "MontserratBold",
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "800",
    color: "#FFB3FF",
    textTransform: "uppercase",
  },
  inputText: {
    marginTop: windowHeight * 0.015,
    height: windowHeight * 0.055,
    backgroundColor: "#311951",
    padding: 10,
    borderRadius: 4,
    color: "white",
    fontFamily: "MontserratBold",
  },
  dottedBorder: {
    marginBottom: windowHeight * 0.06,
    borderBottomWidth: 1.5,
    borderStyle: "dashed",
    borderBottomColor: "#BFA7F2",
  },
  formButton: {
    height: windowHeight * 0.07,
    fontFamily: "MontserratBold",
  },
  borderImage: {
    marginBottom: windowHeight * 0.03,
    alignSelf: "center",
  },
});

export default Otp;
