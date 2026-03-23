// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtlioYXwhHn-30_PYO3CYMxLS9iNajJxE",
  authDomain: "chromo-f8739.firebaseapp.com",
  projectId: "chromo-f8739",
  storageBucket: "chromo-f8739.firebasestorage.app",
  messagingSenderId: "342933557170",
  appId: "1:342933557170:web:72b37db9df2afb27c85eab",
  measurementId: "G-MKL6EQ5DH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Verify connection
if (app) {
  console.log("Firebase connected successfully:", app.name);
} else {
  console.error("Firebase connection failed");
}

export { app, analytics };
