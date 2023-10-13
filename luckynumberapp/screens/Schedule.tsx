import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import bgimg from "../assets/bgimg.png";
import global from "../styles/global";
import React, { useState, useEffect } from "react";
import Prizes from "../components/Prizes";
import colors from "../utils/colors";
import UpIcon from "../assets/Icons/Up.png";
import DownIcon from "../assets/Icons/Down.png";
import backButton from "../assets/Icons/backButton.png";
import { supabase } from "../lib/supabase";
import { Game } from "../types/game";
import { showToast } from "../lib/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BG_COLORS, COUNTRY } from "../utils/constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";

// const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type ScheduleProps = NativeStackScreenProps<RootStackParamsList, "Schedule">;

const Schedule = ({ navigation }: ScheduleProps) => {
  const [] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  const [upcoming, setUpcoming] = useState(true);

  const [previousGames, setPreviousGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [prizes, setPrizes] = useState();

  const fetchGames = async () => {
    const now = Date.now();
    const today = new Date(now).toISOString();
    const date1: Date = new Date(now);
    const date2: Date = new Date(now);
    date1.setDate(date1.getDate() - 30);
    date2.setDate(date2.getDate() + 30);
    const dateString1: string = date1.toISOString();
    const dateString2: string = date2.toISOString();

    const country: string | null = await AsyncStorage.getItem(COUNTRY);

    if (country === null) {
      showToast("Failed to load the Schedule");
      return;
    }

    // const { data, error } = await supabase
    //   .from("game")
    //   .select("*")
    //   .eq("country", country)
    //   .order("starts_at")
    //   .lt("starts_at", dateString2)
    //   .gt("starts_at", dateString1);

    const { data, error } = await supabase
      .from("game")
      .select("*")
      .order("starts_at")
      // .lt("starts_at", dateString2)
      // .gt("starts_at", dateString1);

    console.log(data, "Game data");

    if (error) {
      showToast("Failed to fetch schedule");
      return;
    }

    let upcomingGame = data?.filter((game) => {
      return game.starts_at > today;
    });

    let prevGames = data?.filter((game) => {
      return game.starts_at < today;
    });

    setPreviousGames(prevGames);
    setUpcomingGames(upcomingGame);
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

  //   setPrizes(data);
  // };

  useEffect(() => {
    fetchGames();
    // fetchAdverts();
  }, []);

  return (
    <LinearGradient colors={BG_COLORS} style={global.bg}>
      <SafeAreaView style={{ flexGrow: 1 }}>
        <View
          style={[
            global.container,
            {
              marginVertical: 0,
              marginHorizontal: windowHeight * 0.04,
              flex: 1,
            },
          ]}
        >
          <View style={{ height: windowHeight * 0.22 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                // style={styles.backButton}
                source={backButton}
                alt="backButton"
              />
            </TouchableOpacity>
            <View>
              <Text
                style={[global.XBigText, { fontWeight: "700", marginTop: 40 }]}
              >
                SCHEDULE
              </Text>
            </View>

            <View style={styles.tabsContainer}>
              <Text
                onPress={() => setUpcoming(true)}
                style={upcoming ? styles.tabTextActive : styles.tabText}
              >
                Upcoming
              </Text>
              <Text
                onPress={() => setUpcoming(false)}
                style={!upcoming ? styles.tabTextActive : styles.tabText}
              >
                Previous
              </Text>
            </View>
          </View>

          {upcoming === true ? (
            <ScrollView style={{ flexGrow: 1 }}>
              {upcomingGames.map((game: Game, i: number) => {
                if (game.prizes) {
                  return <ScheduleWithPrize game={game} key={i} />;
                }

                return <ScheduleComponent game={game} key={i} />;
              })}
            </ScrollView>
          ) : (
            <ScrollView style={{ flexGrow: 1 }}>
              {previousGames.map((game: Game, i: number) => {
                if (game.prizes) {
                  return (
                    <ScheduleWithPrize
                      game={previousGames[previousGames.length - 1 - i]}
                      key={i}
                    />
                  );
                }

                return <ScheduleComponent game={game} key={i} />;
              })}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const ScheduleComponent = ({ game }: { game: Game }) => {
  const getLocalTime = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleTimeString();
    // return "di";
  };
  return (
    <View style={styles.ScheduleComponentContainer}>
      <Text style={[global.BigText, { color: "#FFB3FF", letterSpacing: 1 }]}>
        Episode {game.episode_no}
      </Text>
      <View style={styles.ScheduleDateContainer}>
        {/* TODO: use ligit logic to get start time */}
        <Text style={[global.mediumText, { fontFamily: "Montserrat" }]}>
          {game.starts_at.split("T")[0]}
        </Text>
        <Text style={[global.mediumText, { fontFamily: "Montserrat" }]}>
          {getLocalTime(game.starts_at)}
        </Text>
        {/* <Text style={global.mediumText}>
          {game.starts_at.split("T")[1].split("+")[0]}
        </Text> */}
        {/* <Text style={global.mediumText}>30/04/2023</Text> */}
      </View>
      <View style={styles.line} />
    </View>
  );
};

const ScheduleWithPrize = ({ game }: { game: Game }) => {
  const [showPrizes, setShowPrizes] = useState(false);

  const getLocalTime = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleTimeString();
  };

  return (
    <View style={styles.ScheduleComponentContainer}>
      <View style={styles.episodeContainer}>
        <Text style={[global.BigText, { color: "#FFB3FF" }]}>
          Episode {game.episode_no}
        </Text>

        <TouchableOpacity onPress={() => setShowPrizes(!showPrizes)}>
          <Image
            style={styles.upDownIcon}
            source={showPrizes ? UpIcon : DownIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.ScheduleDateContainer}>
        <Text style={[global.mediumText, { fontFamily: "Montserrat" }]}>
          {game.starts_at.split("T")[0]}
        </Text>
        <Text style={[global.mediumText, { fontFamily: "Montserrat" }]}>
          {getLocalTime(game.starts_at)}
        </Text>
      </View>
      {showPrizes && (
        <>
          <Text style={styles.prizeTitle}> Game Prizes</Text>
          <Prizes prizes={game.prizes} />
        </>
      )}
      {showPrizes ? (
        <>
          <Text style={styles.prizeTitle}>Winning Numbers</Text>
          <View style={styles.winningNumberContainer}>
            {game.winning_numbers?.map((item) => (
              <Text key={item} style={styles.winningNumber}>
                {item}
              </Text>
            ))}
          </View>
        </>
      ) : null}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  ScheduleComponentContainer: {
    paddingTop: windowHeight * 0.025,
    gap: windowHeight * 0.01,
  },
  winningNumberContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ScheduleDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  prizeTitle: {
    color: colors.purple,
    fontSize: windowHeight * 0.025,
    fontWeight: "900",
    letterSpacing: 2,
    fontFamily: "MontserratBold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 20,
  },

  line: {
    marginTop: windowHeight * 0.015,
    width: "100%",
    backgroundColor: colors.bgcolor,
    height: 0.5,
  },

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 35,
  },

  tabText: {
    fontSize: windowHeight * 0.025,
    color: colors.purple,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    paddingBottom: 2,
    opacity: 0.6,
    fontFamily: "MontserratBold",
  },

  tabTextActive: {
    fontSize: windowHeight * 0.025,
    color: colors.pink,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderColor: colors.pink,
    fontFamily: "MontserratBold",
  },

  episodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  upDownIcon: {
    width: windowHeight * 0.02,
    height: windowHeight * 0.02,
    resizeMode: "contain",
    marginRight: 10,
  },
  winningNumber: {
    color: colors.white,
    textAlign: "center",
    fontFamily: "MontserratBold",
  },
});

export default Schedule;
