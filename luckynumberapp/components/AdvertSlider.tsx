import React, { useEffect, useState } from "react";
import { Dimensions, Image } from "react-native";
import { ADVERT_BASE_URL } from "../utils/constants";
import { View, StyleSheet } from "react-native";
import colors from "../utils/colors";
import Carousel from "react-native-snap-carousel";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AdvertSlider = ({ data }: { data: any[] }) => {
  // const [active, setActive] = useState("");
  // const [index, setIndex] = useState(0);

  // //TODO: Fix this as a slider
  // useEffect(() => {
  //   // console.log(data);
  //   // const len = data.length;
  //   // setActive(data[0]?.image ? "" : "");
  //   // const timeout = setTimeout(() => {
  //   //   console.log(active);
  //   //   console.log(index);
  //   //   if (index === len - 1) {
  //   //     setIndex(0);
  //   //     setActive(ADVERT_BASE_URL + data[0]?.image);
  //   //   } else {
  //   //     setIndex((prev) => prev + 1);
  //   //     setActive(ADVERT_BASE_URL + data[index]?.image);
  //   //   }
  //   // }, 1000);
  //   // clearTimeout(timeout);

  //   setActive(ADVERT_BASE_URL + data[0]?.image);
  // }, [data]);

  return (
    <>
      <View style={styles.banner}>
        {/* {active && (
          <Image
            resizeMode="contain"
            source={{
              uri: active,
            }}
            style={styles.image}
          />
        )} */}

        <Carousel
          autoplay={true}
          loop={true}
          data={data}
          renderItem={renderItem}
          itemWidth={windowWidth * 0.9}
          sliderWidth={windowWidth * 0.9}
        />
      </View>
    </>
  );
};

export default AdvertSlider;

const renderItem = ({ item, index }: { item: any; index: number }) => (
  <View>
    <Image
      resizeMode="contain"
      source={{
        uri: ADVERT_BASE_URL + item.image,
      }}
      style={styles.image}
    />
  </View>
);

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 80,
    backgroundColor: colors.white,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 5,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
