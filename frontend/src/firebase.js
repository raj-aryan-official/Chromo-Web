// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtlioYXwhHn-30_PYO3CYMxLS9iNajJxE",
  authDomain: "chromo-f8739.firebaseapp.com",
  projectId: "chromo-f8739",
  storageBucket: "chromo-f8739.firebasestorage.app",
  messagingSenderId: "342933557170",
  appId: "1:342933557170:web:72b37db9df2afb27c85eab",
  measurementId: "G-MKL6EQ5DH5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const db = getFirestore(app);

if (app) {
  console.log("Firebase connected successfully:", app.name);
} else {
  console.error("Firebase connection failed");
}

export { app, auth, analytics, db };
