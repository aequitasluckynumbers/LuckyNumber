import React from "react";
import Title from "../assets/Icons/title.png";
import { Image, View } from "react-native";

const GameTitle = ({
  titlewidth,
  titleheight,
}: {
  titlewidth: number;
  titleheight: number;
}) => {
  return (
    <>
      <View>
        {/* <Image style={global.Star} source={Star} alt="" />  */}
        <View>
          <Image
            style={{
              width: titlewidth,
              height: titleheight,
              resizeMode: "contain",
            }}
            source={Title}
            alt=""
          />
        </View>
      </View>
    </>
  );
};

export default GameTitle;
