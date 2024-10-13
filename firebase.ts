// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdffASPvRB5EH9Y4J7-CIsjFc9F_2w1pI",
  authDomain: "notion-clone-2aa24.firebaseapp.com",
  projectId: "notion-clone-2aa24",
  storageBucket: "notion-clone-2aa24.appspot.com",
  messagingSenderId: "123461252894",
  appId: "1:123461252894:web:34bc3dfdb0f3c03134bb0f",
  measurementId: "G-ZBHREJ1F4Y"
};

const app = getApps().length === 0? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db, app }