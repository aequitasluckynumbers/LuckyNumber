import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";

import global from "../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";
import GameTitle from "../components/GameTitle";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../utils/colors";
import { useFonts } from "expo-font";
import ProfileIcon from "../assets/Icons/ProfileIcon.png";
import PlayGame from "../popups/PlayGame";
import ProfilePopup from "../popups/ProfilePopup";
import { supabase } from "../lib/supabase";
import { showToast } from "../lib/toast";
import { Game } from "../types/game";
import { BG_COLORS, COUNTRY } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";

import playgame from "../assets/images/buttons/play-game.png";
import showschedule from "../assets/images/buttons/show-schedule.png";
import oursponsors from "../assets/images/buttons/our-sponsors.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type HomeProps = NativeStackScreenProps<RootStackParamsList, "Home">;

export default function Home({ navigation }: HomeProps) {
  const [gamepopup, setGamePopup] = useState<boolean>(false);
  const [profilePopup, setProfilePopup] = useState<boolean>(false);
  const [upcomingGame, setUpcomingGame] = useState<Game | null>(null);
  const [timer, setTimer] = useState<string>("00:00:00");
  const [modalVisible, setModalVisible] = useState(false);
  const timerRef = useRef("");
  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
    BebasNeue: require("../assets/fonts/BebasNeue-Regular.ttf"),
  });

  const getUpcomingGame = async () => {
    const time = Date.now();
    const minTime = time - 1000 * 60 * 60;

    const minDate = new Date(minTime).toISOString();

    const country = await AsyncStorage.getItem(COUNTRY);

    if (country === null) {
      showToast("Failed to Load the Upcoming Game");
      return;
    }

    const { data, error } = await supabase
      .from("game")
      .select("*")
      .gte("starts_at", minDate)
      .order("starts_at")
      .limit(1);
    // const { data, error } = await supabase
    //   .from("game")
    //   .select("*")
    //   .gte("starts_at", minDate)
    //   .eq("country", country)
    //   .order("starts_at")
    //   .limit(1);

    if (error) {
      console.log(error);
      showToast("error");
      return;
    }
    console.log(data);
    if (data?.length === 0) {
      showToast("no upcoming game found");
      return;
    }

    const game = data!![0];
    // console.log(game);
    setUpcomingGame(game);
  };

  const startTimer = (starts_at: string) => {
    const now: number = Date.now();
    const start: number = Date.parse(starts_at); // iso
    const difference: number = start - now;
    if (difference < 0) {
      setTimer("00:00:00");
      return;
    }
    let seconds = Math.floor((difference / 1000) % 60);
    let minutes = Math.floor((difference / 1000 / 60) % 60);
    let hours = Math.floor(difference / (1000 * 60 * 60));

    const timeString = `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;

    setTimer(timeString);
  };

  // For Fetching Game
  useEffect(() => {
    getUpcomingGame();
    const interval = setInterval(() => {
      if (timer === "00:00:00") {
        console.log("running");
        getUpcomingGame();
      }
    }, 60000); // 1 min
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer !== timerRef.current) {
      if (timer === "00:00:01" && timerRef.current === "00:00:02") {
        setModalVisible(true);
      }
      timerRef.current = timer;
    }
  }, [timer]);

  // For timer
  useEffect(() => {
    if (upcomingGame === null) {
      console.log("game is null");
      setTimer("00:00:00");
      return;
    }
    const interval = setInterval(() => {
      startTimer(upcomingGame.starts_at);
    }, 1000);
    return () => clearInterval(interval);
  }, [upcomingGame]);

  if (loaded) {
    return (
      <>
        {profilePopup && (
          <ProfilePopup
            navigation={navigation}
            setProfilePopup={setProfilePopup}
          />
        )}
        <LinearGradient colors={BG_COLORS} style={global.bg}>
          <SafeAreaView
            style={{
              position: "relative",
              marginHorizontal: windowHeight * 0.03,
            }}
          >
            <TouchableOpacity onPress={() => setProfilePopup(true)}>
              <Image style={styles.profileImage} source={ProfileIcon} />
            </TouchableOpacity>

            <View style={{ alignItems: "center", zIndex: -1 }}>
              <GameTitle
                titlewidth={windowWidth * 0.65}
                titleheight={windowHeight * 0.34}
              />
            </View>

            <LinearGradient
              // Background Linear Gradient
              colors={["#493260", "#250A36"]}
              style={styles.timerContainer}
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

            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => {
                  setGamePopup(true);
                }}
                style={styles.touchableBtn}
              >
                <Image source={playgame} style={styles.actionBtn} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Schedule");
                }}
                style={styles.touchableBtn}
              >
                <Image source={showschedule} style={styles.actionBtn} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Sponsors");
                }}
                style={styles.touchableBtn}
              >
                <Image source={oursponsors} style={styles.actionBtn} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {gamepopup && (
          <PlayGame
            navigation={navigation}
            setGamePopup={setGamePopup}
            game={upcomingGame}
            timer={timer}
          />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={[global.XBigText, { fontSize: windowHeight * 0.028 }]}
              >
                Game has started
              </Text>
              <Pressable
                style={[global.lightbluebtn, styles.button, { marginTop: 20 }]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setGamePopup(true);
                }}
              >
                <Text style={[global.mediumText, styles.closeTxt]}>
                  Play Game
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  timerContainer: {
    width: "100%",
    padding: windowHeight * 0.005,
    paddingVertical: windowHeight * 0.01,
    borderRadius: 16,
    alignSelf: "center",
    marginBottom: windowHeight * 0.03,
    alignItems: "center",
  },
  nextGame: {
    color: colors.pink,
    fontWeight: "800",
    letterSpacing: 3,
    fontFamily: "MontserratBold",
  },
  timerText: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: windowWidth * 0.24,
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

  btnContainer: {
    width: "100%",
    height: windowHeight * 0.35,
    // backgroundColor: "red",
    // justifyContent: "center",
    gap: 12,
    marginTop: 5,
  },

  touchableBtn: {
    // backgroundColor: "red",
    maxHeight: 75,
    alignSelf: "center",
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
  },

  actionBtn: {
    resizeMode: "cover",
    height: "100%",
    width: "100%",
  },

  profileImage: {
    position: "absolute",
    top: 10,
    right: 20,
    width: windowHeight * 0.04,
    height: windowHeight * 0.04,
    resizeMode: "contain",
    zIndex: 5,
  },

  //popup style

  popupSec: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  timerContainer1: {
    marginTop: windowHeight * 0.1,
  },

  imageContainer: {
    width: windowWidth * 0.9,
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  iconBtn1: {
    justifyContent: "center",
  },

  image: {
    borderRadius: 4,
    width: "100%",
    height: windowHeight * 0.1,
  },

  heading: {
    fontSize: windowHeight * 0.035,
    fontWeight: "500",
    marginVertical: windowHeight * 0.03,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    paddingHorizontal: 10,
  },
  closeTxt: {
    textAlign: "center",
    marginVertical: "3%",
    fontWeight: "600",
  },
});
