import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import bgimg from "../assets/bgimg.png";
import { SafeAreaView } from "react-native-safe-area-context";
import global from "../styles/global";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../utils/colors";

import { COUNTRY } from "../utils/constants";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import { showToast } from "../lib/toast";
import { Game } from "../types/game";
import { useFonts } from "expo-font";
import Prizes from "../components/Prizes";

type PlayGameProps = {
  navigation: any;
  setGamePopup: Dispatch<SetStateAction<boolean>>;
  game: Game | null;
  timer: string;
};

const PlayGame = ({ navigation, setGamePopup, game, timer }: PlayGameProps) => {
  const [] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
    BebasNeue: require("../assets/fonts/BebasNeue-Regular.ttf"),
  });

  const handlePlayGame = () => {
    console.log(game);
    if (!game) {
      showToast("No Game Is Running Currently");
      return;
    }

    let gameStartTime = Date.parse(game?.starts_at);
    let duration = game.time_arr[game.time_arr.length - 1] * 1000; // now assuming time_arr is in seconds
    let now: number = Date.now();

    if (gameStartTime > now) {
      showToast("Game has not started yet");
      return;
    }

    let timeElapsedSinceGameStart = now - gameStartTime;

    if (timeElapsedSinceGameStart < 10 * 60 * 1000) {
      // if game has started within 10 mins
      navigation.navigate("Game", {
        game: game,
      });
      showToast("Running game");
    } else if (
      timeElapsedSinceGameStart > 10 * 60 * 1000 &&
      timeElapsedSinceGameStart < duration
    ) {
      showToast(
        "You cannot participate in this game as it started more than 10 minutes ago"
      );
    } else {
      showToast("This game has already ended");
    }
  };

  // const fetchAdverts = async () => {
  //   const country = await AsyncStorage.getItem(COUNTRY);
  //   console.log(country);
  //   const { data, error } = await supabase
  //     .from("sponsors_adverts")
  //     .select("*")
  //     .eq("type", "advert")
  //     .eq("country", country)
  //     .order("rank", { ascending: true });
  //   if (error) {
  //     console.log(error);
  //     showToast("Failed to get Sponsors!");
  //     return;
  //   }

  //   setAdverts(data);
  // };

  useEffect(() => {
    // fetchAdverts();
  }, []);
  return (
    <ImageBackground
      resizeMode="stretch"
      style={[global.bg, styles.popup]}
      source={bgimg}
    >
      <SafeAreaView style={{ flexGrow: 1 }}>
        <View style={styles.popupSec}>
          <LinearGradient
            // Background Linear Gradient
            colors={["#493260", "#250A36"]}
            style={[styles.timerContainer, { marginTop: windowHeight * 0.06 }]}
          >
            <Text style={styles.nextGame}>NEXT GAME</Text>

            <Text
              style={
                timer.length === 8 ? styles.timerText : styles.smallTimerText
              }
            >
              {timer}
            </Text>

            <View style={styles.hms}>
              <Text style={styles.timerTitle}>HH</Text>
              <Text style={styles.timerTitle}>MM</Text>
              <Text style={styles.timerTitle}>SS</Text>
            </View>
          </LinearGradient>

          {/* <View style={styles.imageContainer}>
            <Image style={styles.image} source={todaysprizes1} alt="" />
            <Image style={styles.image} source={todaysprizes2} alt="" />
            <Image style={styles.image} source={todaysprizes3} alt="" />
          </View> */}
          <View style={styles.imageContainer}>
            <Prizes prizes={game?.prizes} />
          </View>
          <Text style={[styles.btnText, styles.heading]}>Todays Prizes</Text>

          <TouchableOpacity
            onPress={() => {
              handlePlayGame();
            }}
          >
            <LinearGradient
              colors={["#0D87B4", "#1D4778"]}
              style={[styles.iconBtn, styles.iconBtn1]}
            >
              <Text style={styles.btnText}>PLAY</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setGamePopup(false);
            }}
            style={[styles.iconBtn, styles.iconBtn1]}
          >
            <Text style={styles.btnText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default PlayGame;

const styles = StyleSheet.create({
  popupSec: {
    // alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginHorizontal: windowHeight * 0.04,
  },
  timerContainer1: {
    marginTop: windowHeight * 0.1,
  },

  nextGame: {
    color: colors.pink,
    fontWeight: "800",
    letterSpacing: 3,
    fontFamily: "MontserratBold",
  },

  imageContainer: {
    width: "100%",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5,
  },

  iconBtn1: {
    justifyContent: "center",
  },

  image: {
    borderRadius: 4,
    width: "100%",
    height: windowHeight * 0.085,
  },

  timerContainer: {
    width: "100%",
    padding: windowHeight * 0.001,
    paddingVertical: windowHeight * 0.016,
    borderRadius: 16,
    alignSelf: "center",
    marginVertical: windowHeight * 0.03,
    alignItems: "center",
  },

  timerText: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: windowWidth * 0.22,
    letterSpacing: 2,
  },
  smallTimerText: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: windowWidth * 0.2,
    letterSpacing: 6,
  },

  hms: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: -12,
    fontFamily: "MontserratBold",
    paddingBottom: 10,
  },

  timerTitle: {
    color: colors.pink,
    fontWeight: "800",
    letterSpacing: 3,
    fontFamily: "MontserratBold",
  },

  heading: {
    fontSize: windowHeight * 0.035,
    marginVertical: windowHeight * 0.03,
    textTransform: "uppercase",
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 1,
    fontFamily: "Montserrat",
    textAlign: "center",
  },

  iconBtn: {
    width: "100%",
    paddingHorizontal: 28,
    paddingVertical: 25,
    alignSelf: "center",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.darkblue,
    marginVertical: 5,
  },
  popup: {
    opacity: 1,
    position: "absolute",
    width: windowWidth,
    flex: 1,
  },
  btnText: {
    fontSize: windowHeight * 0.02,
    textTransform: "uppercase",
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 2,
    fontFamily: "Montserrat",
  },
});
