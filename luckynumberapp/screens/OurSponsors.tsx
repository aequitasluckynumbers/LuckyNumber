import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import global from "../styles/global";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../utils/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation";
import { BG_COLORS, COUNTRY, SPONSOR_BASE_URL } from "../utils/constants";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../lib/toast";
import { useFonts } from "expo-font";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type SponsorsProps = NativeStackScreenProps<RootStackParamsList, "Sponsors">;

const OurSponsors = ({ navigation }: SponsorsProps) => {
  const [] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
  });

  const [gold, setGold] = useState<string[]>([]);
  const [silver, setSilver] = useState<string[]>([]);

  const fetchSponsors = async () => {
    const country = await AsyncStorage.getItem(COUNTRY);
    console.log(country);
    const { data, error } = await supabase
      .from("sponsors_adverts")
      .select("*")
      .eq("type", "sponsor")
      .order("rank", { ascending: true });
    // const { data, error } = await supabase
    //   .from("sponsors_adverts")
    //   .select("*")
    //   .eq("type", "sponsor")
    //   .eq("country", country)
    //   .order("rank", { ascending: true });
    if (error) {
      console.log(error);
      showToast("Failed to get Sponsors!");
      return;
    }

    console.log(data);

    const rankOne: string[] = [];
    const rankLast: string[] = [];

    data.forEach((sponsor) => {
      const rank: number = sponsor.rank;
      if (rank < 2) {
        rankOne.push(sponsor.image);
      } else {
        rankLast.push(sponsor.image);
      }
    });

    console.log(rankOne);
    console.log(rankLast);
    setGold(rankOne);
    setSilver(rankLast);
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  return (
    <LinearGradient colors={BG_COLORS} style={global.bg}>
      <SafeAreaView style={{ flexGrow: 1 }}>
        <View style={styles.ourSponsors}>
          <Text style={styles.heading}>Our Sponsors</Text>

          <View style={{ width: "100%", alignSelf: "center" }}>
            {gold.map((sponsor) => (
              <View style={styles.fullSponsor} key={sponsor}>
                <Image
                  resizeMode="contain"
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: SPONSOR_BASE_URL + sponsor }}
                />
              </View>
            ))}

            <View style={styles.twoSponsorContainer}>
              {silver.map((sponsor) => (
                <View key={sponsor} style={styles.halfSponsor}>
                  <Image
                    source={{ uri: SPONSOR_BASE_URL + sponsor }}
                    resizeMode="cover"
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LinearGradient colors={["#0D87B4", "#1D4778"]} style={styles.btn}>
              <Text style={styles.btnText}>Close</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  heading: {
    textTransform: "uppercase",
    fontSize: 32,
    fontWeight: "700",
    color: "#BFA7F2",
    textAlign: "center",
    fontFamily: "MontserratBold",
    letterSpacing: 1,
  },
  ourSponsors: {
    justifyContent: "space-evenly",
    flex: 1,
    marginHorizontal: windowHeight * 0.04,
  },
  btn: {
    width: "100%",
    paddingVertical: 25,
    alignSelf: "center",
    borderRadius: 6,
    backgroundColor: colors.darkblue,
    marginVertical: 8,
  },
  btnText: {
    fontSize: windowHeight * 0.02,
    textTransform: "uppercase",
    color: colors.white,
    fontWeight: "600",
    letterSpacing: 3,
    textAlign: "center",
    fontFamily: "MontserratBold",
  },

  fullSponsor: {
    height: windowHeight * 0.1,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: colors.white,
    borderRadius: 5,
  },

  halfSponsor: {
    height: windowHeight * 0.08,
    width: "49%",
    justifyContent: "flex-start",
    resizeMode: "contain",
    marginBottom: 8,
    backgroundColor: colors.white,
    borderRadius: 5,
    overflow: "hidden",
  },

  twoSponsorContainer: {
    flexWrap: "wrap",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default OurSponsors;
