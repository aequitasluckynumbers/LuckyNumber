import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GameTitle from "../components/GameTitle";
import global from "../styles/global";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { LinearGradient } from "expo-linear-gradient";
import { BG_COLORS } from "../utils/constants";
import { useFonts } from "expo-font";

// const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type GameResultProps = NativeStackScreenProps<
  RootStackParamsList,
  "GameResult"
>;

const GameResult = ({ route, navigation }: GameResultProps) => {
  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  // getting prams for result of the game
  const { winner } = route.params;

  console.log({ winner });

  const handleUpdateGame = () => {
    navigation.navigate("Home");
  };

  if (loaded) {
    return (
      <LinearGradient colors={BG_COLORS} style={global.bg}>
        <SafeAreaView>
          <View style={global.container}>
            <View style={styles.resultSection}>
              <View style={styles.StarTitleSection}>
                <GameTitle
                  titlewidth={windowHeight * 0.4}
                  titleheight={windowHeight * 0.35}
                />
              </View>

              <View>
                {/* displaying content based on winner results */}
                {winner && (
                  <>
                    <Text
                      style={[
                        global.XBigText,
                        { fontSize: windowHeight * 0.034, letterSpacing: 1 },
                      ]}
                    >
                      Congratulations{"\n"}You Win
                    </Text>
                    <Text
                      style={[
                        global.mediumText,
                        styles.resultDesc,
                        { fontFamily: "Montserrat", marginTop: 10 },
                      ]}
                    >
                      Congratulations you have won! You will shortly receive an
                      unique code to claim your prize.
                    </Text>
                  </>
                )}
                {!winner && (
                  <>
                    <Text
                      style={[
                        global.XBigText,
                        { fontSize: windowHeight * 0.035 },
                      ]}
                    >
                      Better Luck{"\n"}Next Time
                    </Text>
                    <Text
                      style={[
                        global.mediumText,
                        styles.resultDesc,
                        { fontFamily: "Montserrat", marginTop: 10 },
                      ]}
                    >
                      Unfortunately you didn't win but you can try again in next
                      game
                    </Text>
                  </>
                )}
              </View>

              <TouchableOpacity
                onPress={handleUpdateGame}
                style={[
                  global.lightbluebtn,
                  styles.backHomeSection,
                  { marginTop: 20 },
                ]}
              >
                <Text style={[global.BigText, styles.backHomeBtn]}>
                  BACK TO HOME
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  StarTitleSection: {
    height: "48%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  resultSection: {
    gap: 40,
  },

  resultDesc: {
    textAlign: "center",
    marginVertical: "4%",
    marginHorizontal: "8%",
  },

  backHomeSection: {
    marginHorizontal: "3%",
  },

  backHomeBtn: {
    textAlign: "center",
    marginVertical: "3%",
    fontWeight: "600",
  },
});

export default GameResult;
