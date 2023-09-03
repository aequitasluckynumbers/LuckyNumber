import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";

const CustomSelectModal = ({ options, selectedOption, onSelect, style }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOp, setSelectedOp] = useState(selectedOption);

  const handleSelect = (option) => {
    setSelectedOp(option);
    onSelect(option);
    setModalVisible(false);
  };

  console.log(selectedOption);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          value={selectedOp}
          style={[style, { paddingLeft: 10 }]}
          placeholderTextColor="white"
          editable={false}
          placeholderTextColor="white"
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{ backgroundColor: "#fff", borderRadius: 8, padding: 16 }}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleSelect(option)}
                style={{ paddingVertical: 8, paddingHorizontal: 16 }}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 16 }}
            >
              <Text
                style={{
                  color: "red",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomSelectModal;
