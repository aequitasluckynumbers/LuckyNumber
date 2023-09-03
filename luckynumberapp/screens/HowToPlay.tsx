import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import global from "../styles/global";
import Navbar from "../components/Navbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import React from "react";
import { BG_COLORS } from "../utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
const windowHeight = Dimensions.get("window").height;

type HowToPlayProps = NativeStackScreenProps<RootStackParamsList, "HowToPlay">;

const HowToPlay = ({ navigation }: HowToPlayProps) => {
  const [] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  return (
    <LinearGradient colors={BG_COLORS} style={global.bg}>
      <SafeAreaView>
        <View
          style={[global.container, { marginHorizontal: windowHeight * 0.04 }]}
        >
          <Navbar navigation={navigation} />
          <View style={{ marginTop: 25 }}>
            <Text style={[global.XBigText]}>How To Play</Text>
            <Text style={[global.mediumText, styles.steps]}>3 EASY STEPS</Text>
          </View>
          <View style={{ height: windowHeight * 0.7 }}>
            <ScrollView>
              <View style={styles.rules}>
                <Text style={global.smallText}>
                  1. At the beginning of each show the host will prompt home
                  viewers to open the Lucky Numbers App to download a unique 15
                  number bingo card to their mobile phone.
                </Text>
                <Text style={global.smallText}>
                  2. Every time a number is won on the show, the home viewer
                  presses that matching number on their own card (if they have
                  it).
                </Text>
                <Text style={global.smallText}>
                  3. If you manage to match all 15 numbers by end of round 3 you
                  win.
                </Text>
              </View>
              <View style={styles.desc}>
                <Text style={[global.mediumText]}>
                  Each winning card holder will receive a unique win code which
                  allows them access their Prize. (The Prize fund will be
                  para-mutual - if there are multiple winners-the prize is
                  shared)
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  steps: {
    textAlign: "center",
    marginVertical: "3%",
  },

  rules: {
    marginTop: "20%",
    gap: 20,
  },

  desc: {
    marginTop: "8%",
  },
});

export default HowToPlay;
