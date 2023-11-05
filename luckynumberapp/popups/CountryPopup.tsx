import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import bgimg from "../assets/bgimg.png";
import global from "../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../lib/toast";
import { COUNTRY } from "../utils/constants";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function CountryPopup({
  setCountryPopup,
}: {
  setCountryPopup: Dispatch<SetStateAction<boolean>>;
}) {
  const hanldeSelectCountry = async (country: string) => {
    try {
      console.log(country);
      await AsyncStorage.setItem(COUNTRY, country);
      setCountryPopup(false);
    } catch (error) {
      showToast("Failed to set the country");
    }
  };

  return (
    <ImageBackground resizeMode="stretch" style={[global.bg]} source={bgimg}>
      <SafeAreaView>
        <View style={[styles.profile]}>
          <Text style={styles.heading}>SELECT COUNTRY</Text>

          <TouchableOpacity onPress={() => hanldeSelectCountry("uk")}>
            <LinearGradient colors={["#0D87B4", "#1D4778"]} style={styles.btn}>
              <Text style={styles.btnText}>United Kingdom</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => hanldeSelectCountry("india")}>
            <LinearGradient colors={["#0D87B4", "#1D4778"]} style={styles.btn}>
              <Text style={styles.btnText}>India</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => hanldeSelectCountry("philippines")}>
            <LinearGradient colors={["#0D87B4", "#1D4778"]} style={styles.btn}>
              <Text style={styles.btnText}>Philippines</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}></View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  heading: {
    textTransform: "uppercase",
    fontSize: windowHeight * 0.04,
    color: colors.white,
    fontWeight: "300",
    textAlign: "center",
    letterSpacing: 3,
    paddingBottom: windowHeight * 0.02,
  },

  profile: {
    justifyContent: "center",
    alignItems: "center",
    height: windowHeight,
    zIndex: -1,
  },
  btn: {
    width: windowWidth * 0.9,
    paddingVertical: 22,
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
