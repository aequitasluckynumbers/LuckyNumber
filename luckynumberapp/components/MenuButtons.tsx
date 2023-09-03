import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import lineimg from "../assets/images/Line.png";
import homeimg from "../assets/Icons/Home.png";
import howplay from "../assets/Icons/HowPlay.png";
import profile from "../assets/Icons/Profile.png";
import React from "react";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MenuButtons = ({ navigation }) => {
  return (
    <View style={styles.menuSection}>
      <Image source={lineimg} style={styles.dottedLine} />
      <View style={styles.iconSec}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("home");
          }}
        >
          <Image source={homeimg} style={styles.iconimg} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("howtoplay");
          }}
        >
          <Image source={howplay} style={styles.iconimg} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("profile");
          }}
        >
          <Image source={profile} style={styles.iconimg} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuSection: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dottedLine: {
    display: "flex",
    width: windowWidth * 0.85,
  },

  iconimg: {
    width: windowHeight * 0.04,
    height: windowHeight * 0.04,
  },
  iconSec: {
    flexDirection: "row",
    marginTop: windowHeight * 0.03,
    gap: windowHeight * 0.11,
  },
});

export default MenuButtons;
