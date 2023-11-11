import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import global from "../styles/global";
import { StackActions } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { useFonts } from "expo-font";
import { BG_COLORS } from "../utils/constants";
import { LinearGradient } from "expo-linear-gradient";
// import LottieView from "lottie-react-native";
import AnimatedLoader from "react-native-animated-loader";
import splash from "../assets/splash.png";
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
      }, 3000);
      return;
    }
    setTimeout(() => {
      navigation.dispatch(StackActions.replace("Welcome"));
    }, 3000);
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <LinearGradient colors={BG_COLORS} style={global.bg}>
      <SafeAreaView>
        <View
          style={[global.container, { marginHorizontal: windowHeight * 0.04 }]}
        >
          <View style={styles.StarTitleSection}>
            <Image
              source={splash}
              style={{
                width: windowWidth,
                height: windowHeight,
                marginBottom: 30,
              }}
            />
          </View>

          <AnimatedLoader
            visible={true}
            animationStyle={styles.lottie}
            source={require("../assets/animations/loader.json")}
            speed={1}
          ></AnimatedLoader>
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
  lottie: {
    width: 100,
    height: 100,
    marginTop: 100,
  },
});

export default Splash;
