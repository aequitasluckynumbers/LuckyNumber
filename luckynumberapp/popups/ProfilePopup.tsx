import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import bgimg from "../assets/bgimg.png";
import global from "../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";
import CloseIcon from "../assets/Icons/Close.png";
import colors from "../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../lib/supabase";
import { showToast } from "../lib/toast";
import { useFonts } from "expo-font";
import ConfirmPopup from "./ConfirmPopup";
import LoadingPopup from "./LoadingPopup";

const windowHeight = Dimensions.get("window").height;

type ProfilePopupProps = {
  navigation: any;
  setProfilePopup: Dispatch<SetStateAction<boolean>>;
};

export default function ProfilePopup({
  setProfilePopup,
  navigation,
}: ProfilePopupProps): JSX.Element {
  const [logoutConfirmPopup, setLogoutConfirmPopup] = useState(false);
  const [deleteConfirmPopup, setDeleteConfirmPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  const deleteProfile = async () => {
    setLoading(true);
    await supabase.functions.invoke("delete-profile");
    await logout();
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast("Failed to logout user");
    }
    setLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  if (loaded) {
    return (
      <>
        {loading && <LoadingPopup message="" />}
        {logoutConfirmPopup && (
          <ConfirmPopup
            message="Logout?"
            onYes={logout}
            onNo={() => setLogoutConfirmPopup(false)}
          />
        )}
        {deleteConfirmPopup && (
          <ConfirmPopup
            message="Delete Profile?"
            onYes={deleteProfile}
            onNo={() => setDeleteConfirmPopup(false)}
          />
        )}
        <ImageBackground
          resizeMode="stretch"
          style={[global.bg]}
          source={bgimg}
        >
          <SafeAreaView
            style={{ flexGrow: 1, marginHorizontal: windowHeight * 0.04 }}
          >
            <TouchableOpacity
              style={styles.closeContainer}
              onPress={() => setProfilePopup(false)}
            >
              <Image
                source={CloseIcon}
                style={styles.closeImg}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View
              style={[
                global.container,
                styles.profile,
                { marginVertical: 0, marginHorizontal: 0 },
              ]}
            >
              <Text style={[styles.heading, { marginTop: "-20%" }]}>
                PROFILE
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <LinearGradient
                  colors={["#0D87B4", "#1D4778"]}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>Profile Settings</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("PrivacyPolicy")}
              >
                <LinearGradient
                  colors={["#0D87B4", "#1D4778"]}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>Privacy Policy</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("HowToPlay")}
              >
                <LinearGradient
                  colors={["#0D87B4", "#1D4778"]}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>Game Rules</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDeleteConfirmPopup(true)}>
                <LinearGradient
                  colors={["#0D87B4", "#1D4778"]}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>Delete Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLogoutConfirmPopup(true)}>
                <LinearGradient
                  colors={["#0D87B4", "#1D4778"]}
                  style={styles.btn}
                >
                  <Text style={styles.btnText}>Log Out</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setProfilePopup(false)}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Back</Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </>
    );
  }
  return <></>;
}

const styles = StyleSheet.create({
  closeContainer: {
    position: "absolute",
    top: 50,
    right: 0,
  },
  closeImg: {
    width: windowHeight * 0.03,
    height: windowHeight * 0.03,
    resizeMode: "contain",
  },
  heading: {
    textTransform: "uppercase",
    fontSize: windowHeight * 0.04,
    color: colors.white,
    fontWeight: "300",
    textAlign: "center",
    letterSpacing: 2,
    paddingBottom: windowHeight * 0.02,
    fontFamily: "Montserrat",
  },

  profile: {
    justifyContent: "center",
    height: windowHeight,
    zIndex: -1,
  },
  btn: {
    width: "100%",
    paddingVertical: 25,
    alignSelf: "center",
    borderRadius: 6,
    backgroundColor: colors.darkblue,
    marginVertical: 8,
  },
  btnText: {
    fontSize: windowHeight * 0.02,
    textTransform: "uppercase",
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 3,
    textAlign: "center",
  },
});
