
// @ts-ignore
import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBDVmBjwNEDNWiKDKyPWJjj8BJXsOPRdBM",
    authDomain: "payra-c5691.firebaseapp.com",
    projectId: "payra-c5691",
    storageBucket: "payra-c5691.appspot.com",
    messagingSenderId: "157209052155",
    appId: "1:157209052155:web:3877a3d34f37c9e835c15e",
    measurementId: "G-JCVE0EYKLQ"
};
firebase.initializeApp(config);
export  const auth = firebase.auth;
export  const db = firebase.database();



