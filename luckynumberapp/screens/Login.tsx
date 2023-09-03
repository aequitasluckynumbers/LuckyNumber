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
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import colors from "../utils/colors";
import global from "../styles/global";
import { useFonts } from "expo-font";
import Navbar from "../components/Navbar";
import Line from "../assets/images/Line.png";

import { supabase } from "../lib/supabase";
import { LoginSchema } from "../utils/validations/loginSchema";
import { showToast } from "../lib/toast";
import { BG_COLORS, COUNTRY, LOGIN } from "../utils/constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { Countries, Country } from "../utils/countries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingPopup from "../popups/LoadingPopup";
import { LinearGradient } from "expo-linear-gradient";

interface FormValues {
  countryCode: string;
  phoneNumber: string;
}

type LoginProps = NativeStackScreenProps<RootStackParamsList, "Login">;

const Login = ({ navigation, route }: LoginProps) => {
  let [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });
  // const initialValues: FormValues = ;
  const [loadingPopup, setLoadingPopup] = useState(false);

  const [initialValues, setInitialValues] = useState<FormValues>({
    countryCode: "+91",
    phoneNumber: "",
  });

  async function getCountry() {
    // console.log(route.params);

    const selectedCountry = await AsyncStorage.getItem(COUNTRY);

    const country: Country[] = Countries.filter((c) => {
      if (c.name === selectedCountry) {
        return c;
      }
    });
    const newInitialValues = { ...initialValues };
    newInitialValues.countryCode = country[0].code;
    console.log(newInitialValues);
    setInitialValues(newInitialValues);
  }

  useEffect(() => {
    getCountry();
  }, []);

  const handleOnSubmit = async ({ countryCode, phoneNumber }: FormValues) => {
    setLoadingPopup(true);
    const phone: string = countryCode + phoneNumber;
    console.log(phone);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
      options: {
        shouldCreateUser: false,
      },
    });
    if (error) {
      console.log(error.message);
      if (error.message === "Signups not allowed for otp") {
        setLoadingPopup(false);
        showToast("Please SignUp First");
        return;
      }
      showToast("failed to send otp");
      setLoadingPopup(false);
      return;
    }
    navigation.navigate("Otp", {
      authType: LOGIN,
      phoneNo: phone,
      user: null,
    });
    setTimeout(() => {
      setLoadingPopup(false);
    }, 1000);
  };

  if (loaded) {
    return (
      <>
        {loadingPopup && (
          <LoadingPopup
            setLoadingPopup={setLoadingPopup}
            message="Sending OTP"
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
                initialValues={initialValues}
                onSubmit={(values: FormValues) => {
                  handleOnSubmit(values);
                }}
                validationSchema={LoginSchema}
                enableReinitialize={true}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                }) => (
                  <View
                    style={{
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <View>
                      <View style={styles.formLabelContainer}>
                        <Text style={styles.formLabel}>Phone</Text>
                        {errors.phoneNumber && (
                          <Text style={styles.errorMsg}>
                            {errors.phoneNumber}
                          </Text>
                        )}
                        {/* <Text style={styles.errorMsg}>{errors.phoneNumber}</Text> */}
                      </View>
                      <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
                        <TextInput
                          placeholder="+91"
                          value={values.countryCode}
                          style={styles.inputText}
                          editable={false}
                          placeholderTextColor="white"
                        />
                        <View style={{ flex: 1 }}>
                          <TextInput
                            placeholder="Mobile Number"
                            maxLength={10}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onChangeText={handleChange("phoneNumber")}
                            onBlur={handleBlur("phonenumber")}
                            style={styles.inputText}
                            placeholderTextColor="white"
                          />
                        </View>
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
                          SEND OTP
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
};

// const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  formLabel: {
    marginTop: windowHeight * 0.02,
    fontFamily: "MontserratBold",
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "800",
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
    marginTop: windowHeight * 0.015,
    height: windowHeight * 0.055,
    backgroundColor: "#311951",
    padding: 10,
    borderRadius: 4,
    color: "white",
    fontFamily: "MontserratBold",
  },
  formButton: {
    height: windowHeight * 0.07,
    fontFamily: "Montserrat",
  },
  borderImage: {
    marginBottom: windowHeight * 0.03,
    alignSelf: "center",
  },
});

export default Login;
