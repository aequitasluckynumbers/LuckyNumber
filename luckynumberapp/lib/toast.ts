import {ToastAndroid} from "react-native";
import {Platform} from "react-native";
import Toast from "react-native-root-toast";

export const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Toast.show(message);
  }
};
