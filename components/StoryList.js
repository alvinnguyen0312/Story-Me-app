import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const StoryList = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onSelectStory.bind(this, props.id)}
    >
      <View style={styles.storyContainer}>
        <View style={styles.column1}>
          <Image source={{ uri: props.photo }} style={styles.image}></Image>
        </View>
        <View style={styles.column2}>
          <Text style={styles.text}>{props.title}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={props.onSendEmail.bind(this, props.id)}
            >
              <Image
                source={require("../images/mail-icon.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={props.onDelete.bind(this, props.id)}
            >
              <Image
                source={require("../images/bin-icon.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={props.onShareImage.bind(this, props.id)}
            >
              <Image
                source={require("../images/images-sharing-icon.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  storyContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black"
  },
  column1: {
    width: 100,
    height: 250,
    margin: 5,
    flex: 1,
    flexDirection: "column",
    borderRadius: 20
  },
  column2: {
    width: 100,
    height: 300,
    margin: 5,
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
    justifyContent: "center"
  },
  image: {
    width: 200,
    height: 250,
    borderRadius: 20
  },
  text: {
    color: "white",
    fontSize: 20,
    paddingLeft: 30
  },
  icon: {
    height: 30,
    width: 30,
    marginLeft: 30,
    marginBottom: 10
  },
  iconContainer: {
    paddingTop: 50
  }
});

export default StoryList;
