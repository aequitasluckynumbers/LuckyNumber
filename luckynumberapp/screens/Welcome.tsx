/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import global from "../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";
import GameTitle from "../components/GameTitle";
import colors from "../utils/colors";
import signupimg from "../assets/images/signup.png";
import { supabase, supabaseUrl } from "../lib/supabase";
import dottedLine from "../assets/images/Line.png";
import CountryPopup from "../popups/CountryPopup";

import * as WebBrowser from "expo-web-browser";

import { makeRedirectUri, startAsync } from "expo-auth-session";
import { showToast } from "../lib/toast";
import { BG_COLORS, COUNTRY, OAUTH_SIGNUP, SIGNUP } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

import cwf from "../assets/images/buttons/continue-facebook.png";
import cwg from "../assets/images/buttons/continue-google.png";
import cwa from "../assets/images/buttons/continue-apple.png";

WebBrowser.maybeCompleteAuthSession();

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type WelcomeProps = NativeStackScreenProps<RootStackParamsList, "Welcome">;

const Welcome = ({ navigation }: WelcomeProps) => {
  const [, setIsLoading] = useState<boolean>(false);
  const [countryPopup, setCountryPopup] = useState<boolean>(false);

  let [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  const getUserAndNavigate = async (userId: string, email: string) => {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("id::text", userId);

    // no user exists
    if (user.data?.length === 0) {
      navigation.navigate("SignUp", {
        authType: OAUTH_SIGNUP,
        email: email ? email : "",
      });
      return;
    }

    // user exists
    const u = user.data!![0];
    if (u.is_complete) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      return;
    }
    navigation.navigate("SignUp", {
      authType: OAUTH_SIGNUP,
      email: email,
    });

    setIsLoading(false);
  };

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    //TODO: Add Loading State for better UX

    const redirectUrl: string = makeRedirectUri({
      path: "/auth/callback",
    });

    const authResponse = await startAsync({
      authUrl: `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`,
      returnUrl: redirectUrl,
    });

    if (authResponse.type === "success") {
      const { data, error } = await supabase.auth.setSession({
        access_token: authResponse.params.access_token,
        refresh_token: authResponse.params.refresh_token,
      });

      if (error) {
        showToast("Unknown Error occured");
        return;
      }

      getUserAndNavigate(data.user!!.id, data.user?.email || "");
    } else {
      showToast("Failed to signin with google");
      setIsLoading(false);
    }
  };

  const handleSignInWithApple = async () => {
    setIsLoading(true);
    //TODO: Add Loading State for better UX

    const redirectUrl: string = makeRedirectUri({
      path: "/auth/callback",
    });

    const authResponse = await startAsync({
      authUrl: `${supabaseUrl}/auth/v1/authorize?provider=apple&redirect_to=${redirectUrl}`,
      returnUrl: redirectUrl,
    });

    if (authResponse.type === "success") {
      const { data, error } = await supabase.auth.setSession({
        access_token: authResponse.params.access_token,
        refresh_token: authResponse.params.refresh_token,
      });

      if (error) {
        showToast("Unknown Error occured");
        return;
      }

      getUserAndNavigate(data.user!!.id, data.user?.email || "");
    } else {
      showToast("Failed to signin with apple");
      setIsLoading(false);
    }
  };

  const handleSignInWitFacebook = async () => {
    setIsLoading(true);

    const redirectUrl = makeRedirectUri({
      path: "/auth/callback",
    });
    console.log("redirecturl_____" + redirectUrl);

    const authResponse = await startAsync({
      authUrl: `${supabaseUrl}/auth/v1/authorize?provider=facebook&redirect_to=${redirectUrl}`,
      returnUrl: redirectUrl,
    });

    if (authResponse.type === "success") {
      const { data, error } = await supabase.auth.setSession({
        access_token: authResponse.params.access_token,
        refresh_token: authResponse.params.refresh_token,
      });

      if (error) {
        showToast("Unknown Error occured");
        return;
      }

      getUserAndNavigate(data.user!!.id, data.user?.email || "");
    } else {
      showToast("Failed to signin with facebook");
      setIsLoading(false);
    }
  };

  const handleSelectCountry = async () => {
    try {
      await AsyncStorage.removeItem(COUNTRY);
      const value = await AsyncStorage.getItem(COUNTRY);
      if (value == null) {
        setCountryPopup(true);
      }
    } catch (error) {
      showToast("Unknown error occured please restart the app");
    }
  };

  useEffect(() => {
    handleSelectCountry();
  }, []);

  if (loaded) {
    return (
      <>
        {countryPopup && <CountryPopup setCountryPopup={setCountryPopup} />}
        <LinearGradient colors={BG_COLORS} style={global.bg}>
          <SafeAreaView
            style={[
              global.container,
              {
                height: "100%",
                flexDirection: "column",
                justifyContent: "space-between",
              },
            ]}
          >
            <View style={styles.StarTitleSection}>
              <GameTitle
                titlewidth={windowHeight * 0.4}
                titleheight={windowHeight * 0.34}
              />
            </View>
            <View style={styles.CrediantalSection}>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={() => {
                  navigation.navigate("SignUp", {
                    authType: SIGNUP,
                    email: "",
                  });
                }}
              >
                <Image
                  source={signupimg}
                  resizeMode="stretch"
                  style={styles.btnImg}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSignInWitFacebook}
                style={styles.continueBtn}
              >
                <Image
                  source={cwf}
                  style={styles.btnImg}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSignInWithGoogle}
                style={styles.continueBtn}
              >
                <Image
                  source={cwg}
                  style={styles.btnImg}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSignInWithApple}
                style={styles.continueBtn}
              >
                <Image
                  source={cwa}
                  style={styles.btnImg}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Image
                style={[styles.dottedBorderLine, { width: "100%" }]}
                source={dottedLine}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
                }}
                style={[styles.loginSection, { marginTop: -10 }]}
              >
                <Text style={[global.BigText, { color: colors.pink }]}>
                  LOGIN
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </>
    );
  }
  return null;
  // return (
  //   <>
  //     {countryPopup && <CountryPopup setCountryPopup={setCountryPopup} />}

  //     <LinearGradient colors={BG_COLORS} style={global.bg}>
  //       <SafeAreaView
  //         style={[
  //           global.container,
  //           {
  //             height: "100%",
  //             flexDirection: "column",
  //             justifyContent: "space-between",
  //           },
  //         ]}
  //       >
  //         <View style={styles.StarTitleSection}>
  //           <GameTitle
  //             titlewidth={windowHeight * 0.4}
  //             titleheight={windowHeight * 0.34}
  //           />
  //         </View>
  //         <View style={styles.CrediantalSection}>
  //           <TouchableOpacity
  //             style={styles.continueBtn}
  //             onPress={() => {
  //               navigation.navigate("SignUp", {
  //                 authType: SIGNUP,
  //                 email: "",
  //               });
  //             }}
  //           >
  //             <Image
  //               source={signupimg}
  //               resizeMode="stretch"
  //               style={styles.btnImg}
  //             />
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             onPress={handleSignInWitFacebook}
  //             style={styles.continueBtn}
  //           >
  //             <Image source={cwf} style={styles.btnImg} resizeMode="contain" />
  //           </TouchableOpacity>

  //           <TouchableOpacity
  //             onPress={handleSignInWithGoogle}
  //             style={styles.continueBtn}
  //           >
  //             <Image source={cwg} style={styles.btnImg} resizeMode="contain" />
  //           </TouchableOpacity>

  //           <TouchableOpacity
  //             onPress={handleSignInWithGoogle}
  //             style={styles.continueBtn}
  //           >
  //             <Image source={cwa} style={styles.btnImg} resizeMode="contain" />
  //           </TouchableOpacity>

  //           <Image style={styles.dottedBorderLine} source={dottedLine} />
  //           <TouchableOpacity
  //             onPress={() => {
  //               navigation.navigate("Login");
  //             }}
  //             style={[styles.loginSection, { marginTop: -10 }]}
  //           >
  //             <Text style={[global.BigText, { color: colors.pink }]}>
  //               LOGIN
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </SafeAreaView>
  //     </LinearGradient>
  //   </>
  // );
};

const styles = StyleSheet.create({
  StarTitleSection: {
    height: windowHeight * 0.37,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 15,
    // backgroundColor: "red",
  },

  CrediantalSection: {
    paddingTop: "8%",
    paddingHorizontal: windowWidth * 0.037,
    // backgroundColor: "red",
    justifyContent: "space-around",
    gap: windowHeight * 0.01,
    // flex: 1,
  },
  DottedBorder: {
    paddingVertical: "3%",
    borderStyle: "dashed",
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderColor: "white",
  },

  dottedBorderLine: {
    marginTop: 10,
  },

  mediaIcon: {
    width: windowHeight * 0.03,
    height: windowHeight * 0.03,
  },

  mediaimg: {
    // width: "20%",
    marginLeft: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  mediaText: {
    display: "flex",
    justifyContent: "center",
  },

  btninnerSection: {
    display: "flex",
    flexDirection: "row",
    gap: 32,
    // height: windowHeight * 0.05,
  },

  loginSection: {
    borderColor: "#BFA7F2",
    borderWidth: windowHeight * 0.002,
    height: windowHeight * 0.07,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: windowHeight * 0.02,
  },

  continueBtn: {
    // backgroundColor: "red",
    height: "9.8%",
    // flex: 1,
  },

  btnImg: {
    maxHeight: 60,
    width: "100%",
    // height: "100%",
    // borderRadius: 5,
    // flex: 1,
  },
});

export default Welcome;
