import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// });
const app = firebase.initializeApp({
  apiKey: "AIzaSyCpDCWvOYOczGhk2B7xoAez3lNSPBolEYE",
  authDomain: "wwdeal-1d10e.firebaseapp.com",
  projectId: "wwdeal-1d10e",
  storageBucket: "wwdeal-1d10e.firebasestorage.app",
  messagingSenderId: "308088254592",
  appId: "1:308088254592:web:818469bb36f00549087665",
  measurementId: "G-DNBNZLKF7S"
});

export const auth = app.auth();
export const db = app.firestore();
export const storage = app.storage();
export default app; 