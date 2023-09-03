import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import bgimg from "../assets/bgimg.png";
import global from "../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../utils/colors";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface ConfirmPopupProps {
  message: string;
  onYes: () => void;
  onNo: () => void;
}

export default function ConfirmPopup({
  message,
  onYes,
  onNo,
}: ConfirmPopupProps) {
  return (
    <ImageBackground resizeMode="stretch" style={[global.bg]} source={bgimg}>
      <SafeAreaView>
        <View style={[styles.profile]}>
          <Text style={styles.heading}>{message}</Text>

          <TouchableOpacity onPress={onYes}>
            <LinearGradient colors={["#0D87B4", "#1D4778"]} style={styles.btn}>
              <Text style={styles.btnText}>Yes</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNo}>
            <LinearGradient colors={["#0D87B4", "#1D4778"]} style={styles.btn}>
              <Text style={styles.btnText}>No</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
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
