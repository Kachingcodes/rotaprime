// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeunRUucrUGJY8XTICP8SnLdhHus8Ka4o",
  authDomain: "rotaprime-2bf3e.firebaseapp.com",
  projectId: "rotaprime-2bf3e",
  storageBucket: "rotaprime-2bf3e.firebasestorage.app",
  messagingSenderId: "736867550917",
  appId: "1:736867550917:web:97515b789174e9548612ac",
  measurementId: "G-HKE3ZRGL5J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);