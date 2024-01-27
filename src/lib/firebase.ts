// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBNQjOO5SiTvSRXhovAd751d5IgJS02-g8",
    authDomain: "fire-project-d6eda.firebaseapp.com",
    projectId: "fire-project-d6eda",
    storageBucket: "fire-project-d6eda.appspot.com",
    messagingSenderId: "153838647543",
    appId: "1:153838647543:web:d0b344104f3de225c23bf2",
    measurementId: "G-GX1TGVPW2B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
