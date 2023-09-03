import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../utils/colors";

const GenderPicker = ({
  gender,
  setFieldValue,
  setGenderPicker,
}: {
  gender: string;
  setFieldValue: any;
  setGenderPicker: any;
}) => {
  const handleChangeGender = (newgender: string) => {
    setFieldValue("gender", newgender);
    setGenderPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text
        onPress={() => handleChangeGender("Male")}
        style={styles.textSelect}
      >
        Male
      </Text>

      <Text
        onPress={() => handleChangeGender("Female")}
        style={styles.textSelect}
      >
        Female
      </Text>
      <Text
        onPress={() => handleChangeGender("Other")}
        style={styles.textSelect}
      >
        Others
      </Text>
    </View>
  );
};

export default GenderPicker;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkblue,
    marginTop: 5,
    borderRadius: 5,
  },
  textSelect: {
    color: colors.white,
    padding: 10,
  },
});
