import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal
} from "react-native";
import { auth } from "../FirebaseConfig";

const Login = props => {
  [registrationEmail, setRegistrationEmail] = useState("");
  [registrationPassword, setRegistrationPassword] = useState("");
  [loginEmail, setLoginEmail] = useState("");
  [loginPassword, setLoginPassword] = useState("");
  [loggedIn, setLoggedIn] = useState(false);
  [databaseData, setDatabaseData] = useState("");
  [requireLogin, setRequireLogin] = useState(true);

  const registerWithFirebase = () => {
    if (registrationEmail.length < 4) {
      Alert.alert("Please enter an email address.");
      return;
    }

    if (registrationPassword.length < 4) {
      Alert.alert("Please enter a password.");
      return;
    }

    auth
      .createUserWithEmailAndPassword(registrationEmail, registrationPassword)
      .then(function(_firebaseUser) {
        Alert.alert(
          "Thank you! Your registration has been completed. Please sign in!"
        );

        setRegistrationEmail("");
        setRegistrationPassword("");
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == "auth/weak-password") {
          Alert.alert("The password is too weak.");
        } else {
          Alert.alert(errorMessage);
        }
        console.log(error);
      });
  };

  return (
    <Modal visible={requireLogin} animationType="fade">
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../images/logo-icon.gif")}
          ></Image>
          <Text style={styles.title}>Story Me</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email/Username"
            placeholderTextColor="rgba(255,255,255,0.8)"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            value={loginEmail}
            onChangeText={value => {
              setLoginEmail(value);
              setRegistrationEmail(value);
            }}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.8)"
            autoCapitalize="none"
            autoCorrect={false}
            value={loginPassword}
            returnKeyType="go"
            secureTextEntry
            onChangeText={value => {
              setLoginPassword(value);
              setRegistrationPassword(value);
            }}
          ></TextInput>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonSignIn}
              onPress={props.onSignIn.bind(
                this,
                loginEmail,
                loginPassword,
                () => setLoginEmail(""),
                () => setLoginPassword("")
              )}
            >
              <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSignUp}
              onPress={registerWithFirebase}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(25,25,25)",
    flexDirection: "column"
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 150
  },
  logo: {
    width: 100,
    height: 100
  },
  title: {
    color: "#f7c744",
    fontSize: 30,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.7,
    fontFamily: "monospace",
    marginBottom: 20
  },
  inputContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: "rgba(173,179,157,0.2)",
    color: "white",
    paddingHorizontal: 10,
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "center"
  },
  buttonText: {
    textAlign: "center",
    color: "rgb(32,53,70)",
    fontWeight: "bold",
    fontSize: 18
  },
  buttonSignIn: {
    backgroundColor: "#dcfffb",
    paddingVertical: 5,
    paddingHorizontal: 55,
    marginRight: 10
  },
  buttonSignUp: {
    backgroundColor: "#f7c744",
    paddingVertical: 5,
    paddingHorizontal: 55
  }
});

export default Login;
