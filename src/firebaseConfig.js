// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRlwSXwBgVypiLZJorQI9Pnfj2MR3ctNU",
  authDomain: "sayittogether-43b49.firebaseapp.com",
  projectId: "sayittogether-43b49",
  storageBucket: "sayittogether-43b49.appspot.com",
  messagingSenderId: "395016036998",
  appId: "1:395016036998:web:e0355ee6c8f4467ae92707",
  measurementId: "G-QBVPGLN151"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };