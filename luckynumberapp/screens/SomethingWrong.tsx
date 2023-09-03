import { SafeAreaView } from "react-native-safe-area-context";
import global from "../styles/global";
import bgimg from "../assets/bgimg.png";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { LinearGradient } from "expo-linear-gradient";
import { BG_COLORS } from "../utils/constants";
import { useFonts } from "expo-font";

// const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type SomethingWrongProps = NativeStackScreenProps<
  RootStackParamsList,
  "SomethingWrong"
>;

const SomethingWrong = ({ navigation }: SomethingWrongProps) => {
  let [] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  return (
    <LinearGradient colors={BG_COLORS} style={global.bg}>
      <SafeAreaView style={{ flexGrow: 1 }}>
        <View
          style={[
            global.container,
            {
              marginHorizontal: windowHeight * 0.04,
              flex: 1,
              justifyContent: "space-between",
            },
          ]}
        >
          <View>
            <Text
              style={[
                global.XBigText,
                {
                  textAlign: "center",
                  marginTop: windowHeight * 0.1,
                  fontSize: windowHeight * 0.035,
                },
              ]}
            >
              SOMETHING WENT{"\n"}WRONG
            </Text>
            <Text
              style={[
                global.mediumText,
                styles.swDesc,
                { fontFamily: "Montserrat", marginTop: 10 },
              ]}
            >
              Something happened, we don't know what, but it happened... {"\n"}
              You're on your own now!
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ConnectionLost");
              }}
              style={[global.lightbluebtn, styles.trySection]}
            >
              <Text
                style={[
                  global.BigText,
                  styles.tryagainBtn,
                  { fontSize: windowHeight * 0.02, paddingVertical: 5 },
                ]}
              >
                TRY AGAIN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Welcome");
              }}
              style={[global.darkbluebtn, styles.trySection]}
            >
              <Text
                style={[
                  global.BigText,
                  styles.tryagainBtn,
                  { fontSize: windowHeight * 0.02, paddingVertical: 5 },
                ]}
              >
                BACK TO HOME
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainSection: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "red",
  },

  trySection: {
    marginVertical: "2%",
  },

  tryagainBtn: {
    textAlign: "center",
    marginVertical: "3%",
    fontWeight: "600",
  },

  swDesc: {
    marginHorizontal: "5%",
    marginTop: "2%",
    textAlign: "center",
  },
});

export default SomethingWrong;
