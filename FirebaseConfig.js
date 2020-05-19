import * as firebase from "firebase";
import "@firebase/firestore";

// need to run: npm install --save firebase
// We will use the JS SDK with React Native

var firebaseConfig = {
  apiKey: "AIzaSyAZRW6TP-jB_PsWkMhIN66XNPOEiH1C_MI",
  authDomain: "pinnedstoryapp.firebaseapp.com",
  databaseURL: "https://pinnedstoryapp.firebaseio.com",
  projectId: "pinnedstoryapp",
  storageBucket: "pinnedstoryapp.appspot.com",
  messagingSenderId: "658934925791",
  appId: "1:658934925791:web:132156dccb4112716fdc6a"
};

let app = firebase.initializeApp(firebaseConfig);

export const db = app.database();
export const firestore = firebase.firestore(app);
export const auth = app.auth();
