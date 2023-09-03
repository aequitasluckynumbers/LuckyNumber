import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { Formik } from "formik";
import colors from "../utils/colors";
import bgimg from "../assets/bgimg.png";
import global from "../styles/global";
import { useFonts } from "expo-font";
import Navbar from "../components/Navbar";
import Line from "../assets/images/Line.png";
import "react-native-url-polyfill/auto";
import { supabase } from "../lib/supabase";
import { showToast } from "../lib/toast";
import { User } from "../types/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { ProfileSchema } from "../utils/validations/profileSchema";
import GenderPicker from "../components/GenderPicker";
import { BG_COLORS } from "../utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import LoadingPopup from "../popups/LoadingPopup";

type ProfileProps = NativeStackScreenProps<RootStackParamsList, "Profile">;

const Profile = ({ navigation }: ProfileProps) => {
  const [] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  const [userData, setUserData] = useState<User>();

  const [day, setDay] = useState("DD");
  const [month, setMonth] = useState("MM");
  const [year, setYear] = useState("YYYY");
  const [selectGender, setSelectedGender] = useState();
  const [genderPicker, setGenderPicker] = useState(false);
  const dobMonthRef = useRef<TextInput>(null);
  const dobYearRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchProfile = async () => {
    setLoading(true);
    const { data: sesssionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      return console.log(sessionError);
    }

    const { data, error: userError } = await supabase
      .from("users")
      .select()
      .eq("id", sesssionData.session!!.user.id);

    if (userError) {
      showToast("Failed to fetch Profile");
      return;
    }

    const user: User = data[0];
    const dob = user.dob?.split("-");

    // Use Typescript For type checking
    setUserData(user);
    console.log(dob);
    setDay(dob!![2]);
    setMonth(dob!![1]);
    setYear(dob!![0]);
    setSelectedGender(user?.gender);
    setLoading(false);
  };

  useEffect(() => {
    handleFetchProfile();
  }, []);

  const handleProfileUpdate = async (values: User) => {
    // console.log(values.dobYear);
    setLoading(true);

    const newUser: User = {
      city: values.city?.trim(),
      country: values.country?.trim(),
      fname: values.fname?.trim(),
      gender: values.gender,
      is_complete: values.is_complete,
      lname: values.lname?.trim(),
      street: values.street?.trim(),
      zipcode: values.zipcode,
      created_at: values.created_at,
      dob: values.dob,
      id: values.id,
    };

    newUser.dob = `${values.dobYear}-${values.dobMonth.length < 1 ? `0${values.dobMonth}` : values.dobMonth
      }-${values.dobDay.length < 1 ? `0${values.dobDay}` : values.dobDay}`;
    console.log(newUser);

    const { error } = await supabase
      .from("users")
      .update(newUser)
      .eq("id", userData?.id);

    if (error) {
      console.log(error);
      setLoading(false);
      showToast("Failed to update User!");
      return;
    }

    handleFetchProfile();
    showToast("User Updated!");
  };

  return (
    <>
      {loading && <LoadingPopup message="" />}
      <LinearGradient colors={BG_COLORS} style={global.bg}>
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
                <Text style={styles.heading}>Profile</Text>
                <View>
                  <Formik
                    initialValues={{
                      city: userData?.city ? userData.city : "",
                      country: userData?.country ? userData.country : "",
                      fname: userData?.fname ? userData.fname : "",
                      gender: userData?.gender ? userData.gender : "",
                      is_complete: userData?.is_complete
                        ? userData.is_complete
                        : false,
                      lname: userData?.lname ? userData.lname : "",
                      street: userData?.street ? userData.street : "",
                      zipcode: userData?.zipcode ? userData.zipcode : 0,
                      dobDay: day,
                      dobMonth: month,
                      dobYear: year,
                      created_at: userData?.created_at
                        ? userData.created_at
                        : "",
                      dob: userData?.dob ? userData.dob : "",
                      id: userData?.id ? userData.id : "",
                    }}
                    enableReinitialize={true}
                    validationSchema={ProfileSchema}
                    onSubmit={(values) => {
                      handleProfileUpdate(values);
                    }}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      setFieldValue,
                    }) => (
                      <View>
                        <View style={styles.formLabelContainer}>
                          <Text style={styles.formLabel}>Name</Text>
                          {errors.fname && touched.fname && (
                            <Text style={styles.errorMsg}>{errors.fname}</Text>
                          )}
                          {typeof errors.fname === "undefined" &&
                            errors.lname &&
                            touched.lname && (
                              <Text style={styles.errorMsg}>
                                {errors.lname}
                              </Text>
                            )}
                        </View>
                        <TextInput
                          placeholder="First Name"
                          onChangeText={(e) => setFieldValue("fname", e)}
                          onBlur={handleBlur("fname")}
                          style={styles.inputText}
                          value={values.fname}
                          placeholderTextColor="white"
                        />
                        <TextInput
                          placeholder="Last Name"
                          onChangeText={(e) => setFieldValue("lname", e)}
                          onBlur={handleBlur("lname")}
                          style={styles.inputText}
                          value={values.lname}
                          placeholderTextColor="white"
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
                        <View
                          style={{ flex: 1, flexDirection: "row", gap: 12 }}
                        >
                          <TextInput
                            keyboardType="numeric"
                            returnKeyType="done"
                            maxLength={2}
                            style={styles.inputText}
                            placeholder="DD"
                            value={values.dobDay}
                            onBlur={handleBlur("dobDay")}
                            placeholderTextColor="white"
                            onChangeText={(e) => {
                              setFieldValue("dobDay", e.trim());
                              if (
                                e.length > 1 &&
                                dobMonthRef.current != undefined
                              ) {
                                dobMonthRef.current.focus();
                              }
                            }}
                          />
                          <TextInput
                            keyboardType="numeric"
                            returnKeyType="done"
                            maxLength={2}
                            style={styles.inputText}
                            placeholder="MM"
                            value={values.dobMonth}
                            onBlur={handleBlur("dobMonth")}
                            placeholderTextColor="white"
                            onChangeText={(e) => {
                              setFieldValue("dobMonth", e.trim());
                              if (
                                e.length > 1 &&
                                dobYearRef.current != undefined
                              ) {
                                dobYearRef.current.focus();
                              }
                            }}
                          />
                          <TextInput
                            keyboardType="numeric"
                            returnKeyType="done"
                            maxLength={4}
                            style={styles.inputText}
                            placeholder="YYYY"
                            value={values.dobYear}
                            onBlur={handleBlur("dobYear")}
                            placeholderTextColor="white"
                            onChangeText={(e) => {
                              setFieldValue("dobYear", e.trim());
                            }}
                          />
                        </View>

                        <Text style={styles.formLabel}>Gender</Text>
                        <Text
                          onPress={() => setGenderPicker(!genderPicker)}
                          style={[
                            styles.inputText,
                            { justifyContent: "center" },
                          ]}
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
                          <Text style={styles.formLabel}>Address</Text>
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
                            errors.zipcode &&
                            touched.zipcode && (
                              <Text style={styles.errorMsg}>
                                {errors.zipcode}
                              </Text>
                            )}
                        </View>
                        <TextInput
                          placeholder="Street"
                          onChangeText={(e) => setFieldValue("street", e)}
                          onBlur={handleBlur("street")}
                          style={styles.inputText}
                          placeholderTextColor="white"
                          value={values.street}
                        />
                        <TextInput
                          placeholder="City"
                          onChangeText={(e) => setFieldValue("city", e)}
                          onBlur={handleBlur("city")}
                          style={styles.inputText}
                          value={values.city}
                          placeholderTextColor="white"
                        />
                        <TextInput
                          placeholder="Zip Code"
                          onChangeText={handleChange("zipcode")}
                          maxLength={6}
                          returnKeyType="done"
                          onBlur={handleBlur("zipcode")}
                          style={styles.inputText}
                          placeholderTextColor="white"
                          value={values.zipcode.toString()}
                        />
                        <Image
                          source={Line}
                          style={[styles.borderImage, { width: "100%" }]}
                        />
                        <TouchableOpacity
                          onPress={() => handleSubmit()}
                          style={styles.updateButton}
                        >
                          <Text
                            style={[
                              global.BigText,
                              { color: colors.pink, textAlign: "center" },
                            ]}
                          >
                            UPDATE PROFILE
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </Formik>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </LinearGradient>
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
    color: "#FFB3FF",
    textTransform: "uppercase",
    letterSpacing: 2,
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
  pickerView: {
    color: "white",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#311951",
    marginTop: windowHeight * 0.015,
  },
  picker: {
    height: windowHeight * 0.055,
    backgroundColor: "#311951",
    color: "white",
  },
  heading: {
    textTransform: "uppercase",
    fontSize: 32,
    fontWeight: "700",
    color: "#BFA7F2",
    textAlign: "center",
    fontFamily: "MontserratBold",
    marginTop: 20,
  },

  inputText: {
    marginTop: windowHeight * 0.008,
    height: windowHeight * 0.055,
    backgroundColor: "#311951",
    padding: 10,
    borderRadius: 4,
    color: "white",
    verticalAlign: "middle",
    fontFamily: "MontserratBold",
  },
  dottedBorder: {
    marginTop: windowHeight * 0.06,
    marginBottom: windowHeight * 0.06,
    borderBottomWidth: 1.5,
    borderStyle: "dashed",
    borderBottomColor: "#BFA7F2",
  },
  formButton: {
    marginBottom: windowHeight * 0.03,
    borderWidth: 1,
    padding: 15,
    borderRadius: 4,
    borderColor: "#BFA7F2",
  },
  updateButton: {
    borderColor: "#BFA7F2",
    borderWidth: windowHeight * 0.001,
    height: windowHeight * 0.07,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: windowHeight * 0.15,
  },
  borderImage: {
    marginTop: windowHeight * 0.05,
    marginBottom: windowHeight * 0.03,
    alignSelf: "center",
  },
});

export default Profile;
