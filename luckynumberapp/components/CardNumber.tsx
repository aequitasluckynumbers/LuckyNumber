import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import colors from "../utils/colors";
import { Game } from "../types/game";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type CardNumberProps = {
  number: number;
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
  game: Game;
};

export default function CardNumber({
  number,
  selected,
  setSelected,
  game,
}: CardNumberProps): JSX.Element {
  const [] = useFonts({
    BebasNeue: require("../assets/fonts/BebasNeue-Regular.ttf"),
  });

  const [color, setColor] = useState(["#0D87B4", "#1D4778"]);

  const sleep = (s: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, s);
    });
  };

  const animate = async () => {
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        setColor(["#DBA902", "#DBA902"]);
        await sleep(70);
      } else {
        setColor(["#0D87B4", "#1D4778"]);
        await sleep(10);
      }
    }
  };
  const handleOnClick = async () => {
    if (selected.includes(number)) return;
    await animate();
    await sleep(100);
    await animate();

    // check if it is in winning numbers
    const index: number = game.winning_numbers.indexOf(number);

    // not a winning number
    if (index === -1) return;

    // winning number

    // get current time
    const now: number = Date.now();

    const startsAt: number = Date.parse(game.starts_at);

    // Calculate the arrivalTime based on the start time and the indexed arrival offset
    const timeReleased = game.time_arr[index] * 1000;
    const arrivalTime: number = startsAt + timeReleased;

    // number is not arrived yet
    if (now < arrivalTime) return;

    setSelected((prev: number[]) => [number, ...prev]);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOnClick}>
      <LinearGradient
        colors={selected.includes(number) ? ["#DBA902", "#DBA902"] : color}
        style={styles.cardNumber}
      >
        <Text style={styles.numberText}>{number === 0 ? "" : number}</Text>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardNumber: {
    width: windowWidth * 0.16,
    height: windowHeight * 0.13,
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
});
