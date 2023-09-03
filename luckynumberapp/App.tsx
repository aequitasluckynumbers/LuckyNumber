import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Otp from "./screens/Otp";

import Splash from "./screens/Splash";
import Welcome from "./screens/Welcome";
import GameResult from "./screens/GameResult";
import HowToPlay from "./screens/HowToPlay";
import SomethingWrong from "./screens/SomethingWrong";
import ConnectionLost from "./screens/ConnectionLost";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import Home from "./screens/Home";
import Schedule from "./screens/Schedule";
import Game from "./screens/Game";
import OurSponsors from "./screens/OurSponsors";
import { RootStackParamsList } from "./navigation";

export default function App(): JSX.Element {
  const Stack = createNativeStackNavigator<RootStackParamsList>();

  let [loaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
  });

  const [fontsLoaded, setFontsLoaded] = useState<boolean>();

  useEffect(() => {
    setFontsLoaded(loaded);
  }, [loaded]);

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Splash"
          >
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{ animation: "fade" }}
            />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="GameResult" component={GameResult} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="Schedule" component={Schedule} />
            <Stack.Screen name="HowToPlay" component={HowToPlay} />
            <Stack.Screen name="SomethingWrong" component={SomethingWrong} />
            <Stack.Screen name="ConnectionLost" component={ConnectionLost} />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ animation: "fade" }}
            />
            <Stack.Screen name="Game" component={Game} />
            <Stack.Screen name="Sponsors" component={OurSponsors} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
}
