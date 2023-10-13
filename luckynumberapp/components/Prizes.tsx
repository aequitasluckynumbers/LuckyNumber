import { Dimensions, Image, StyleSheet, View } from "react-native";
import { PRIZES_BASE_URL } from "../utils/constants";
import React from "react";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Prizes({ prizes }: { prizes: any }) {
  return (
    <View>
      <View style={styles.imageContainer}>
        {prizes &&
          prizes.map((item: string) => (
            <Image
              style={styles.image}
              source={{
                uri: PRIZES_BASE_URL + item,
              }}
              alt={item}
              key={item}
            />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    gap: 8,
  },
  image: {
    borderRadius: 4,
    height: windowHeight * 0.1,
    width: windowWidth * 0.8,
    alignSelf: "center",
    resizeMode: "contain",
    overflow: "hidden",
  },
});
