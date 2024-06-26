import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import global from "../styles/global";
import GameTitle from "../components/GameTitle";
import colors from "../utils/colors";
import CardNumber from "../components/CardNumber";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { showToast } from "../lib/toast";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { BG_COLORS, COUNTRY } from "../utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import { StackActions } from "@react-navigation/native";
import AdvertSlider from "../components/AdvertSlider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import LoadingPopup from "../popups/LoadingPopup";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type GameProps = NativeStackScreenProps<RootStackParamsList, "Game">;

export default function Game({ route, navigation }: GameProps) {
  const NumberArray = new Array(15).fill(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<Array<number>>(NumberArray);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [adverts, setAdverts] = useState<any[]>([]);
  const [cardId, setCardId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [winningStatus, setWinningStatus] = useState(false);
  const modalRef = useRef(false);
  const { game } = route.params;

  const [] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
    BebasNeue: require("../assets/fonts/BebasNeue-Regular.ttf"),
  });

  const getGameCard = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("game-card", {
      body: {
        gameId: game.id,
      },
    });

    console.log(data);

    if (error) {
      console.log(error);
      showToast(error);
      return;
    }

    setNumbers(data[0].numbers);
    setCardId(data[0].id);
    setLoading(false);
  };

  const getAdvert = async () => {
    const country = await AsyncStorage.getItem(COUNTRY);

    const { data, error } = await supabase
      .from("sponsors_adverts")
      .select()
      .eq("type", "advert");
    // const { data, error } = await supabase
    //   .from("sponsors_adverts")
    //   .select()
    //   .eq("country", country)
    //   .eq("type", "advert");

    if (error) {
      console.log(error);
      return;
    }
    // console.log(data);
    setAdverts(data);
  };

  useEffect(() => {
    getGameCard();
    getAdvert();
  }, []);

  // checks game timing and closes screen when timer ends
  useEffect(() => {
    let timerId: any;
    var gameStartTime = Date.parse(game?.starts_at);
    var duration = game.time_arr[game.time_arr.length - 1] * 1000;
    var now: number = Date.now();

    var gameEndTime = gameStartTime + duration + 10000;
    var remainingTime = gameEndTime - now;

    console.log({ remainingTime });

    if (remainingTime < 0) {
      setWinningStatus(false);
      setModalVisible(true);
    } else {
      timerId = setTimeout(() => {
        setWinningStatus(false);
        setModalVisible(true);
      }, remainingTime);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (!modalVisible && modalRef.current)
      navigation.dispatch(
        StackActions.replace("GameResult", { winner: winningStatus })
      );

    if (modalVisible !== modalRef.current) {
      modalRef.current = modalVisible;
    }
  }, [modalVisible]);

  useEffect(() => {
    if (selected.length === 15) {
      setTimeout(async () => {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "update-game-result",
          {
            body: {
              cardId,
            },
          }
        );

        console.log({ data, error });

        setLoading(false);
        setWinningStatus(true);
        setModalVisible(true);
      }, 3000);
    }
  }, [selected, cardId, navigation]);

  return (
    <>
      {loading && <LoadingPopup message="" />}
      <LinearGradient colors={BG_COLORS} style={global.bg}>
        <SafeAreaView
          style={[
            global.container,
            { marginVertical: 0, marginHorizontal: windowWidth * 0.06 },
          ]}
        >
          <Navbar navigation={navigation} />
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <GameTitle
              titlewidth={windowWidth * 0.7}
              titleheight={windowHeight * 0.25}
            />
          </View>

          <View style={styles.bingoCardContainer}>
            {numbers !== undefined &&
              numbers.map((num, i) => (
                <CardNumber
                  key={i}
                  number={num}
                  selected={selected}
                  setSelected={setSelected}
                  game={game}
                />
              ))}
          </View>

          <AdvertSlider data={adverts} />
        </SafeAreaView>
      </LinearGradient>

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
            <Text style={[global.XBigText, { fontSize: windowHeight * 0.028 }]}>
              Game Has Ended
            </Text>
            <Pressable
              style={[global.lightbluebtn, styles.button, { marginTop: 20 }]}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={[global.mediumText, styles.closeTxt]}>
                Check Result
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bingoCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    marginTop: windowHeight * 0.04,
  },

  cardNumber: {
    width: windowWidth * 0.22,
    height: windowHeight * 0.15,
    backgroundColor: colors.darkblue,
    borderRadius: 8,
    marginVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  numberText: {
    fontFamily: "BebasNeue",
    fontWeight: "400",
    fontSize: windowWidth * 0.12,
    color: "#fff",
  },

  prize: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.12,
    alignSelf: "center",
    resizeMode: "contain",
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
