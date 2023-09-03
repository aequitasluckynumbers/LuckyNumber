/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import bgimg from "../assets/bgimg.png";
import global from "../styles/global";
import Navbar from "../components/Navbar";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { BG_COLORS } from "../utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import PDFReader from "rn-pdf-reader-js";

type PrivacyPolicyProps = NativeStackScreenProps<
  RootStackParamsList,
  "PrivacyPolicy"
>;

const windowHeight = Dimensions.get("window").height;

const PrivacyPolicy = ({ navigation }: PrivacyPolicyProps) => {
  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  if (loaded) {
    return (
      <LinearGradient colors={BG_COLORS} style={global.bg}>
        <SafeAreaView style={{ flexGrow: 1 }}>
          <View
            style={[
              global.container,
              { marginHorizontal: windowHeight * 0.04 },
            ]}
          >
            <Navbar navigation={navigation} />
            <View style={{ marginTop: 25 }}>
              <Text style={[global.XBigText]}>PRIVACY POLICY</Text>
            </View>
            <View
              style={{
                marginTop: 10,
                height: windowHeight * 0.7,
              }}
            >
              <PDFReader
                source={{
                  uri: "https://luckynumbers-pdfs.s3.ap-south-1.amazonaws.com/terms-and-conditions.pdf",
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  steps: {
    textAlign: "center",
    marginVertical: "1%",
    marginHorizontal: "8%",
  },

  rules: {
    marginTop: "20%",
    marginHorizontal: "5%",
    gap: 20,
  },

  desc: {
    marginTop: "8%",
  },
});

export default PrivacyPolicy;
