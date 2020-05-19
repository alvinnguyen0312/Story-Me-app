import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";

StoryInput = props => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("someuri");

  const titleInputHandler = title => {
    setTitle(title);
  };
  const descriptionInputHandler = description => {
    setDescription(description);
  };
  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    setPhoto(pickerResult.uri);
  };

  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.parentContainer}>
        <TouchableOpacity onPress={props.onExitStoryInput}>
          <View>
            <Text style={styles.exitText}>{"x"}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>Story Box</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Title"
            style={styles.input}
            onChangeText={titleInputHandler}
            value={title}
            placeholderTextColor="#8E9294"
            returnKeyType="next"
          />
          <TextInput
            placeholder="Description"
            style={styles.input}
            onChangeText={descriptionInputHandler}
            value={description}
            placeholderTextColor="#8E9294"
            returnKeyType="next"
          />
          <View>
            <TouchableOpacity onPress={openImagePickerAsync}>
              <Image
                style={styles.logo}
                source={require("../images/camera-icon.png")}
              />
            </TouchableOpacity>
            <Image source={{ uri: photo }} style={styles.thumbnail} />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={props.onAddStory.bind(
              this,
              title,
              description,
              photo,
              () => setTitle(""),
              () => setDescription(""),
              () => setPhoto("someuri")
            )}
          >
            <View style={styles.buttonCreate}>
              <Text style={styles.text}>CREATE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "white"
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5
  },
  input: {
    width: "90%",
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  buttonCreate: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    paddingHorizontal: 30,
    backgroundColor: "#f7c744"
  },
  header: {
    marginLeft: 80,
    fontFamily: "serif",
    fontSize: 50,
    marginBottom: "5%",
    color: "black",
    fontWeight: "bold"
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 118
  },
  exitText: {
    fontWeight: "bold",
    fontSize: 40,
    paddingHorizontal: 40,
    marginBottom: 50
  },
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    paddingHorizontal: 200
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: "44%"
  }
});

export default StoryInput;
