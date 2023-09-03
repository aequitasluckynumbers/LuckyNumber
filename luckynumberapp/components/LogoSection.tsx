import { Dimensions, Image, StyleSheet } from "react-native";
import GmaLogo from "../assets/Icons/gmalogo.png";

// const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const LogoSection = () => {
  return (
    <>
      <Image style={styles.gmalogo} source={GmaLogo} />
    </>
  );
};

const styles = StyleSheet.create({
  gmalogo: {
    width: windowHeight * 0.08,
    height: windowHeight * 0.037,
  },
});
export default LogoSection;
