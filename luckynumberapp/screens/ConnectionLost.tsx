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

const windowHeight = Dimensions.get("window").height;

type ConnectionLostProps = NativeStackScreenProps<
  RootStackParamsList,
  "ConnectionLost"
>;

const ConnectionLost = ({ navigation }: ConnectionLostProps) => {
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
              flex: 1,
              marginHorizontal: windowHeight * 0.04,
              justifyContent: "space-between",
            },
          ]}
        >
          <View style={{ marginTop: windowHeight * 0.1 }}>
            <Text
              style={[
                global.XBigText,
                { textAlign: "center", fontSize: windowHeight * 0.035 },
              ]}
            >
              INTERNET CONNECTION LOST
            </Text>
            <Text
              style={[
                global.mediumText,
                styles.swDesc,
                { fontFamily: "Montserrat", marginTop: 10 },
              ]}
            >
              Looks like you forgot to pay your internet bill, never mind!
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Welcome");
              }}
              style={[global.lightbluebtn, styles.trySection]}
            >
              <Text style={[global.BigText, styles.tryagainBtn]}>
                TRY AGAIN
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

  SWrongSection: {
    gap: windowHeight * 0.4,
  },

  trySection: {
    marginHorizontal: "3%",
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

export default ConnectionLost;
