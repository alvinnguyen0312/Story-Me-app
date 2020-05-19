import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

const StoryDisplay = props => {
  return (
    <Modal visible={props.visible} animationType="fade" transparent={true}>
      <View style={styles.parentContainer}>
        <View>
          <TouchableOpacity onPress={props.onExitStoryDisplay}>
            <View style={styles.buttonReveal}>
              <Text style={styles.text}>{props.storyDescription}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 150
  },
  buttonReveal: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: 100,
    paddingVertical: 100,
    backgroundColor: "rgba(247, 199, 68,0.9)"
  },
  text: {
    color: "black"
  }
});

export default StoryDisplay;
