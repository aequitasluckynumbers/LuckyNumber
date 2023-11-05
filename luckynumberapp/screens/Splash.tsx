import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, StyleSheet, View } from "react-native";
import global from "../styles/global";
import { StackActions } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { useFonts } from "expo-font";
import { BG_COLORS } from "../utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type SplashProps = NativeStackScreenProps<RootStackParamsList, "Splash">;

const Splash = ({ navigation }: SplashProps) => {
  const [] = useFonts({
    BebasNeue: require("../assets/fonts/BebasNeue-Regular.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
  });

  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log(data, error);
    if (data.session) {
      setTimeout(() => {
        navigation.dispatch(StackActions.replace("Home"));
      }, 500);
      return;
    }
    setTimeout(() => {
      navigation.dispatch(StackActions.replace("Welcome"));
    }, 100);
  };

  // useEffect(() => {
  //   checkSession();
  // }, []);

  return (
    <LinearGradient colors={BG_COLORS} style={global.bg}>
      <SafeAreaView>
        <View
          style={[global.container, { marginHorizontal: windowHeight * 0.04 }]}
        >
          <View style={styles.StarTitleSection}>
            <LottieView
              autoPlay
              style={{
                width: windowWidth,
                height: windowHeight,
                marginBottom: 30,
              }}
              loop={false}
              source={require("../assets/animations/app-launch.json")}
              onAnimationFinish={checkSession}
            />
          </View>
          {/* <View style={styles.logoSection}>
            <LogoSection />
          </View> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  StarTitleSection: {
    height: "95%",
    justifyContent: "center",
    alignItems: "center",
  },

  logoSection: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default Splash;
