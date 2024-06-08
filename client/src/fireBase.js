// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "real-estate-5f5b5.firebaseapp.com",
  projectId: "real-estate-5f5b5",
  storageBucket: "real-estate-5f5b5.appspot.com",
  messagingSenderId: "1057632473053",
  appId: "1:1057632473053:web:110a59907841a3f1f87034",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
