import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYi_gVY2AdYpMFkOoyHW8YHFNFL4GPzxQ",
  authDomain: "vue-viviomega.firebaseapp.com",
  databaseURL:
    "https://vue-viviomega-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vue-viviomega",
  storageBucket: "vue-viviomega.appspot.com",
  messagingSenderId: "623166953233",
  appId: "1:623166953233:web:b2f2f99d093c81f8b4deb0",
  measurementId: "G-HD4MMRL1CC",
};
const firebase = initializeApp(firebaseConfig);
const isEmulating = window.location.hostname === "localhost";
if (isEmulating) {
  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");

  const storage = getStorage();
  connectStorageEmulator(storage, "localhost", 9199);

  const db = getFirestore(firebase);
  connectFirestoreEmulator(db, "localhost", 8080);

  const functions = getFunctions(firebase);
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export const firebaseApp = () => {
  return firebase;
};

export default firebase;
