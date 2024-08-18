import firebase from "firebase/compat/app";
import "firebase/compat/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAmc0A7AOxLisGs9pmh2KWt78VaDGaxXjA",
  authDomain: "speed1-37b90.firebaseapp.com",
  projectId: "speed1-37b90",
  storageBucket: "speed1-37b90.appspot.com",
  messagingSenderId: "139374777388",
  appId: "1:139374777388:web:11c797ddca96ed21baed89",
  measurementId: "G-27M2HYFW1W"
};

firebase.initializeApp(firebaseConfig);

export default firebase;