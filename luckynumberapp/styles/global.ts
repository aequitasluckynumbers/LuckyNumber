import { Dimensions, StyleSheet } from "react-native";

import colors from "../utils/colors";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const global = StyleSheet.create({
  container: {
    marginVertical: windowHeight * 0.02,
    marginHorizontal: windowWidth * 0.05,
  },

  bg: {
    height: "100%",
  },

  StarProfile: {
    width: windowHeight * 0.04,
    height: windowHeight * 0.04,
    flex: 1,
    position: "relative",
  },

  bgimg: {
    width: windowWidth,
    height: windowHeight * 1.1,
  },
  //-------------Buttons---------------------------

  lightbluebtn: {
    backgroundColor: colors.lightblue,
    padding: 10,
    borderRadius: 5,
    marginTop: "20%",
    display: "flex",
    justifyContent: "center",
  },

  darkbluebtn: {
    backgroundColor: colors.darkblue,
    padding: 10,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    height: 64,
  },

  backButtonImg: {
    width: windowHeight * 0.035,
    marginVertical: "5%",
  },

  //-------------Text-----------------------------

  XBigText: {
    textAlign: "center",
    fontSize: windowHeight * 0.038,
    color: colors.purple,
    fontWeight: "600",
    fontFamily: "MontserratBold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  BigText: {
    color: colors.bigText,
    fontSize: windowHeight * 0.025,
    fontWeight: "700",
    letterSpacing: 3,
    fontFamily: "MontserratBold",
  },

  mediumText: {
    color: colors.bigText,
    fontSize: windowHeight * 0.02,
    fontWeight: "600",
    fontFamily: "MontserratBold",
  },

  smallText: {
    color: colors.bigText,
    fontSize: windowHeight * 0.022,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
});

export default global;
