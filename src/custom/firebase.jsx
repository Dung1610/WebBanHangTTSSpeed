import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoFohax6_FVJBdmxMsWFgg3eTFOjkhDO0",
  authDomain: "speed2-f7f0c.firebaseapp.com",
  projectId: "speed2-f7f0c",
  storageBucket: "speed2-f7f0c.appspot.com",
  messagingSenderId: "116700057843",
  appId: "1:116700057843:web:8382488304c802a8642786",
  measurementId: "G-DZF0H55HG3",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
