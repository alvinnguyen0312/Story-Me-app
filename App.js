import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { db, auth } from "./FirebaseConfig";
import Login from "./components/Login";
import StoryList from "./components/StoryList";
import StoryInput from "./components/StoryInput";
import StoryDisplay from "./components/StoryDisplay";
import * as MailComposer from "expo-mail-composer";
import * as Sharing from "expo-sharing";

export default function App() {
  const [storyList, setStoryList] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [storyDisplayMode, setStoryDisplayMode] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");

  const addStoryHandler = (
    title,
    description,
    photo,
    setTitle,
    setDescription,
    setPhoto
  ) => {
    var randomKey = Math.random()
      .toString()
      .slice(2, 10);
    setStoryList(storyList => [
      ...storyList,
      {
        key: randomKey,
        value: {
          title: title,
          description: description,
          photoUri: photo
        }
      }
    ]);
    setTitle("");
    setDescription("");
    setIsAddMode(false);
    setPhoto("someuri");
    saveDataWithFirebase(randomKey, title, description, photo);
  };

  const displayStory = id => {
    setStoryDisplayMode(true);
    setSelectedDescription(
      storyList.find(element => element.key === id).value.description
    );
    setSelectedTitle(storyList.find(element => element.key === id).value.title);
  };
  const exitInputHandler = () => {
    setIsAddMode(false);
  };
  const exitStoryDisplayHandler = () => {
    setStoryDisplayMode(false);
  };
  const sendEmail = id => {
    //get selected Story
    var selectedStory = storyList.filter(story => story.key === id)[0];

    var options = {
      subject: selectedStory.value.title,
      body: selectedStory.value.description,
      attachments: [selectedStory.value.photoUri]
    };

    MailComposer.composeAsync(options).then(result => {
      Alert.alert(
        "Awesome!",
        `Your email has been ${result.status}`,
        [{ text: "Close" }],
        {
          cancelable: false
        }
      );
    });
  };
  const deleteStory = id => {
    Alert.alert(
      "Oops!",
      `Are you sure you want to delete this story?`,
      [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: () => {
            setStoryList(storyList =>
              storyList.filter(story => story.key !== id)
            );
            deleteSelectedDataInFireBase(id);
          }
        }
      ],
      {
        cancelable: false
      }
    );
  };
  const signoutWithFirebase = () => {
    auth.signOut().then(function() {
      // if logout was successful
      if (!auth.currentUser) {
        Alert.alert(
          "Oops!",
          `Are you sure you want to sign out?`,
          [
            { text: "Cancel" },
            {
              text: "OK",
              onPress: () => {
                setRequireLogin(true);
                setLoggedIn(false);
                setStoryList([]); //reset after sign out
              }
            }
          ],
          {
            cancelable: false
          }
        );
      }
    });
  };

  function saveDataWithFirebase(id, title, description, photo) {
    var userId = auth.currentUser.uid;
    // SAVE DATA TO REAL-TIME DB
    db.ref("users/" + userId)
      .child(id)
      .set({
        id: id,
        title: title,
        description: description,
        photoURI: photo
      });
  }

  function retrieveDataFromFirebase() {
    var userId = auth.currentUser.uid;
    // read once from db
    db.ref("/users/" + userId)
      .once("value")
      .then(function(snapshot) {
        snapshot.forEach(s => {
          setStoryList(storyList => [
            ...storyList,
            {
              key: s.val().id,
              value: {
                title: s.val().title,
                description: s.val().description,
                photoUri: s.val().photoURI
              }
            }
          ]);
        });
      });
  }

  function deleteSelectedDataInFireBase(id) {
    var userId = auth.currentUser.uid;
    var delRecord = db.ref("users/" + userId).child(id);
    delRecord.remove();
  }

  const loginWithFirebase = (loginEmail, loginPassword) => {
    if (loginEmail.length < 4) {
      Alert.alert("Please enter an email address.");
      return;
    }

    if (loginPassword.length < 4) {
      Alert.alert("Please enter a password.");
      return;
    }

    auth
      .signInWithEmailAndPassword(loginEmail, loginPassword)
      .then(function(_firebaseUser) {
        Alert.alert("Welcome to Story Me!");
        setLoggedIn(true);
        setRequireLogin(false);
        // load data
        retrieveDataFromFirebase();
      })
      .catch(function(error) {
        var errorCode = error.code;
        console.log(errorCode);

        if (errorCode === "auth/wrong-password") {
          Alert.alert("Your password is not correct.");
        } else if (errorCode === "auth/user-not-found") {
          Alert.alert(
            "Your email is not correct or has not been registered yet."
          );
        }
      });
  };

  const shareImage = async id => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert(`Sharing feature isn't available on your device!`);
      return;
    }
    //get selected Story
    var selectedStory = storyList.filter(story => story.key === id)[0];
    console.log(selectedStory.value.photoUri);
    if (selectedStory.value.photoUri === "someuri") {
      /// no image uploaded by user when creating a story
      Alert.alert("Image is not available for this story");
      return;
    }
    Sharing.shareAsync(selectedStory.value.photoUri);
  };

  return (
    <View style={styles.container}>
      <Login onSignIn={loginWithFirebase} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={signoutWithFirebase}>
          <Image
            source={require("./images/signout-icon.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsAddMode(true)}>
          <View style={styles.buttonAdd}>
            <Text style={styles.text}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
      <StoryInput
        visible={isAddMode}
        onAddStory={addStoryHandler}
        onExitStoryInput={exitInputHandler}
      />
      <FlatList
        data={storyList}
        renderItem={storyData => (
          <StoryList
            id={storyData.item.key}
            onSelectStory={displayStory}
            title={storyData.item.value.title}
            photo={storyData.item.value.photoUri}
            onSendEmail={sendEmail}
            onDelete={deleteStory}
            onShareImage={shareImage}
          />
        )}
      />
      <StoryDisplay
        visible={storyDisplayMode}
        storyDescription={selectedDescription}
        storyTitle={selectedTitle}
        onExitStoryDisplay={exitStoryDisplayHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column"
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 30
  },
  buttonAdd: {
    borderRadius: 90,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginLeft: "80%",
    backgroundColor: "#f7c744"
  },
  text: {
    fontWeight: "bold",
    color: "white",
    fontSize: 40
  },
  icon: {
    height: 30,
    width: 30,
    marginLeft: 30,
    marginTop: 40
  }
});
