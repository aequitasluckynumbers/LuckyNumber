import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../utils/colors";
import global from "../styles/global";
import Prizes from "../components/Prizes";
import todaysprizes1 from "../assets/images/todaysprizes1.png";
import todaysprizes2 from "../assets/images/todaysprizes3.png";
import todaysprizes3 from "../assets/images/todaysprizes3.png";
import { BG_COLORS } from "../utils/constants";

const TodaysPrizes = ({ show }: { show: () => void }) => {
  return (
    <LinearGradient colors={BG_COLORS} style={global.bg}>
      <SafeAreaView style={{ flexGrow: 1 }}>
        <View style={global.container}>
          <View
            style={{
              height: "85%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.heading}>Today's Prizes</Text>
            <Prizes />
            <View>
              {/* <Image style={global.Star} source={Star} alt="" />  */}
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={todaysprizes1} alt="" />
                <Image style={styles.image} source={todaysprizes2} alt="" />
                <Image style={styles.image} source={todaysprizes3} alt="" />
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={show}>
              <LinearGradient
                colors={["#0D87B4", "#1D4778"]}
                style={[styles.iconBtn, styles.iconBtn1]}
              >
                <Text style={styles.btnText}>CLOSE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  iconBtn: {
    width: windowWidth * 0.9,
    paddingHorizontal: 28,
    paddingVertical: 28,
    alignSelf: "center",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.darkblue,
    marginVertical: 8,
  },
  iconBtn1: {
    justifyContent: "center",
  },
  btnText: {
    fontSize: windowHeight * 0.02,
    textTransform: "uppercase",
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 3,
    textAlign: "center",
  },
  heading: {
    textTransform: "uppercase",
    fontSize: 32,
    fontWeight: "700",
    color: "#BFA7F2",
    textAlign: "center",
  },
  imageContainer: {
    marginTop: windowHeight * 0.1,
    gap: 8,
  },
  image: {
    borderRadius: 4,
    width: windowWidth * 0.9,
    alignSelf: "center",
    resizeMode: "contain",
  },
  formButton: {
    backgroundColor: "#0D87B4",
    padding: 25,
    borderRadius: 4,
    borderColor: "#BFA7F2",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 22,
    color: "white",
    lineHeight: 27,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});

export default TodaysPrizes;
