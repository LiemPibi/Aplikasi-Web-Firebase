import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAbU-x2hS4Wc8AvpDG9yhy2RR8gfSJc5o0",
  authDomain: "product-manager-bdc83.firebaseapp.com",
  databaseURL: "https://product-manager-bdc83-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "product-manager-bdc83",
  storageBucket: "product-manager-bdc83.firebasestorage.app",
  messagingSenderId: "519624740177",
  appId: "1:519624740177:web:71ac91c9197c65907b5770",
  measurementId: "G-Y3548ZZGHD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let analytics = null;
isSupported().then((supported) => {
  if (supported) analytics = getAnalytics(app);
});

export { app, auth, db, analytics };
