import React from "react";
import { View, Image, Pressable, Dimensions, StyleSheet } from "react-native";
import backButton from "../assets/Icons/backButton.png";

const Navbar = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <Image style={styles.backButton} source={backButton} alt="backButton" />
      </Pressable>
    </View>
  );
};

// const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    // height: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerhideBack: {
    height: "5%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  backButton: {
    height: windowHeight * 0.03,
    width: windowHeight * 0.03,
  },
  StarProfile: {
    height: windowHeight * 0.04,
    width: windowHeight * 0.04,
  },
});

export default Navbar;
