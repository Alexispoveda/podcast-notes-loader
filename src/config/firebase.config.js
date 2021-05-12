const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyA40Ge9nDpHj0-3ypADsRhdodfEZPJpyKM",
    authDomain: "bibleinayearnotes.firebaseapp.com",
    projectId: "bibleinayearnotes",
    storageBucket: "bibleinayearnotes.appspot.com",
    messagingSenderId: "498542938276",
    appId: "1:498542938276:web:4427cec375c783c287be31",
    measurementId: "G-VEEMWVXQGK"
};

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = {
  db : firebase.firestore(),
  auth : firebase.auth()
} 