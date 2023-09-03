import { Game } from "./types/game";

export type RootStackParamsList = {
  Splash: undefined;
  Welcome: undefined;
  SignUp: { authType: string; email: string };
  Login: undefined;
  Otp: { user: any; authType: string; phoneNo: string };
  Home: undefined;
  Game: { game: Game };
  Profile: undefined;
  GameResult: { winner: boolean };
  Sponsors: undefined;
  Schedule: undefined;
  PrivacyPolicy: undefined;
  HowToPlay: undefined;
  SomethingWrong: undefined;
  ConnectionLost: undefined;
};
